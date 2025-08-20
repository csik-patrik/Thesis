namespace ThesisApi.Contracts.Requests.SimCards
{
    public class CreateSimCardRequest
    {
        public required string PhoneNumber { get; init; }
        public required string Department { get; init; }
        public required string CallControlGroup { get; init; }
        public required bool IsDataEnabled { get; init; }
        public required string Type { get; init; }
        public required string CreatedBy { get; init; }
    }
}