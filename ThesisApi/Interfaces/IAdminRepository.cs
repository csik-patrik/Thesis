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

        Task<IEnumerable<User>> GetUsersAsync();
        Task<IEnumerable<UserRole>> GetUserRolesAsync();
        Task<IEnumerable<UserRole>> GetUserRolesByIdAsync(List<int> ids);
        Task<User> AddUserAsync(User user);
    }
}