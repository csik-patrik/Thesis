namespace ThesisApi.Contracts.Responses.Users
{
    public class UserResponse
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        public required string Department { get; set; }
        public required string CostCenter { get; set; }
        public required List<UserRoleResponse> UserRoles { get; set; }
    }
}