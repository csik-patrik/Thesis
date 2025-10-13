using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Interfaces;

namespace ThesisApi.Models
{
    public class MobileDevice
    {
        private MobileDevice() { }
        public int Id { get; set; }
        public required string Hostname { get; set; }
        public int MobileDeviceCategoryId { get; set; }
        public MobileDeviceCategory MobileDeviceCategory { get; set; } = null!;
        public string? ImeiNumber { get; set; }
        public string? SerialNumber { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public int? SimCardId { get; set; }
        public SimCard? SimCard { get; set; }
        public required string Status { get; set; }
        public required string StatusReason { get; set; }
        public ICollection<MobileOrder> MobileOrders { get; set; } = new List<MobileOrder>();

        public static async Task<MobileDevice> Create(CreateMobileDeviceRequest request, IMobileDeviceCategoryRepository mobileDeviceCategoryRepository)
        {
            var category = await mobileDeviceCategoryRepository.GetByIdAsync(request.MobileDeviceCategoryId);

            if (category == null)
                throw new Exception("Mobile device category not found!");

            return new MobileDevice()
            {
                Hostname = request.Hostname,
                MobileDeviceCategoryId = category.Id,
                MobileDeviceCategory = category,
                ImeiNumber = request.ImeiNumber,
                SerialNumber = request.SerialNumber,
                Status = "In inventory",
                StatusReason = "In inventory"
            };
        }

        public static async Task<List<MobileDevice>> CreateBulk(List<CreateMobileDeviceRequest> request, IMobileDeviceCategoryRepository mobileDeviceCategoryRepository)
        {
            List<MobileDevice> mobileDevices = new List<MobileDevice>();

            foreach (var item in request)
            {
                var category = await mobileDeviceCategoryRepository.GetByIdAsync(item.MobileDeviceCategoryId);

                if (category == null)
                    throw new Exception("Mobile device category not found!");

                mobileDevices.Add(new MobileDevice()
                {
                    Hostname = item.Hostname,
                    MobileDeviceCategoryId = category.Id,
                    MobileDeviceCategory = category,
                    ImeiNumber = item.ImeiNumber,
                    SerialNumber = item.SerialNumber,
                    Status = "In inventory",
                    StatusReason = "In inventory"
                });
            }

            return mobileDevices;
        }
    }
}