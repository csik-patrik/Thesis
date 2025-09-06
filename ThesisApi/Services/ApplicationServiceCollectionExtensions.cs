using ThesisApi.Interfaces;
using ThesisApi.Repositories;

namespace ThesisApi.Services
{
    public static class ApplicationServiceCollectionExtensions
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {

            services.AddScoped<IAdminRepository, AdminRepository>();
            services.AddScoped<ISimCardRepository, SimCardsRepository>();
            services.AddScoped<IMobileDeviceRepository, MobileDevicesRepository>();
            services.AddScoped<IMobileOrderRepository, MobileOrderRepository>();
            services.AddSingleton<TokenGenerator>();
            services.AddScoped<UserService>();
            return services;
        }
    }
}