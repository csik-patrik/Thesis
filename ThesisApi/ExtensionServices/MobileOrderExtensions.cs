using ThesisApi.Contracts.Responses.MobileOrders;
using ThesisApi.Models;

namespace ThesisApi.ExtensionServices
{
    public static class MobileOrderExtensions
    {
        public static MobileOrderResponse ToResponse(this MobileOrder order)
        {
            return new MobileOrderResponse()
            {
                Id = order.Id,
                Customer = order.Customer.ToUserOrderResponse(),
                MobileDeviceCategory = order.MobileDeviceCategory.ToResponse(),
                SimCallControlGroup = order.SimCallControlGroup.ToResponse(),
                PickupLocation = order.PickupLocation,
                MobileDevice = order.MobileDevice?.ToResponse(),
                Note = order.Note,
                Approver = order.Approver.ToUserOrderResponse(),
                Status = order.Status
            };
        }
    }
}