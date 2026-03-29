using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IMobileOrderRepository
    {
        Task<MobileOrder> CreateAsync(MobileOrder order);
        Task<IEnumerable<MobileOrder>> GetAllAsync();
        Task<MobileOrder?> GetByIdAsync(int id);
        Task<IEnumerable<MobileOrder>?> GetByUsernameAsync(string username);
        Task<IEnumerable<MobileOrder>?> GetAllForApprovalAsync(string username);
        Task<MobileOrder> MakeDecisionAsGroupLeaderAsync(MobileOrder order, bool decision);
        Task<MobileOrder> AllocateMobileDeviceToOrderAsync(MobileOrder mobileOrder, MobileDevice mobileDevice);
        Task<MobileOrder> AllocateSimCardToOrderAsync(MobileOrder mobileOrder, SimCard simCard);
        Task<MobileOrder> DeliverOrderAsync(MobileOrder mobileOrder);
        // Task<bool> UpdateAsync(MobileOrder order);
        Task<bool> DeleteAsync(MobileOrder order);
    }
}