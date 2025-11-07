using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IComputerOrderRepository
    {
        Task<ComputerOrder> CreateAsync(ComputerOrder order);
        Task<IEnumerable<ComputerOrder>> GetAllAsync();
        Task<ComputerOrder?> GetByIdAsync(int id);
        Task<IEnumerable<ComputerOrder?>> GetByUsernameAsync(string username);
        Task<IEnumerable<ComputerOrder?>> GetAllWaitingForApprovalAsync(string username);
        Task<ComputerOrder> MakeDecisionAsGroupLeaderAsync(ComputerOrder order, bool decision);
        Task<ComputerOrder> AllocateComputerToOrder(ComputerOrder order, Computer computer);
        Task<ComputerOrder> DeliverOrderAsync(ComputerOrder order);
        Task<bool> DeleteAsync(ComputerOrder order);
    }
}