namespace ThesisApi.Models
{
    public class MobileDevice
    {
        public int Id { get; set; }
        public required string Hostname { get; set; }
        public int MobileDeviceCategoryId { get; set; }
        public MobileDeviceCategory MobileDeviceCategory { get; set; } = null!;
        public string? ImeiNumber { get; set; }
        public string? SerialNumber { get; set; }
        public string? IosVersion { get; set; }
        public int? BatteryStatus { get; set; }
        public string? UserId { get; set; }
        public int? SimCardId { get; set; }
        public SimCard? SimCard { get; set; }
        public int DeviceStatusId { get; set; }
        public DeviceStatus DeviceStatus { get; set; } = null!;
        public int DeviceStatusReasonId { get; set; }
        public DeviceStatusReason DeviceStatusReason { get; set; } = null!;
        public required DateTime CreatedAt { get; set; }
        public required string CreatedBy { get; set; }
        public required DateTime ModifiedAt { get; set; }
        public required string ModifiedBy { get; set; }
    }
}