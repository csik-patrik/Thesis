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
        Task<IEnumerable<AuditLog>> GetAllAsync();
    }
}