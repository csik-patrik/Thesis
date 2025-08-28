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
                RequesterName = request.RequesterName,
                RequesterUsername = request.RequesterUsername,
                CustomerName = request.CustomerName,
                CustomerUsername = request.CustomerUsername,
                CustomersCostCenter = request.CustomersCostCenter,
                DeviceType = request.DeviceType,
                CallControlGroup = request.CallControlGroup,
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
                RequesterName = order.RequesterName,
                RequesterUsername = order.RequesterUsername,
                CustomerName = order.CustomerName,
                CustomerUsername = order.CustomerUsername,
                CustomersCostCenter = order.CustomersCostCenter,
                DeviceType = order.DeviceType,
                CallControlGroup = order.CallControlGroup,
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