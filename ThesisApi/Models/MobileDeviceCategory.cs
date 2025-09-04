namespace ThesisApi.Models
{
    public class MobileDeviceCategory
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public ICollection<MobileDevice> MobileDevices { get; set; } = [];
    }
}