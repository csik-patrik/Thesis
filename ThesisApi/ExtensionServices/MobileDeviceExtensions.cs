using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.Models;

namespace ThesisApi.ExtensionServices
{
    public static class MobileDeviceExtensions
    {
        public static MobileDeviceResponse ToResponse(this MobileDevice mobileDevice)
        {
            return new MobileDeviceResponse()
            {
                Id = mobileDevice.Id,
                Hostname = mobileDevice.Hostname,
                MobileDeviceCategory = mobileDevice.MobileDeviceCategory.ToResponse(),
                ImeiNumber = mobileDevice.ImeiNumber,
                SerialNumber = mobileDevice.SerialNumber,
                User = mobileDevice.User?.ToOrderResponse(),
                SimCard = mobileDevice.SimCard?.ToResponse(),
                Status = mobileDevice.Status,
                StatusReason = mobileDevice.StatusReason
            };
        }
    }
}