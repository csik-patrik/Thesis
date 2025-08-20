namespace ThesisApi.Contracts.Responses.SimCards
{
    public class SimCardResponse
    {
        public int Id { get; init; }
        public required string PhoneNumber { get; init; }
        public required string Department { get; init; }
        public required string CallControlGroup { get; init; }
        public required bool IsDataEnabled { get; init; }
        public required string Type { get; init; }
        public required string Status { get; init; }
        public required DateTime CreatedAt { get; init; }
        public required string CreatedBy { get; init; }
        public required DateTime ModifiedAt { get; init; }
        public required string ModifiedBy { get; init; }
    }
}