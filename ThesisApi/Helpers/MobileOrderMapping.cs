using ThesisApi.Contracts.Requests.MobileOrders;
using ThesisApi.Contracts.Responses.MobileOrders;
using ThesisApi.Models;

namespace ThesisApi.Helpers
{
    public static class MobileOrderMapping
    {
        public static MobileOrder MapToOrder(this CreateMobileOrderRequest request)
        {
            return new MobileOrder()
            {
                CustomerName = request.CustomerName,
                CustomerUsername = request.CustomerUsername,
                DeviceType = request.DeviceType,
                DeviceCount = request.DeviceCount,
                PickupLocation = request.PickupLocation,
                Status = "New",
                CreatedAt = DateTime.Now,
                CreatedBy = request.CreatedBy,
                ModifiedAt = DateTime.Now,
                ModifiedBy = request.CreatedBy,
            };
        }

        public static MobileOrderResponse MapToResponse(this MobileOrder order)
        {
            return new MobileOrderResponse()
            {
                Id = order.Id,
                CustomerName = order.CustomerName,
                CustomerUsername = order.CustomerUsername,
                DeviceType = order.DeviceType,
                DeviceCount = order.DeviceCount,
                PickupLocation = order.PickupLocation,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                CreatedBy = order.CreatedBy,
                ModifiedAt = order.ModifiedAt,
                ModifiedBy = order.ModifiedBy
            };
        }
    }
}