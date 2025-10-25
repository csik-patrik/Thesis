using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IComputerOrderRepository
    {
        Task<ComputerOrder> CreateAsync(ComputerOrder order);
        Task<IEnumerable<ComputerOrder>> GetAllAsync();
        Task<ComputerOrder?> GetByIdAsync(int id);
        Task<ComputerOrder> AllocateComputerToOrder(ComputerOrder order, Computer computer);
        Task<bool> DeleteAsync(ComputerOrder order);
    }
}