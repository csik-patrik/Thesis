using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IAuditLogsRepository
    {
        Task<AuditLog> CreateLoginLog(User user);
        Task<AuditLog> CreateGetUsersLog(User user);
        Task<IEnumerable<AuditLog>> GetAllAsync();
    }
}