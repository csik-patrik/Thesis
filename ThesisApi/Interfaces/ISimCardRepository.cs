using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface ISimCardRepository
    {
        Task<IEnumerable<SimCard>> GetAllAsync();
        Task<SimCard?> GetByIdAsync(int id);
        Task<SimCard> AddAsync(SimCard simCard);
        Task<bool> UpdateAsync(SimCard simCard);
        Task<bool> DeleteAsync(int id);
    }
}