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

        public async Task<Computer?> GetByIdAsync(int id)
        {
            return await _context.Computers
                .Include(x => x.ComputerCategory)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}