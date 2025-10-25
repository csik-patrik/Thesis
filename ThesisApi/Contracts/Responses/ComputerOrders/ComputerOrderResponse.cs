using ThesisApi.Contracts.Responses.ComputerCategories;
using ThesisApi.Contracts.Responses.Computers;
using ThesisApi.Contracts.Responses.Users;

namespace ThesisApi.Contracts.Responses.ComputerOrders
{
    public class ComputerOrderResponse
    {
        public required int Id { get; set; }
        public required UserOrderResponse Customer { get; set; }
        public required ComputerCategoryResponse ComputerCategory { get; set; }
        public required string PickupLocation { get; set; }
        public string? Note { get; set; }
        public ComputerResponse? Computer { get; set; }
        public required string Status { get; set; }
    }
}