namespace ThesisApi.Models
{
    public class ComputerOrder
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public User Customer { get; set; } = null!;
        public int ComputerCategoryId { get; set; }
        public ComputerCategory ComputerCategory { get; set; } = null!;
        public required string PickupLocation { get; set; }
        public string? Note { get; set; }
        public int? ComputerId { get; set; }
        public Computer? Computer { get; set; }
        public required string Status { get; set; }
    }
}