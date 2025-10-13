using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserRole> CreateAsync(UserRole userRole)
        {
            await _context.UserRoles.AddAsync(userRole);

            await _context.SaveChangesAsync();

            return userRole;
        }

        public async Task<IEnumerable<UserRole>> GetUserRolesAsync()
        {
            return await _context.UserRoles.ToListAsync();
        }

        public async Task<IEnumerable<UserRole>> GetUserRolesByIdAsync(List<int> ids)
        {
            return await _context.UserRoles.Where(x => ids.Contains(x.Id)).ToListAsync();
        }
    }
}