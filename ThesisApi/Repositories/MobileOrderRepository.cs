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
                .Include(x => x.Customer)
                .Include(x => x.SimCallControlGroup)
                .Include(x => x.MobileDevice)
                .Include(x => x.SimCard)
                .AsNoTracking()
                .AsSplitQuery()
                .ToListAsync();
        }

        public async Task<MobileOrder?> GetByIdAsync(int id)
        {
            return await _context.MobileOrders
                .Include(x => x.MobileDeviceCategory)
                .Include(x => x.Customer)
                .Include(x => x.SimCallControlGroup)
                .Include(x => x.MobileDevice)
                .Include(x => x.SimCard)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<MobileOrder> AllocateMobileDeviceToOrderAsync(MobileOrder mobileOrder, MobileDevice mobileDevice)
        {
            mobileOrder.MobileDevice = mobileDevice;
            mobileOrder.MobileDeviceId = mobileDevice.Id;
            mobileOrder.Status = "In progress";

            mobileDevice.StatusReason = "Reserved";

            await _context.SaveChangesAsync();

            return mobileOrder;
        }

        public async Task<MobileOrder> AllocateSimCardToOrderAsync(MobileOrder mobileOrder, SimCard simCard)
        {
            mobileOrder.SimCardId = simCard.Id;
            mobileOrder.SimCard = simCard;

            simCard.Status = "Reserved";

            mobileOrder.MobileDevice.SimCardId = simCard.Id;
            mobileOrder.MobileDevice.SimCard = simCard;
            mobileOrder.Status = "Deliver device";

            await _context.SaveChangesAsync();
            return mobileOrder;
        }

        public async Task<bool> DeleteAsync(MobileOrder mobileOrder)
        {

            _context.MobileOrders.Remove(mobileOrder);
            await _context.SaveChangesAsync();
            return true;
        }

        /*

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

        

        */
    }
}