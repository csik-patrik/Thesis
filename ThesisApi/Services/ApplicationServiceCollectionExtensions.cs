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
            services.AddScoped<IComputerCategoryRepository, ComputerCategoryRepository>();
            services.AddScoped<IComputerRepository, ComputerRepository>();
            services.AddScoped<IComputerOrderRepository, ComputerOrderRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddSingleton<TokenGenerator>();
            return services;
        }
    }
}