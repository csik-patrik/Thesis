using ThesisApi.Contracts.Responses.ComputerCategories;

namespace ThesisApi.Contracts.Responses.Computers
{
    public class ComputerInInventoryResponse
    {
        public required int Id { get; init; }
        public required string Hostname { get; init; }
        public ComputerCategoryResponse ComputerCategory { get; init; } = null!;
        public required string Model { get; init; }
        public required string SerialNumber { get; init; }
        public required string Status { get; init; }
        public required string StatusReason { get; init; }
    }
}