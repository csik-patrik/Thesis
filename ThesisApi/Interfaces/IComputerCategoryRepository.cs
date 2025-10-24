using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IComputerCategoryRepository
    {
        Task<ComputerCategory> AddAsync(ComputerCategory category);
        Task<IEnumerable<ComputerCategory>> GetAllAsync();
        Task<ComputerCategory?> GetByIdAsync(int id);
    }
}