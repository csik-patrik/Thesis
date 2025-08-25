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

        public async Task<MobileOrder> AddAsync(MobileOrder order)
        {
            await _context.MobileOrders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order;
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

        public async Task<IEnumerable<MobileOrder>> GetAllAsync()
        {
            return await _context.MobileOrders.ToListAsync();
        }

        public async Task<MobileOrder?> GetByIdAsync(int id)
        {
            return await _context.MobileOrders.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> UpdateAsync(MobileOrder order)
        {
            _context.MobileOrders.Update(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}