using ThesisApi.Contracts.Responses.ComputerCategories;
using ThesisApi.Models;

namespace ThesisApi.ExtensionServices
{
    public static class ComputerCategoryExtensions
    {
        public static ComputerCategoryResponse ToResponse(this ComputerCategory category)
        {
            return new ComputerCategoryResponse()
            {
                Id = category.Id,
                Name = category.Name
            };
        }
    }
}