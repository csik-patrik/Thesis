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
    }
}