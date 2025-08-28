namespace ThesisApi.Contracts.Responses.MobileOrders
{
    public class MobileOrderResponse
    {
        public int Id { get; set; }
        public required string RequesterName { get; set; }
        public required string RequesterUsername { get; set; }
        public required string CustomerName { get; set; }
        public required string CustomerUsername { get; set; }
        public required string CustomersCostCenter { get; set; }
        public required string DeviceType { get; set; }
        public required string CallControlGroup { get; set; }
        public required string PickupLocation { get; set; }
        public required string Status { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required string CreatedBy { get; set; }
        public required DateTime ModifiedAt { get; set; }
        public required string ModifiedBy { get; set; }
    }
}