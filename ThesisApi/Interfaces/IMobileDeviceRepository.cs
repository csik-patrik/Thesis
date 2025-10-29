using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface IMobileDeviceRepository
    {
        Task<MobileDevice> AddAsync(MobileDevice mobileDevice);
        Task<bool> AddBulkAsync(IEnumerable<MobileDevice> mobileDevices);
        Task<IEnumerable<MobileDevice>> GetAllAsync();
        Task<MobileDevice?> GetByIdAsync(int id);
        Task<IEnumerable<MobileDevice>> GetAllForAllocationAsync(int mobileDeviceCategoryId);
        Task<IEnumerable<MobileDevice>> GetAllDeployedAsync();
        Task<IEnumerable<MobileDevice>> GetAllByUserAsync(string username);
        Task<MobileDevice> ReturnDeviceAsync(MobileDevice mobileDevice, string status, string statusReason);
        Task<MobileDevice> UpdateStatusReasonAsync(MobileDevice mobileDevice, string statusReason);
        Task<bool> DeleteAsync(int id);
        //Task<bool> UpdateAsync(MobileDevice mobileDevice);
    }
}