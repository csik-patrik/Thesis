using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class AuditLogRepository : IAuditLogsRepository
    {
        private readonly ApplicationDbContext _context;

        public AuditLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AuditLog> CreateDeleteUserLog(User user, int userId)
        {
            var newLog = new AuditLog()
            {
                EventType = EventType.DeleteUser.ToString(),
                EntityName = EntityName.User.ToString(),
                EntityId = userId,
                Username = user.Username,
            };

            await _context.AuditLogs.AddAsync(newLog);

            await _context.SaveChangesAsync();

            return newLog;
        }

        public async Task<AuditLog> CreateNewUserLog(User user, int newUserId)
        {
            var newLog = new AuditLog()
            {
                EventType = EventType.CreateUser.ToString(),
                EntityName = EntityName.User.ToString(),
                EntityId = newUserId,
                Username = user.Username,
            };

            await _context.AuditLogs.AddAsync(newLog);

            await _context.SaveChangesAsync();

            return newLog;
        }

        public async Task<AuditLog> CreateGetUserLog(User user, int userId)
        {
            var newLog = new AuditLog()
            {
                EventType = EventType.GetUser.ToString(),
                EntityName = EntityName.User.ToString(),
                EntityId = userId,
                Username = user.Username,
            };

            await _context.AuditLogs.AddAsync(newLog);

            await _context.SaveChangesAsync();

            return newLog;
        }

        public async Task<AuditLog> CreateGetUsersLog(User user)
        {
            var newLog = new AuditLog()
            {
                EventType = EventType.GetUsers.ToString(),
                EntityName = EntityName.User.ToString(),
                EntityId = user.Id,
                Username = user.Username,
            };

            await _context.AuditLogs.AddAsync(newLog);

            await _context.SaveChangesAsync();

            return newLog;
        }

        public async Task<AuditLog> CreateLoginLog(User user)
        {
            var newLog = new AuditLog()
            {
                EventType = EventType.Login.ToString(),
                EntityName = EntityName.User.ToString(),
                EntityId = user.Id,
                Username = user.Username,
            };

            await _context.AuditLogs.AddAsync(newLog);

            await _context.SaveChangesAsync();

            return newLog;
        }

        public async Task<IEnumerable<AuditLog>> GetAllAsync()
        {
            return await _context.AuditLogs.ToListAsync();
        }
    }
}