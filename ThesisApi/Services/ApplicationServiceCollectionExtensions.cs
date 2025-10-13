using ThesisApi.Interfaces;
using ThesisApi.Repositories;

namespace ThesisApi.Services
{
    public static class ApplicationServiceCollectionExtensions
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserRoleRepository, UserRoleRepository>();
            services.AddScoped<ISimCardRepository, SimCardsRepository>();
            services.AddScoped<ISimCallControlGroupRepository, SimCardCallControlGroupRepository>();
            services.AddScoped<IMobileDeviceRepository, MobileDevicesRepository>();
            services.AddScoped<IMobileDeviceCategoryRepository, MobileDeviceCategoryRepository>();
            services.AddScoped<IMobileOrderRepository, MobileOrderRepository>();
            services.AddSingleton<TokenGenerator>();
            return services;
        }
    }
}