using ThesisApi.Contracts.Responses.MobileDeviceCategories;
using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.Contracts.Responses.SimCards;
using ThesisApi.Contracts.Responses.Users;

namespace ThesisApi.Contracts.Responses.MobileOrders
{
    public class MobileOrderResponse
    {
        public int Id { get; set; }
        public required UserOrderResponse Customer { get; set; }
        public required MobileDeviceCategoryResponse MobileDeviceCategory { get; set; }
        public required SimCallControlGroupResponse SimCallControlGroup { get; set; }
        public required string PickupLocation { get; set; }
        public MobileDeviceResponse? MobileDevice { get; set; }
        public string? Note { get; set; }
        public required string Status { get; set; }
    }
}