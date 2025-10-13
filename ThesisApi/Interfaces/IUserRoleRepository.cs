using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IUserRoleRepository
    {
        Task<UserRole> CreateAsync(UserRole userRole);
        Task<IEnumerable<UserRole>> GetUserRolesAsync();
        Task<IEnumerable<UserRole>> GetUserRolesByIdAsync(List<int> ids);
    }
}