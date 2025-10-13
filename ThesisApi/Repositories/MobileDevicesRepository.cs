using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class MobileDevicesRepository : IMobileDeviceRepository
    {
        private readonly ApplicationDbContext _context;

        public MobileDevicesRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<MobileDevice> AddAsync(MobileDevice mobileDevice)
        {
            await _context.MobileDevices.AddAsync(mobileDevice);
            await _context.SaveChangesAsync();
            return mobileDevice;
        }

        public async Task<bool> AddBulkAsync(IEnumerable<MobileDevice> mobileDevices)
        {
            _context.MobileDevices.AddRange(mobileDevices);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var mobileDevice = await _context.MobileDevices.FirstOrDefaultAsync(x => x.Id == id);

            if (mobileDevice == null)
                return false;

            _context.MobileDevices.Remove(mobileDevice);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<MobileDevice>> GetAllAsync()
        {
            return await _context.MobileDevices
                .Include(x => x.MobileDeviceCategory)
                .ToListAsync();
        }

        public async Task<IEnumerable<MobileDevice>> GetAllDeployedAsync()
        {
            return await _context.MobileDevices
                .Include(x => x.MobileDeviceCategory)

                .Include(x => x.SimCard)
                .ToListAsync();
        }

        public async Task<IEnumerable<MobileDevice>> GetAllForAllocationAsync(int mobileDeviceCategoryId)
        {

            return await _context.MobileDevices
                .Include(x => x.MobileDeviceCategory)


                .ToListAsync();
        }

        public async Task<MobileDevice?> GetByIdAsync(int id)
        {
            return await _context.MobileDevices
                .Include(x => x.MobileDeviceCategory)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<MobileDeviceCategory>> GetMobileDeviceCategoriesAsync()
        {
            return await _context.MobileDeviceCategories.ToListAsync();

        }

        public async Task<bool> UpdateAsync(MobileDevice mobileDevice)
        {
            _context.MobileDevices.Update(mobileDevice);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}