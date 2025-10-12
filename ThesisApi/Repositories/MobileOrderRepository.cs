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
                .ThenInclude(x => x.SimCard)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<MobileOrder?> AllocateMobileToOrderAsync(int orderId, int mobileId)
        {
            var order = await _context.MobileOrders.FirstOrDefaultAsync(x => x.Id == orderId);
            if (order == null) return null;

            var mobile = await _context.MobileDevices.FirstOrDefaultAsync(x => x.Id == mobileId);
            if (mobile == null) return null;

            order.MobileDevice = mobile;
            order.Status = "In progress";

            mobile.Status = "In inventory";
            mobile.StatusReason = "Reserved";

            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<MobileOrder?> DeliverOrderAsync(int id)
        {
            var order = await _context.MobileOrders
                .Include(x => x.MobileDevice)
                .ThenInclude(x => x.SimCard)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (order == null) return null;

            if (order.MobileDevice == null) return null;

            order.Status = "Delivered";
            order.MobileDevice.Status = "Deployed";
            order.MobileDevice.StatusReason = "Productive";
            order.MobileDevice.UserId = order.Customer.Id;
            order.MobileDevice.SimCard.Status = "Deployed";
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

        public async Task<MobileOrder?> AllocateSimCardToOrderAsync(int orderId, int simId)
        {
            var order = _context.MobileOrders
                .Include(x => x.MobileDevice)
                .FirstOrDefault(x => x.Id == orderId);
            if (order == null)
                throw new Exception("Order not found");

            if (order.MobileDevice == null)
                throw new Exception("No mobile device allocated to order");

            var simCard = _context.SimCards.FirstOrDefault(x => x.Id == simId);
            if (simCard == null)
                throw new Exception("Sim card not found");

            simCard.Status = "Allocated";

            order.MobileDevice.SimCardId = simCard.Id;
            order.MobileDevice.SimCard = simCard;
            order.Status = "Deliver device";

            await _context.SaveChangesAsync();
            return order;
        }
    }
}