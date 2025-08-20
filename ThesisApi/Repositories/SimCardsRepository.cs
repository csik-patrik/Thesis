using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class SimCardsRepository : ISimCardRepository
    {
        private readonly ApplicationDbContext _context;

        public SimCardsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SimCard> AddAsync(SimCard simCard)
        {
            await _context.SimCards.AddAsync(simCard);
            await _context.SaveChangesAsync();
            return simCard;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var simCard = await _context.SimCards.FirstOrDefaultAsync(x => x.Id == id);
            if (simCard != null)
            {
                _context.SimCards.Remove(simCard);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<SimCard>> GetAllAsync()
        {
            return await _context.SimCards.ToListAsync();
        }

        public async Task<SimCard?> GetByIdAsync(int id)
        {
            return await _context.SimCards.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> UpdateAsync(SimCard simCard)
        {
            _context.SimCards.Update(simCard);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}