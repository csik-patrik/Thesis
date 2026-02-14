using Microsoft.EntityFrameworkCore;
using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<User> CreateAsync(User user)
        {
            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.Include(x => x.UserRoles).ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.Include(x => x.UserRoles).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<User>> GetByDisplayNameAsync(string displayName)
        {
            return await _context.Users
                .Where(u => EF.Functions.Like(u.DisplayName.ToLower(), $"%{displayName.ToLower()}%"))
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetGroupLeadersAsync()
        {
            return await _context.Users
                .Include(x => x.UserRoles)
                .Where(u => u.UserRoles.Any(r => r.Name == "Group leader"))
                .ToListAsync();
        }

        public async Task<User> UpdateUserAsync(User user, UpdateUserRequest request)
        {
            user.Username = request.Username;
            user.DisplayName = request.DisplayName;
            user.Email = request.Email;
            user.Department = request.Department;
            user.CostCenter = request.CostCenter;

            var newRoles = await _context.UserRoles.Where(x => request.UserRoleIds.Contains(x.Id)).ToListAsync();

            user.UserRoles = newRoles;

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<bool> DeleteById(User user)
        {
            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return true;
        }


    }
}