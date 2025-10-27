using ThesisApi.Contracts.Requests.Computers;
using ThesisApi.Interfaces;

namespace ThesisApi.Models
{
    public class Computer
    {
        private Computer() { }
        public int Id { get; set; }
        public required string Hostname { get; set; }
        public int ComputerCategoryId { get; set; }
        public ComputerCategory ComputerCategory { get; set; } = null!;
        public required string Model { get; set; }
        public required string SerialNumber { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public required string Status { get; set; }
        public required string StatusReason { get; set; }
        public ICollection<ComputerOrder> ComputerOrders { get; set; } = new List<ComputerOrder>();

        public static async Task<Computer> Create(CreateComputerRequest request, IComputerCategoryRepository computerCategoryRepository)
        {
            var category = await computerCategoryRepository.GetByIdAsync(request.ComputerCategoryId);

            if (category == null)
                throw new Exception("Computer category not found!");

            return new Computer()
            {
                Hostname = request.Hostname,
                ComputerCategoryId = category.Id,
                Model = request.Model,
                ComputerCategory = category,
                SerialNumber = request.SerialNumber,
                Status = "In inventory",
                StatusReason = "In inventory"
            };
        }

        public static async Task<List<Computer>> CreateBulk(List<CreateComputerRequest> request, IComputerCategoryRepository computerCategoryRepository)
        {
            var computers = new List<Computer>();

            foreach (var item in request)
            {
                var category = await computerCategoryRepository.GetByIdAsync(item.ComputerCategoryId);

                if (category == null)
                    throw new Exception("Computer category not found!");

                computers.Add(new Computer()
                {
                    Hostname = item.Hostname,
                    ComputerCategoryId = category.Id,
                    Model = item.Model,
                    ComputerCategory = category,
                    SerialNumber = item.SerialNumber,
                    Status = "In inventory",
                    StatusReason = "In inventory"
                });
            }

            return computers;
        }
    }
}