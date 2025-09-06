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
    }
}