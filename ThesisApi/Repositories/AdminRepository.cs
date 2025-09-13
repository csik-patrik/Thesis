using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDbContext _context;
        public AdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<MobileDeviceCategory> CreateMobileDeviceCategoryAsync(string name)
        {
            var newMobileDeviceCategory = new MobileDeviceCategory()
            {
                Name = name
            };

            await _context.MobileDeviceCategories.AddAsync(newMobileDeviceCategory);

            await _context.SaveChangesAsync();

            return newMobileDeviceCategory;
        }

        public async Task<IEnumerable<MobileDeviceCategory>> GetAllMobileDeviceCategoriesAsync()
        {
            var mobileDeviceCategories = await _context.MobileDeviceCategories.ToListAsync();

            return mobileDeviceCategories;
        }

        public async Task<MobileDeviceCategory?> GetMobileDeviceCategoryByIdAsync(int id)
        {
            var mobileDeviceCategory = await _context.MobileDeviceCategories.FirstOrDefaultAsync(x => x.Id == id);

            return mobileDeviceCategory;
        }

        public async Task<MobileDeviceCategory?> UpdateMobileDeviceCategoryAsync(int id, string name)
        {
            var model = await GetMobileDeviceCategoryByIdAsync(id);
            if (model == null)
                return null;

            model.Name = name;

            await _context.SaveChangesAsync();

            return model;

        }
        public async Task<bool> DeleteMobileDeviceCategory(int id)
        {
            var model = await GetMobileDeviceCategoryByIdAsync(id);
            if (model == null)
                return false;

            _context.MobileDeviceCategories.Remove(model);

            _context.SaveChanges();

            return true;

        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users.Include(x => x.UserRoles).ToListAsync();
        }

        public async Task<User> AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<IEnumerable<UserRole>> GetUserRolesAsync()
        {
            return await _context.UserRoles.ToListAsync();
        }

        public async Task<IEnumerable<UserRole>> GetUserRolesByIdAsync(List<int> ids)
        {
            return await _context.UserRoles.Where(x => ids.Contains(x.Id)).ToListAsync();
        }

        public Task<bool> DeleteUserById(int id)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == id);

            if (user == null)
                return Task.FromResult(false);

            _context.Users.Remove(user);

            _context.SaveChanges();

            return Task.FromResult(true);
        }
    }
}