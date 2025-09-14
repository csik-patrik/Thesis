using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class MobileOrderRepository : IMobileOrderRepository
    {
        private readonly ApplicationDbContext _context;
        public MobileOrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MobileOrder> CreateAsync(MobileOrder order)
        {
            await _context.MobileOrders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<IEnumerable<MobileOrder>> GetAllAsync()
        {
            return await _context.MobileOrders
                .Include(x => x.MobileDeviceCategory)
                .Include(x => x.MobileDevice)
                .ToListAsync();
        }

        public async Task<MobileOrder?> GetByIdAsync(int id)
        {
            return await _context.MobileOrders
                .Include(x => x.MobileDeviceCategory)
                .Include(x => x.MobileDevice)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<MobileOrder?> AllocateMobileToOrderAsync(int orderId, int mobileId)
        {
            var order = await _context.MobileOrders.FirstOrDefaultAsync(x => x.Id == orderId);
            if (order == null) return null;

            var mobile = await _context.MobileDevices.FirstOrDefaultAsync(x => x.Id == mobileId);
            if (mobile == null) return null;

            order.MobileDevice = mobile;
            order.Status = "Deliver device";
            order.ModifiedAt = DateTime.UtcNow;

            mobile.DeviceStatusId = 1;
            mobile.DeviceStatusReasonId = 2;

            mobile.ModifiedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<MobileOrder?> DeliverOrderAsync(int id)
        {
            var order = await _context.MobileOrders
                .Include(x => x.MobileDevice)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (order == null) return null;

            if (order.MobileDevice == null) return null;

            order.Status = "Delivered";
            order.ModifiedAt = DateTime.UtcNow;
            order.MobileDevice.DeviceStatusId = 2;
            order.MobileDevice.DeviceStatusReasonId = 5;
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<bool> UpdateAsync(MobileOrder order)
        {
            _context.MobileOrders.Update(order);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var order = await _context.MobileOrders.FirstOrDefaultAsync(x => x.Id == id);
            if (order != null)
            {
                _context.MobileOrders.Remove(order);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}