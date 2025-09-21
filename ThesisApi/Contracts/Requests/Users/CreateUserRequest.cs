namespace ThesisApi.Contracts.Requests.Users
{
    public class CreateUserRequest
    {
        public required string Username { get; set; }
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Department { get; set; }
        public required string CostCenter { get; set; }
        public required List<int> UserRoleIds { get; set; }
    }
}