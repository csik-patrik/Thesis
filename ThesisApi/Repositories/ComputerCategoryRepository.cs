using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class ComputerCategoryRepository : IComputerCategoryRepository
    {
        public Task<ComputerCategory> AddAsync(ComputerCategory category)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ComputerCategory>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<ComputerCategory?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}