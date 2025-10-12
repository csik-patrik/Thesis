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
        public int? UserId { get; set; }
        public User? User { get; set; }
        public int? SimCardId { get; set; }
        public SimCard? SimCard { get; set; }
        public required string Status { get; set; }
        public required string StatusReason { get; set; }
        public ICollection<MobileOrder> MobileOrders { get; set; } = new List<MobileOrder>();
    }
}