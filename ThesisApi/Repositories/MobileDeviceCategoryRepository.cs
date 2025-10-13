using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class MobileDeviceCategoryRepository : IMobileDeviceCategoryRepository
    {
        private readonly ApplicationDbContext _context;
        public MobileDeviceCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<MobileDeviceCategory> AddAsync(MobileDeviceCategory mobileDeviceCategory)
        {
            await _context.MobileDeviceCategories.AddAsync(mobileDeviceCategory);

            await _context.SaveChangesAsync();

            return mobileDeviceCategory;

        }

        public async Task<IEnumerable<MobileDeviceCategory>> GetAllAsync()
        {
            return await _context.MobileDeviceCategories.ToListAsync();
        }

        public async Task<MobileDeviceCategory?> GetByIdAsync(int id)
        {
            return await _context.MobileDeviceCategories.FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}