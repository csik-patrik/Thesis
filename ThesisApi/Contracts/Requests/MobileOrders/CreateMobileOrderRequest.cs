namespace ThesisApi.Contracts.Requests.MobileOrders
{
    public class CreateMobileOrderRequest
    {
        public required string RequesterName { get; set; }
        public required string RequesterUsername { get; set; }
        public required string CustomerName { get; set; }
        public required string CustomerUsername { get; set; }
        public required string CustomersCostCenter { get; set; }
        public required int MobileDeviceCategoryId { get; set; }
        public required string CallControlGroup { get; set; }
        public required string PickupLocation { get; set; }
        public string? Note { get; set; }
        public required string CreatedBy { get; set; }
    }
}