using Microsoft.EntityFrameworkCore;
using ThesisApi.Contracts.Requests.SimCards;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class SimCardsRepository : ISimCardRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly string availableForAllocationStatus = "In inventory";
        private readonly string simTypeForPhone = "Voice";

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

        public async Task<IEnumerable<SimCard>> GetAllForAllocationAsync(int mobileOrderId)
        {
            var mobileOrder = await _context.MobileOrders.FirstOrDefaultAsync(x => x.Id == mobileOrderId);
            if (mobileOrder == null)
                throw new ArgumentException("Invalid mobile order ID!");


            return await _context.SimCards
                .Where(x => x.Status == availableForAllocationStatus
                        && x.CallControlGroup == mobileOrder.CallControlGroup
                        && x.Type == simTypeForPhone)
                .ToListAsync();
        }

        public async Task<SimCard?> GetByIdAsync(int id)
        {
            return await _context.SimCards.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<SimCard?> UpdateAsync(int id, UpdateSimCardRequest request)
        {
            var simCard = await _context.SimCards.FirstOrDefaultAsync(x => x.Id == id);

            if (simCard == null)
                return null;

            simCard.Department = request.Department;
            simCard.CallControlGroup = request.CallControlGroup;
            simCard.IsDataEnabled = request.IsDataEnabled;
            simCard.Status = request.Status;

            await _context.SaveChangesAsync();
            return simCard;
        }
    }
}