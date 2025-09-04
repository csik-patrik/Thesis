using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IMobileDeviceRepository
    {
        Task<IEnumerable<MobileDevice>> GetAllAsync();
        Task<MobileDevice?> GetByIdAsync(int id);
        Task<MobileDevice> AddAsync(MobileDevice mobileDevice);
        Task<bool> UpdateAsync(MobileDevice mobileDevice);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<MobileDeviceCategory>> GetMobileDeviceCategoriesAsync();
    }
}