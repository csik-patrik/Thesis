using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Repositories
{
    public class MobileOrderRepository : IMobileOrderRepository
    {
        public Task<MobileOrder> AddAsync(MobileOrder order)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MobileOrder>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<MobileOrder?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateAsync(MobileOrder order)
        {
            throw new NotImplementedException();
        }
    }
}