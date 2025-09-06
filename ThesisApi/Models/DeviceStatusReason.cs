namespace ThesisApi.Models
{
    public class DeviceStatusReason
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public ICollection<MobileDevice> MobileDevices { get; set; } = [];
    }
}