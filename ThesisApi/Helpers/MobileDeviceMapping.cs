using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.Models;

namespace ThesisApi.Helpers
{
    public static class MobileDeviceMapping
    {
        public static MobileDevice MapToMobileDevice(this CreateMobileDeviceRequest request)
        {
            return new MobileDevice()
            {
                Hostname = request.Hostname,
                Type = request.Type,
                ImeiNumber = request.ImeiNumber,
                SerialNumber = request.SerialNumber,
                IosVersion = request.IosVersion,
                BatteryStatus = 100,
                CreatedAt = DateTime.Now,
                CreatedBy = request.CreatedBy,
                ModifiedAt = DateTime.Now,
                ModifiedBy = request.CreatedBy
            };
        }

        public static MobileDeviceResponse MapToResponse(this MobileDevice mobileDevice)
        {
            return new MobileDeviceResponse()
            {
                Id = mobileDevice.Id,
                Hostname = mobileDevice.Hostname,
                Type = mobileDevice.Type,
                ImeiNumber = mobileDevice.ImeiNumber,
                SerialNumber = mobileDevice.SerialNumber,
                IosVersion = mobileDevice.IosVersion,
                BatteryStatus = mobileDevice.BatteryStatus,
                UserId = mobileDevice.UserId,
                SimCard = mobileDevice.SimCard?.MapToResponse(),
                CreatedAt = mobileDevice.CreatedAt,
                CreatedBy = mobileDevice.CreatedBy,
                ModifiedAt = mobileDevice.ModifiedAt,
                ModifiedBy = mobileDevice.CreatedBy
            };

        }
    }
}