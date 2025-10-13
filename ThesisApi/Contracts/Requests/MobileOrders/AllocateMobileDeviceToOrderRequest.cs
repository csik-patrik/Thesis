namespace ThesisApi.Contracts.Requests.MobileOrders
{
    public class AllocateMobileDeviceToOrderRequest
    {
        public required int OrderId { get; set; }
        public required int MobileDeviceId { get; set; }
    }
}