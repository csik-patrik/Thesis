namespace ThesisApi.Contracts.Requests.ComputerOrders
{
    public class CreateComputerOrderRequest
    {
        public required int CustomerId { get; set; }
        public required int ComputerCategoryId { get; set; }
        public required string PickupLocation { get; set; }
        public string? Note { get; set; }
        public required int ApproverId { get; set; }
    }
}