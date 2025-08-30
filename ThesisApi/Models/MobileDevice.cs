namespace ThesisApi.Models
{
    public class MobileDevice
    {
        public int Id { get; set; }
        public required string Hostname { get; set; }
        public required string Type { get; set; }
        public string? ImeiNumber { get; set; }
        public string? SerialNumber { get; set; }
        public string? IosVersion { get; set; }
        public int? BatteryStatus { get; set; }
        public string? UserId { get; set; }
        public int? SimCardId { get; set; }
        public SimCard? SimCard { get; set; }
        public required string Status { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required string CreatedBy { get; set; }
        public required DateTime ModifiedAt { get; set; }
        public required string ModifiedBy { get; set; }
    }
}