namespace ThesisApi.Contracts.Responses.SimCards
{
    public class SimCallControlGroupResponse
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required bool IsDataEnabled { get; set; }
    }
}