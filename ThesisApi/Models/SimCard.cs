namespace ThesisApi.Models
{
    public class SimCard
    {
        public int Id { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Department { get; set; }
        public required string CallControlGroup { get; set; }
        public required bool IsDataEnabled { get; set; }
        public required string Type { get; set; }
        public required string Status { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required string CreatedBy { get; set; }
        public required DateTime ModifiedAt { get; set; }
        public required string ModifiedBy { get; set; }

    }
}