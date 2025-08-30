namespace ThesisApi.Contracts.Requests.Users
{
    public class GenerateTokenRequest
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Department { get; set; }
        public required string CostCenter { get; set; }
    }
}