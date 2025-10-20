using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class SimCardsRepository : ISimCardRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly string availableForAllocationStatus = "In inventory";

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

        public async Task<IEnumerable<SimCard>> GetAllAsync()
        {
            return await _context.SimCards.Include(x => x.SimCallControlGroup).ToListAsync();
        }

        public async Task<SimCard?> GetByIdAsync(int id)
        {
            return await _context.SimCards.Include(x => x.SimCallControlGroup).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<SimCard>> GetAllForAllocationAsync(int simCallControlGroupId)
        {
            var simCallControlGroup = await _context.SimCallControlGroups.FirstOrDefaultAsync(x => x.Id == simCallControlGroupId);

            if (simCallControlGroup == null)
                throw new Exception("Sim call control group not found!");

            return await _context.SimCards
                .Where(x => x.Status == availableForAllocationStatus && x.SimCallControlGroup.Id == simCallControlGroup.Id)
                .ToListAsync();
        }
        public async Task<bool> DeleteAsync(SimCard simCard)
        {
            _context.SimCards.Remove(simCard);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}