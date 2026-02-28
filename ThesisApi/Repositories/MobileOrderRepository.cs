using System.ComponentModel.DataAnnotations;
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
                .Include(x => x.Approver)
                .AsNoTracking()
                .AsSplitQuery()
                .Where(x => x.Status != "Rejected by group leader" && x.Status != "Waiting for approval ")
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
                .Include(x => x.Approver)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<MobileOrder?>> GetByUsernameAsync(string username)
        {
            return await _context.MobileOrders
                .Include(x => x.MobileDeviceCategory)
                .Include(x => x.Customer)
                .Include(x => x.SimCallControlGroup)
                .Include(x => x.MobileDevice)
                .Include(x => x.SimCard)
                .Include(x => x.Approver)
                .AsSplitQuery()
                .Where(x => x.Customer.Username == username)
                .ToListAsync();
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

            mobileOrder.MobileDevice!.SimCardId = simCard.Id;
            mobileOrder.MobileDevice.SimCard = simCard;
            mobileOrder.Status = "Deliver device";

            await _context.SaveChangesAsync();
            return mobileOrder;
        }

        public async Task<MobileOrder> DeliverOrderAsync(MobileOrder mobileOrder)
        {
            if (mobileOrder.MobileDevice == null)
                throw new ValidationException("Mobile device must be allocated to the order.");

            if (mobileOrder.MobileDevice.SimCard == null)
                throw new ValidationException("Sim card must be allocated to the mobile device.");

            mobileOrder.Status = "Delivered";
            mobileOrder.MobileDevice.Status = "Deployed";
            mobileOrder.MobileDevice.StatusReason = "Productive";
            mobileOrder.MobileDevice.UserId = mobileOrder.Customer.Id;
            mobileOrder.MobileDevice.User = mobileOrder.Customer;
            mobileOrder.MobileDevice.SimCard.Status = "Deployed";

            await _context.SaveChangesAsync();

            return mobileOrder;
        }

        public async Task<bool> DeleteAsync(MobileOrder mobileOrder)
        {

            _context.MobileOrders.Remove(mobileOrder);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<MobileOrder?>> GetAllForApprovalAsync(string username)
        {
            return await _context.MobileOrders
                .Include(x => x.MobileDeviceCategory)
                .Include(x => x.Customer)
                .Include(x => x.SimCallControlGroup)
                .Include(x => x.MobileDevice)
                .Include(x => x.SimCard)
                .Include(x => x.Approver)
                .AsSplitQuery()
                .Where(x => x.Approver.Username == username)
                .ToListAsync();
        }

        public async Task<MobileOrder> MakeDecisionAsGroupLeaderAsync(MobileOrder order, bool decision)
        {
            if (decision)
                order.Status = "Approved";
            else
                order.Status = "Rejected by group leader";

            await _context.SaveChangesAsync();

            return order;
        }
    }
}