using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User user);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<List<User>> GetByDisplayNameAsync(string displayName);
        Task<bool> DeleteById(User user);
    }
}