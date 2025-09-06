using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IAdminRepository
    {
        Task<MobileDeviceCategory> CreateMobileDeviceCategoryAsync(string name);
        Task<IEnumerable<MobileDeviceCategory>> GetAllMobileDeviceCategoriesAsync();
        Task<MobileDeviceCategory?> GetMobileDeviceCategoryByIdAsync(int id);
        Task<MobileDeviceCategory?> UpdateMobileDeviceCategoryAsync(int id, string name);
        Task<bool> DeleteMobileDeviceCategory(int id);
    }
}