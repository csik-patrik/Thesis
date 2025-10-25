using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IComputerRepository
    {
        Task<Computer> AddAsync(Computer computer);
        Task<IEnumerable<Computer>> GetAllAsync();
        Task<Computer?> GetByIdAsync(int id);
    }
}