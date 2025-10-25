namespace ThesisApi.Contracts.Requests.Computers
{
    public class CreateComputerRequest
    {
        public required string Hostname { get; set; }
        public required int ComputerCategoryId { get; set; }
        public required string Model { get; set; }
        public required string SerialNumber { get; set; }
    }
}