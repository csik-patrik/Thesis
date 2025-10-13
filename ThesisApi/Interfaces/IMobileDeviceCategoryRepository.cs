using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IMobileDeviceCategoryRepository
    {
        Task<MobileDeviceCategory> AddAsync(MobileDeviceCategory mobileDeviceCategory);
        Task<MobileDeviceCategory?> GetByIdAsync(int id);
        Task<IEnumerable<MobileDeviceCategory>> GetAllAsync();
    }
}