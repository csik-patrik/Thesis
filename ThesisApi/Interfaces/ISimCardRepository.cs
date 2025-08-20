using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface ISimCardRepository
    {
        Task<IEnumerable<SimCard>> GetAllAsync();
        Task<SimCard?> GetByIdAsync(int id);
        Task<SimCard> AddAsync(SimCard simCard);
        Task UpdateAsync(SimCard simCard);
        Task DeleteAsync(int id);
    }
}