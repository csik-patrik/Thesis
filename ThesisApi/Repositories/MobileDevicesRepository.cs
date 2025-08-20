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

        public async Task<bool> DeleteAsync(int id)
        {
            var mobileDevice = await _context.MobileDevices.FirstOrDefaultAsync(x => x.Id == id);
            if (mobileDevice != null)
            {
                _context.MobileDevices.Remove(mobileDevice);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public Task<IEnumerable<MobileDevice>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<MobileDevice?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateAsync(MobileDevice mobileDevice)
        {
            throw new NotImplementedException();
        }
    }
}