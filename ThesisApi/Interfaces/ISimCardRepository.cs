using ThesisApi.Contracts.Requests.SimCards;
using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface ISimCardRepository
    {
        Task<SimCard> AddAsync(SimCard simCard);
        Task<IEnumerable<SimCard>> GetAllAsync();
        Task<SimCard?> GetByIdAsync(int id);
        Task<IEnumerable<SimCard>> GetAllForAllocationAsync(int simCallControlGroupId);
        Task<bool> DeleteAsync(int id);
    }
}