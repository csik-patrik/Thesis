using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Context;
using Serilog.Events;
using ThesisApi.Data;
using ThesisApi.Helpers;
using ThesisApi.Hubs;
using ThesisApi.Services;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext());

    // Add services to the container.

    builder.Services.AddControllers()
        .ConfigureApiBehaviorOptions(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var logger = context.HttpContext.RequestServices
                    .GetRequiredService<ILoggerFactory>()
                    .CreateLogger("ValidationErrors");

                var errors = context.ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .Select(x => new
                    {
                        Field = x.Key,
                        Errors = x.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                    });

                var userPseudonym = context.HttpContext.Items.TryGetValue(LogAnonymizer.UserPseudonymItemKey, out var userValue)
                    ? userValue?.ToString()
                    : "anon";

                logger.LogError(
                    "Invalid model state for {Method} {Path}. User {UserPseudonym}. Validation errors: {@Errors}",
                    context.HttpContext.Request.Method,
                    context.HttpContext.Request.Path,
                    userPseudonym,
                    errors);

                return new BadRequestObjectResult(context.ModelState);
            };
        });
    // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
    builder.Services.AddOpenApi();

    builder.Services.AddApplication();

    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    });

    builder.Services.AddCors(options => options.AddPolicy("ApiCorsPolicy", builder =>
    {
        builder
            .SetIsOriginAllowed(origin =>
                    origin.StartsWith("http://localhost") ||
                    origin.Contains("91.236.195.159"))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    }));

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            var key = Encoding.UTF8.GetBytes("qweertzruztjhngbdfsavrgvfrsdgfsrdtbggfrtbgfxbfdv123123123?????????");

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = "Api",
                ValidateAudience = true,
                ValidAudience = "Users",
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero // avoids extra 5-min default tolerance
            };
        });

    builder.Services.AddSignalR();

    builder.Services.AddAuthorization();

    JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
    JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

    var app = builder.Build();

    app.ApplyMigrations();

    var forwardedHeadersOptions = new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
        ForwardLimit = 2
    };

    // In containerized/proxy setups we trust the reverse proxy chain (Nginx -> API).
    forwardedHeadersOptions.KnownNetworks.Clear();
    forwardedHeadersOptions.KnownProxies.Clear();
    app.UseForwardedHeaders(forwardedHeadersOptions);

    app.UseCors("ApiCorsPolicy");

    app.UseAuthentication();  // must come before UseAuthorization
    app.UseAuthorization();

    app.Use(async (context, next) =>
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? context.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? "anonymous";

        var userDisplayName = context.User.FindFirst("displayname")?.Value
            ?? context.User.FindFirstValue(ClaimTypes.Name)
            ?? "anonymous";

        var roles = context.User.FindAll(ClaimTypes.Role).Select(x => x.Value).ToArray();

        var userPseudonym = LogAnonymizer.Pseudonymize(userId);
        var userDisplayMasked = LogAnonymizer.MaskDisplayName(userDisplayName);
        var clientIpMasked = LogAnonymizer.MaskIp(context.Connection.RemoteIpAddress?.ToString());

        context.Items[LogAnonymizer.UserPseudonymItemKey] = userPseudonym;
        context.Items[LogAnonymizer.UserDisplayMaskedItemKey] = userDisplayMasked;
        context.Items[LogAnonymizer.ClientIpMaskedItemKey] = clientIpMasked;

        using (LogContext.PushProperty("RequestId", context.TraceIdentifier))
        using (LogContext.PushProperty("UserPseudonym", userPseudonym))
        using (LogContext.PushProperty("UserDisplayMasked", userDisplayMasked))
        using (LogContext.PushProperty("ClientIpMasked", clientIpMasked))
        using (LogContext.PushProperty("IsAuthenticated", context.User.Identity?.IsAuthenticated ?? false))
        using (LogContext.PushProperty("UserRoles", roles))
        {
            await next();
        }
    });

    app.Use(async (context, next) =>
    {
        await next();

        if (context.Response.StatusCode == StatusCodes.Status404NotFound)
        {
            var userPseudonym = context.Items.TryGetValue(LogAnonymizer.UserPseudonymItemKey, out var userValue)
                ? userValue?.ToString()
                : "anon";

            app.Logger.LogError(
                "Resource not found for {Method} {Path}. User {UserPseudonym}. Responded with status {StatusCode}",
                context.Request.Method,
                context.Request.Path,
                userPseudonym,
                context.Response.StatusCode);
        }
    });

    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} by {UserPseudonym} from {ClientIpMasked} responded {StatusCode} in {Elapsed:0.0000} ms";

        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            diagnosticContext.Set("RequestId", httpContext.TraceIdentifier);
            diagnosticContext.Set(
                "UserPseudonym",
                httpContext.Items.TryGetValue(LogAnonymizer.UserPseudonymItemKey, out var userValue)
                    ? userValue?.ToString() ?? "anon"
                    : "anon");
            diagnosticContext.Set(
                "UserDisplayMasked",
                httpContext.Items.TryGetValue(LogAnonymizer.UserDisplayMaskedItemKey, out var displayValue)
                    ? displayValue?.ToString() ?? "anonymous"
                    : "anonymous");
            diagnosticContext.Set(
                "ClientIpMasked",
                httpContext.Items.TryGetValue(LogAnonymizer.ClientIpMaskedItemKey, out var ipValue)
                    ? ipValue?.ToString() ?? "unknown"
                    : "unknown");
        };

        options.GetLevel = (httpContext, elapsed, exception) =>
        {
            if (exception is not null || httpContext.Response.StatusCode >= StatusCodes.Status500InternalServerError)
            {
                return LogEventLevel.Error;
            }

            if (httpContext.Response.StatusCode >= StatusCodes.Status400BadRequest)
            {
                return LogEventLevel.Warning;
            }

            return LogEventLevel.Information;
        };
    });

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/openapi/v1.json", "ThesisApi");
        });
    }

    app.MapControllers();
    app.MapHub<NotificationHub>("/hubs/notifications");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
