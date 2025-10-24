using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class ComputerCategoryRepository : IComputerCategoryRepository
    {
        private readonly ApplicationDbContext _context;
        public ComputerCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ComputerCategory> AddAsync(ComputerCategory category)
        {
            await _context.ComputerCategories.AddAsync(category);
            return category;
        }

        public async Task<IEnumerable<ComputerCategory>> GetAllAsync()
        {
            return await _context.ComputerCategories.ToListAsync();
        }

        public async Task<ComputerCategory?> GetByIdAsync(int id)
        {
            return await _context.ComputerCategories.FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}