using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IComputerRepository
    {
        Task<Computer> AddAsync(Computer computer);
        Task<IEnumerable<Computer>> GetAllAsync();
        Task<IEnumerable<Computer>> GetAllInInventoryAsync();
        Task<IEnumerable<Computer>> GetAllForAllocationAsync(int categoryId);
        Task<Computer?> GetByIdAsync(int id);
        Task<IEnumerable<Computer>> GetAllDeployedAsync();
        Task<IEnumerable<Computer>> GetAllByUserAsync(string username);
        Task<bool> Delete(Computer computer);
    }
}