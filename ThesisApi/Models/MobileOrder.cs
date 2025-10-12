namespace ThesisApi.Models
{
    public class MobileOrder
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public User Customer { get; set; } = null!;
        public int MobileDeviceCategoryId { get; set; }
        public MobileDeviceCategory MobileDeviceCategory { get; set; } = null!;
        public int SimCallControlGroupId { get; set; }
        public SimCallControlGroup SimCallControlGroup { get; set; } = null!;
        public required string PickupLocation { get; set; }
        public string? Note { get; set; }
        public int? MobileDeviceId { get; set; }
        public MobileDevice? MobileDevice { get; set; }
        public int? SimCardId { get; set; }
        public SimCard? SimCard { get; set; }
        public required string Status { get; set; }
    }
}