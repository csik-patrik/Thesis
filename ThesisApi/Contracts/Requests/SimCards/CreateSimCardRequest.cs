namespace ThesisApi.Contracts.Requests.SimCards
{
    public class CreateSimCardRequest
    {
        public required string PhoneNumber { get; init; }
        public required int SimCallControlGroupId { get; init; }
    }
}