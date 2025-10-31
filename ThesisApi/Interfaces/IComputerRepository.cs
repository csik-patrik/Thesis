using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IComputerRepository
    {
        Task<Computer> AddAsync(Computer computer);
        Task<IEnumerable<Computer>> AddBulkAsync(IEnumerable<Computer> computers);
        Task<IEnumerable<Computer>> GetAllAsync();
        Task<IEnumerable<Computer>> GetAllInInventoryAsync();
        Task<IEnumerable<Computer>> GetAllForAllocationAsync(int categoryId);
        Task<Computer?> GetByIdAsync(int id);
        Task<IEnumerable<Computer>> GetAllDeployedAsync();
        Task<IEnumerable<Computer>> GetAllByUserAsync(string username);
        Task<Computer> ReturnDeviceAsync(Computer computer, string status, string statusReason);
        Task<bool> Delete(Computer computer);
    }
}