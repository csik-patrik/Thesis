using ThesisApi.Contracts.Responses.ComputerCategories;
using ThesisApi.Contracts.Responses.Users;

namespace ThesisApi.Contracts.Responses.Computers
{
    public class ComputerResponse
    {
        public required int Id { get; set; }
        public required string Hostname { get; set; }
        public required ComputerCategoryResponse ComputerCategory { get; set; }
        public required string Model { get; set; }
        public required string SerialNumber { get; set; }
        public UserOrderResponse? User { get; set; }
        public required string Status { get; set; }
        public required string StatusReason { get; set; }
    }
}