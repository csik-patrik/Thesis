using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class ComputerRepository : IComputerRepository
    {
        private readonly ApplicationDbContext _context;
        public ComputerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Computer> AddAsync(Computer computer)
        {
            await _context.Computers.AddAsync(computer);

            await _context.SaveChangesAsync();

            return computer;
        }

        public async Task<IEnumerable<Computer>> GetAllAsync()
        {
            return await _context.Computers
                .Include(x => x.ComputerCategory)
                .Include(x => x.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<Computer>> GetAllForAllocationAsync(int categoryId)
        {
            return await _context.Computers
                .Include(x => x.ComputerCategory)
                .Where(
                    x => x.ComputerCategoryId == categoryId
                    && x.Status == "In inventory"
                    && x.StatusReason == "In inventory")
                .ToListAsync();
        }

        public async Task<Computer?> GetByIdAsync(int id)
        {
            return await _context.Computers
                .Include(x => x.ComputerCategory)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Computer>> GetAllDeployedAsync()
        {
            return await _context.Computers
                .Include(x => x.ComputerCategory)
                .Include(x => x.User)
                .Where(x => x.Status == "Deployed" && x.StatusReason == "Productive")
                .ToListAsync();
        }

        public async Task<bool> Delete(Computer computer)
        {
            _context.Computers.Remove(computer);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}