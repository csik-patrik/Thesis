using ThesisApi.Contracts.Responses.SimCards;
using ThesisApi.Contracts.Responses.Users;

namespace ThesisApi.Contracts.Responses.MobileDevices
{
    public class MobileDeviceResponse
    {
        public int Id { get; init; }
        public required string Hostname { get; init; }
        public required MobileDeviceCategoryResponse MobileDeviceCategory { get; init; }
        public string? ImeiNumber { get; init; }
        public string? SerialNumber { get; init; }
        public UserOrderResponse? User { get; init; }
        public SimCardResponse? SimCard { get; init; }
        public required string Status { get; set; }
        public required string StatusReason { get; set; }
    }
}