namespace ThesisApi.Models
{
    public class SimCard
    {
        public int Id { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Department { get; set; }
        public int SimCallControlGroupId { get; set; }
        public SimCallControlGroup SimCallControlGroup { get; set; } = null!;
        public required string Status { get; set; }
        public MobileDevice? MobileDevice { get; set; }
        public ICollection<MobileOrder> MobileOrders { get; set; } = new List<MobileOrder>();
    }
}