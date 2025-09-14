namespace ThesisApi.Models
{
    public class MobileOrder
    {
        public int Id { get; set; }
        public required string RequesterName { get; set; }
        public required string RequesterUsername { get; set; }
        public required string CustomerName { get; set; }
        public required string CustomerUsername { get; set; }
        public required string CustomersCostCenter { get; set; }
        public int MobileDeviceCategoryId { get; set; }
        public MobileDeviceCategory MobileDeviceCategory { get; set; } = null!;
        public required string CallControlGroup { get; set; }
        public required string PickupLocation { get; set; }
        public string? Note { get; set; }
        public MobileDevice? MobileDevice { get; set; }
        public required string Status { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required string CreatedBy { get; set; }
        public required DateTime ModifiedAt { get; set; }
        public required string ModifiedBy { get; set; }
    }
}