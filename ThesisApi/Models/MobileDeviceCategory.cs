using ThesisApi.Contracts.Requests.MobileDeviceCategories;

namespace ThesisApi.Models
{
    public class MobileDeviceCategory
    {
        public MobileDeviceCategory() { }
        public int Id { get; set; }
        public required string Name { get; set; }

        public ICollection<MobileDevice> MobileDevices { get; set; } = [];
        public ICollection<MobileOrder> MobileOrders { get; set; } = [];

        public static MobileDeviceCategory Create(CreateMobileDeviceCategoryRequest request)
        {
            return new MobileDeviceCategory()
            {
                Name = request.Name
            };
        }
    }
}