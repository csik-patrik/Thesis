using ThesisApi.Contracts.Responses.SimCards;

namespace ThesisApi.Contracts.Responses.MobileDevices
{
    public class MobileDeviceResponse
    {
        public int Id { get; init; }
        public required string Hostname { get; init; }
        public required string Type { get; init; }
        public string? ImeiNumber { get; init; }
        public string? SerialNumber { get; init; }
        public string? IosVersion { get; init; }
        public int? BatteryStatus { get; init; }
        public string? UserId { get; init; }
        public SimCardResponse? SimCard { get; init; }
        public required DateTime CreatedAt { get; init; }
        public required string CreatedBy { get; init; }
        public required DateTime ModifiedAt { get; init; }
        public required string ModifiedBy { get; init; }
    }
}