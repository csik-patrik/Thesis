namespace ThesisApi.Contracts.Requests.ComputerOrders
{
    public class AllocateComputerToOrderRequest
    {
        public required int OrderId { get; set; }
        public required int ComputerId { get; set; }
    }
}