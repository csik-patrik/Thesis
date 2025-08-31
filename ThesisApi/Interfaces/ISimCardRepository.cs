using ThesisApi.Contracts.Requests.SimCards;
using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface ISimCardRepository
    {
        Task<IEnumerable<SimCard>> GetAllAsync();
        Task<SimCard?> GetByIdAsync(int id);
        Task<SimCard> AddAsync(SimCard simCard);
        Task<SimCard?> UpdateAsync(int id, UpdateSimCardRequest request);
        Task<bool> DeleteAsync(int id);
    }
}