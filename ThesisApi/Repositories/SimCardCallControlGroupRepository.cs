using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class SimCardCallControlGroupRepository : ISimCallControlGroupRepository
    {
        private readonly ApplicationDbContext _context;
        public SimCardCallControlGroupRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SimCallControlGroup> AddAsync(SimCallControlGroup simCallControlGroup)
        {
            await _context.SimCallControlGroups.AddAsync(simCallControlGroup);

            await _context.SaveChangesAsync();

            return simCallControlGroup;
        }

        public async Task<SimCallControlGroup?> GetByIdAsync(int id)
        {
            return await _context.SimCallControlGroups.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<SimCallControlGroup>> GetAllAsync()
        {
            return await _context.SimCallControlGroups.ToListAsync();
        }

        public async Task<bool> DeleteByIdAsync(SimCallControlGroup simCallControlGroup)
        {
            _context.SimCallControlGroups.Remove(simCallControlGroup);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}