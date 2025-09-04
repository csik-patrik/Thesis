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
                MobileDeviceCategoryId = request.MobileDeviceCategoryId,
                ImeiNumber = request.ImeiNumber,
                SerialNumber = request.SerialNumber,
                IosVersion = request.IosVersion,
                BatteryStatus = 100,
                Status = "In inventory",
                CreatedAt = DateTime.Now,
                CreatedBy = request.CreatedBy,
                ModifiedAt = DateTime.Now,
                ModifiedBy = request.CreatedBy
            };
        }

        public static MobileDeviceResponse MapToResponse(this MobileDevice model)
        {
            return new MobileDeviceResponse()
            {
                Id = model.Id,
                Hostname = model.Hostname,
                Type = model.MobileDeviceCategory.Name,
                ImeiNumber = model.ImeiNumber,
                SerialNumber = model.SerialNumber,
                IosVersion = model.IosVersion,
                BatteryStatus = model.BatteryStatus,
                UserId = model.UserId,
                SimCard = model.SimCard?.MapToResponse(),
                Status = model.Status,
                CreatedAt = model.CreatedAt,
                CreatedBy = model.CreatedBy,
                ModifiedAt = model.ModifiedAt,
                ModifiedBy = model.CreatedBy
            };

        }
    }
}