namespace ThesisApi.Models
{
    public class Computer
    {
        public int Id { get; set; }
        public required string Hostname { get; set; }
        public int ComputerCategoryId { get; set; }
        public ComputerCategory ComputerCategory { get; set; } = null!;
        public required string SerialNumber { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public required string Status { get; set; }
        public required string StatusReason { get; set; }
    }
}