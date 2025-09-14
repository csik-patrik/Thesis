using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IMobileOrderRepository
    {
        Task<IEnumerable<MobileOrder>> GetAllAsync();
        Task<MobileOrder?> GetByIdAsync(int id);
        Task<MobileOrder?> AllocateMobileToOrderAsync(int orderId, int mobileId);
        Task<MobileOrder> AddAsync(MobileOrder order);
        Task<bool> UpdateAsync(MobileOrder order);
        Task<bool> DeleteAsync(int id);
    }
}