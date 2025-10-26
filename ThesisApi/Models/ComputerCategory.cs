using ThesisApi.Contracts.Requests.ComputerCategories;

namespace ThesisApi.Models
{
    public class ComputerCategory
    {
        private ComputerCategory() { }
        public int Id { get; set; }
        public required string Name { get; set; }
        public ICollection<Computer> Computers { get; set; } = new List<Computer>();
        public ICollection<ComputerOrder> ComputerOrders { get; set; } = new List<ComputerOrder>();

        public static ComputerCategory Create(CreateComputerCategoryRequest request)
        {
            return new ComputerCategory()
            {
                Name = request.Name
            };
        }
    }
}