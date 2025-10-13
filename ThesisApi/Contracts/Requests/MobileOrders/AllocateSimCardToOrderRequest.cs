namespace ThesisApi.Contracts.Requests.MobileOrders
{
    public class AllocateSimCardToOrderRequest
    {
        public required int OrderId { get; set; }
        public required int SimCardId { get; set; }
    }
}