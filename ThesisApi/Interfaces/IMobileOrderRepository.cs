using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IMobileOrderRepository
    {
        Task<MobileOrder> CreateAsync(MobileOrder order);
        Task<IEnumerable<MobileOrder>> GetAllAsync();
        Task<MobileOrder?> GetByIdAsync(int id);
        Task<MobileOrder?> AllocateMobileToOrderAsync(int orderId, int mobileId);
        Task<MobileOrder?> DeliverOrderAsync(int id);
        Task<bool> UpdateAsync(MobileOrder order);
        Task<bool> DeleteAsync(int id);
    }
}