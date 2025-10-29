namespace ThesisApi.Contracts.Requests.MobileDevices
{
    public class ReturnMobileDeviceRequest
    {
        public required string Status { get; init; }
        public required string StatusReason { get; init; }
    }
}