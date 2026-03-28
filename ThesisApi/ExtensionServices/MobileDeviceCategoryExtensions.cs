using ThesisApi.Contracts.Responses.MobileDeviceCategories;
using ThesisApi.Models;

namespace ThesisApi.ExtensionServices
{
    public static class MobileDeviceCategoryExtensions
    {
        public static MobileDeviceCategoryResponse ToResponse(this MobileDeviceCategory category)
        {
            return new MobileDeviceCategoryResponse()
            {
                Id = category.Id,
                Name = category.Name,
            };
        }
    }
}