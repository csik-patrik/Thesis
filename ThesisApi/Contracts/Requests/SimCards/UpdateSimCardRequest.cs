namespace ThesisApi.Contracts.Requests.SimCards
{
    public class UpdateSimCardRequest
    {
        public required string Department { get; set; }
        public required string CallControlGroup { get; set; }
        public required bool IsDataEnabled { get; set; }
        public required string Status { get; set; }
    }
}