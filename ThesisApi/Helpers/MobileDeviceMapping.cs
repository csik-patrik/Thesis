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
                DeviceStatusId = 1,
                DeviceStatusReasonId = 1,
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
                MobileDeviceCategory = model.MobileDeviceCategory.Name,
                ImeiNumber = model.ImeiNumber,
                SerialNumber = model.SerialNumber,
                IosVersion = model.IosVersion,
                BatteryStatus = model.BatteryStatus,
                UserId = model.UserId,
                SimCard = model.SimCard?.MapToResponse(),
                DeviceStatus = model.DeviceStatus.Name,
                DeviceStatusReason = model.DeviceStatusReason.Name,
                CreatedAt = model.CreatedAt,
                CreatedBy = model.CreatedBy,
                ModifiedAt = model.ModifiedAt,
                ModifiedBy = model.CreatedBy
            };
        }

        public static MobileDeviceCategoryResponse MapToResponse(this MobileDeviceCategory model)
        {
            return new MobileDeviceCategoryResponse()
            {
                Id = model.Id,
                Name = model.Name
            };
        }
    }
}