namespace ThesisApi.Contracts.Requests.MobileOrders
{
    public class CreateMobileOrderRequest
    {
        public required string CustomerName { get; set; }
        public required string CustomerUsername { get; set; }
        public required string DeviceType { get; set; }
        public required int DeviceCount { get; set; }
        public required string PickupLocation { get; set; }
        public required string CreatedBy { get; set; }
    }
}