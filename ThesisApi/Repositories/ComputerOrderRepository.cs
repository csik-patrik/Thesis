using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class ComputerOrderRepository : IComputerOrderRepository
    {
        private readonly ApplicationDbContext _context;
        public ComputerOrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ComputerOrder> CreateAsync(ComputerOrder order)
        {
            await _context.ComputerOrders.AddAsync(order);

            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<IEnumerable<ComputerOrder>> GetAllAsync()
        {
            return await _context.ComputerOrders
                .Include(x => x.Customer)
                .Include(x => x.ComputerCategory)
                .Include(x => x.Computer)
                .ToListAsync();
        }

        public async Task<ComputerOrder?> GetByIdAsync(int id)
        {
            return await _context.ComputerOrders
                .Include(x => x.Customer)
                .Include(x => x.ComputerCategory)
                .Include(x => x.Computer)
                .FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<ComputerOrder> AllocateComputerToOrder(ComputerOrder order, Computer computer)
        {
            order.Computer = computer;
            order.ComputerId = computer.Id;
            order.Status = "In progress";

            computer.StatusReason = "Reserved";

            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<ComputerOrder> DeliverOrderAsync(ComputerOrder order)
        {
            order.Status = "Delivered";

            order.Computer!.Status = "Deployed";
            order.Computer!.StatusReason = "Productive";
            order.Computer.UserId = order.CustomerId;
            order.Computer.User = order.Customer;

            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<bool> DeleteAsync(ComputerOrder order)
        {
            _context.ComputerOrders.Remove(order);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}