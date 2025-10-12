namespace ThesisApi.Contracts.Responses.Users
{
    public class UserOrderResponse
    {
        public required int Id { get; set; }
        public required string UserName { get; set; }
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        public required string Department { get; set; }
        public required string CostCenter { get; set; }
    }
}