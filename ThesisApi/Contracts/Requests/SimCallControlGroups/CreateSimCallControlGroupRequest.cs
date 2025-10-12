namespace ThesisApi.Contracts.Requests.SimCallControlGroups
{
    public class CreateSimCallControlGroupRequest
    {
        public required string Name { get; set; }
        public required bool IsDataEnabled { get; set; }
    }
}