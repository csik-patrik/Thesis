using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IAuditLogsRepository
    {
        Task<AuditLog> CreateLoginLog(User user);
        Task<AuditLog> CreateGetUsersLog(User user);
        Task<AuditLog> CreateGetUserLog(User user, int userId);
        Task<AuditLog> CreateNewUserLog(User user, int newUserId);
        Task<AuditLog> CreateDeleteUserLog(User user, int userId);
        Task<AuditLog> CreateGetMobileDevicesLog(User user);
        Task<AuditLog> CreateGetMobileDeviceLog(User user, int mobileDeviceId);
        Task<AuditLog> CreateNewMobileDeviceLog(User user, int mobileDeviceId);
        Task<AuditLog> CreateDeleteMobileDeviceLog(User user, int mobileDeviceId);
        Task<AuditLog> CreateGetComputersLog(User user);
        Task<AuditLog> CreateGetComputerLog(User user, int computerId);
        Task<AuditLog> CreateNewComputerLog(User user, int computerId);
        Task<AuditLog> CreateDeleteComputerLog(User user, int computerId);
        Task<AuditLog> CreateGetComputerOrdersLog(User user);
        Task<AuditLog> CreateGetComputerOrderLog(User user, int computerOrderId);
        Task<AuditLog> CreateNewComputerOrderLog(User user, int computerOrderId);
        Task<AuditLog> CreateDeleteComputerOrderLog(User user, int computerOrderId);
        Task<AuditLog> CreateGetMobileOrdersLog(User user);
        Task<AuditLog> CreateGetMobileOrderLog(User user, int mobileOrderId);
        Task<AuditLog> CreateNewMobileOrderLog(User user, int mobileOrderId);
        Task<AuditLog> CreateDeleteMobileOrderLog(User user, int mobileOrderId);
        Task<AuditLog> CreateGetSimCardsLog(User user);
        Task<AuditLog> CreateGetSimCardLog(User user, int simCardId);
        Task<AuditLog> CreateNewSimCardLog(User user, int simCardId);
        Task<AuditLog> CreateDeleteSimCardLog(User user, int simCardId);
        Task<IEnumerable<AuditLog>> GetAllAsync();
    }
}