using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IComputerRepository
    {
        Task<Computer> AddAsync(Computer computer);
        Task<IEnumerable<Computer>> GetAllAsync();
        Task<IEnumerable<Computer>> GetAllForAllocationAsync(int categoryId);
        Task<Computer?> GetByIdAsync(int id);
        Task<IEnumerable<Computer>> GetAllDeployedAsync();
        Task<bool> Delete(Computer computer);
    }
}