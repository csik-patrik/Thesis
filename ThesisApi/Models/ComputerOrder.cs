using ThesisApi.Contracts.Requests.ComputerOrders;
using ThesisApi.Interfaces;

namespace ThesisApi.Models
{
    public class ComputerOrder
    {
        private ComputerOrder() { }
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public User Customer { get; set; } = null!;
        public int ComputerCategoryId { get; set; }
        public ComputerCategory ComputerCategory { get; set; } = null!;
        public required string PickupLocation { get; set; }
        public string? Note { get; set; }
        public int ApproverId { get; set; }
        public User Approver { get; set; } = null!;
        public int? ComputerId { get; set; }
        public Computer? Computer { get; set; }
        public required string Status { get; set; }

        public static async Task<ComputerOrder> Create(
            CreateComputerOrderRequest request,
            IUserRepository userRepository,
            IComputerCategoryRepository computerCategoryRepository
        )
        {
            var customer = await userRepository.GetByIdAsync(request.CustomerId);

            if (customer == null)
                throw new Exception("Customer is not found!");

            var category = await computerCategoryRepository.GetByIdAsync(request.ComputerCategoryId);

            if (category == null)
                throw new Exception("Computer category not found!");

            return new ComputerOrder()
            {
                CustomerId = customer.Id,
                Customer = customer,
                ComputerCategoryId = category.Id,
                ComputerCategory = category,
                PickupLocation = request.PickupLocation,
                Note = request.Note,
                Status = "New"
            };
        }
    }
}