namespace ThesisApi.Contracts.Requests.MobileOrders
{
    public class CreateMobileOrderRequest
    {
        public required int CustomerId { get; set; }
        public required int MobileDeviceCategoryId { get; set; }
        public required int SimCallControlGroupId { get; set; }
        public required string PickupLocation { get; set; }
        public string? Note { get; set; }
    }
}