namespace ThesisApi.Contracts.Requests.MobileDevices
{
    public class CreateMobileDeviceRequest
    {
        public required string Hostname { get; init; }
        public required int MobileDeviceCategoryId { get; init; }
        public string? ImeiNumber { get; init; }
        public string? SerialNumber { get; init; }
        public string? IosVersion { get; init; }
        public required string CreatedBy { get; init; }
    }
}