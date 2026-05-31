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
        Task<IEnumerable<AuditLog>> GetAllAsync();
    }
}