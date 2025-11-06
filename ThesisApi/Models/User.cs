namespace ThesisApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        public required string Department { get; set; }
        public required string CostCenter { get; set; }
        public required string Password { get; set; }

        public ICollection<UserRole> UserRoles { get; set; } = null!;
        public ICollection<MobileDevice> MobileDevices { get; set; } = new List<MobileDevice>();
        public ICollection<MobileOrder> MobileOrders { get; set; } = new List<MobileOrder>();
        public ICollection<Computer> Computers { get; set; } = new List<Computer>();
        public ICollection<ComputerOrder> CustomerOrders { get; set; } = new List<ComputerOrder>();
        public ICollection<ComputerOrder> ApprovedOrders { get; set; } = new List<ComputerOrder>();

    }
}