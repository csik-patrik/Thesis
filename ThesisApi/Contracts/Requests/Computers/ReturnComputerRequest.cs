namespace ThesisApi.Contracts.Requests.Computers
{
    public class ReturnComputerRequest
    {
        public required string Status { get; init; }
        public required string StatusReason { get; init; }
    }
}