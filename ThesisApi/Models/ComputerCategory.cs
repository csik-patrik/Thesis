using ThesisApi.Contracts.Requests.ComputerCategories;

namespace ThesisApi.Models
{
    public class ComputerCategory
    {
        private ComputerCategory() { }
        public int Id { get; set; }
        public required string Name { get; set; }
        public ICollection<Computer> Computers { get; set; } = new List<Computer>();

        public static async Task<ComputerCategory> Create(CreateComputerCategoryRequest request)
        {
            return new ComputerCategory
            {
                Name = request.Name
            };
        }
    }
}