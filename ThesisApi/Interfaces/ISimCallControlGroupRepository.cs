using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface ISimCallControlGroupRepository
    {
        Task<SimCallControlGroup> AddAsync(SimCallControlGroup simCallControlGroup);
        Task<SimCallControlGroup?> GetByIdAsync(int id);
        Task<IEnumerable<SimCallControlGroup>> GetAllAsync();
        Task<bool> DeleteByIdAsync(SimCallControlGroup simCallControlGroup);
    }
}
