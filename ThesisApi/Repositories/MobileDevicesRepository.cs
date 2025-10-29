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

        public async Task<IEnumerable<MobileDevice>> GetAllAsync()
        {
            return await _context.MobileDevices
                .Include(x => x.MobileDeviceCategory)
                .Include(x => x.User)
                .Include(x => x.SimCard)
                .ThenInclude(x => x.SimCallControlGroup)
                .AsNoTracking()
                .AsSplitQuery()
                .ToListAsync();
        }

        public async Task<MobileDevice?> GetByIdAsync(int id)
        {
            return await _context.MobileDevices
                .Include(x => x.MobileDeviceCategory)
                .Include(x => x.User)
                .Include(x => x.SimCard)
                .ThenInclude(x => x.SimCallControlGroup)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<MobileDevice>> GetAllForAllocationAsync(int mobileDeviceCategoryId)
        {

            return await _context.MobileDevices
                .Include(x => x.MobileDeviceCategory)
                .Include(x => x.User)
                .Include(x => x.SimCard)
                .ThenInclude(x => x.SimCallControlGroup)
                .AsNoTracking()
                .AsSplitQuery()
                .Where(x => x.MobileDeviceCategoryId == mobileDeviceCategoryId
                    && x.Status == "In inventory"
                    && x.StatusReason == "In inventory")
                .ToListAsync();
        }

        public async Task<IEnumerable<MobileDevice>> GetAllDeployedAsync()
        {
            return await _context.MobileDevices
                .Include(x => x.MobileDeviceCategory)
                .Include(x => x.User)
                .Include(x => x.SimCard)
                .ThenInclude(x => x.SimCallControlGroup)
                .Where(x => x.Status == "Deployed" && x.StatusReason == "Productive")
                .ToListAsync();
        }

        public async Task<IEnumerable<MobileDevice>> GetAllByUserAsync(string username)
        {
            return await _context.MobileDevices
                .Include(x => x.User)
                .Include(x => x.MobileDeviceCategory)
                .Where(x => x.User != null && x.User.Username == username)
                .ToListAsync();
        }

        public async Task<MobileDevice> ReturnDeviceAsync(MobileDevice mobileDevice, string status, string statusReason)
        {
            mobileDevice.Status = status;
            mobileDevice.StatusReason = statusReason;
            mobileDevice.UserId = null;
            mobileDevice.User = null;

            mobileDevice.SimCard!.Status = "In inventory";
            mobileDevice.SimCard.MobileDevice = null;
            mobileDevice.SimCard = null;

            await _context.SaveChangesAsync();

            return mobileDevice;
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

        public async Task<MobileDevice> UpdateStatusReasonAsync(MobileDevice mobileDevice, string statusReason)
        {
            mobileDevice.StatusReason = statusReason;

            await _context.SaveChangesAsync();

            return mobileDevice;
        }

        // 
        //
        // public async Task<bool> UpdateAsync(MobileDevice mobileDevice)
        // {
        //     _context.MobileDevices.Update(mobileDevice);
        //     await _context.SaveChangesAsync();
        //     return true;
        // }


    }
}