using ThesisApi.Interfaces;
using ThesisApi.Repositories;

namespace ThesisApi.Services
{
    public static class ApplicationServiceCollectionExtensions
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<ISimCardRepository, SimCardRepository>();
            return services;
        }
    }
}