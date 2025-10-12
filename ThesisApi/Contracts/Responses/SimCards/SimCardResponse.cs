namespace ThesisApi.Contracts.Responses.SimCards
{
    public class SimCardResponse
    {
        public int Id { get; init; }
        public required string PhoneNumber { get; init; }
        public required string Department { get; init; }
        public required SimCallControlGroupResponse SimCallControlGroup { get; init; }
        public required string Status { get; init; }
    }
}