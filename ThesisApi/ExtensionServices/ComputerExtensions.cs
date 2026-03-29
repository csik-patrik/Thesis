using ThesisApi.Contracts.Responses.Computers;
using ThesisApi.Models;

namespace ThesisApi.ExtensionServices
{
    public static class ComputerExtensions
    {
        public static ComputerResponse ToResponse(this Computer computer)
        {
            return new ComputerResponse()
            {
                Id = computer.Id,
                Hostname = computer.Hostname,
                ComputerCategory = computer.ComputerCategory.ToResponse(),
                Model = computer.Model,
                SerialNumber = computer.SerialNumber,
                User = computer.User?.ToOrderResponse(),
                Status = computer.Status,
                StatusReason = computer.StatusReason
            };
        }

        public static ComputerResponse ToInInventoryResponse(this Computer computer)
        {
            return new ComputerResponse()
            {
                Id = computer.Id,
                Hostname = computer.Hostname,
                ComputerCategory = computer.ComputerCategory.ToResponse(),
                Model = computer.Model,
                SerialNumber = computer.SerialNumber,
                Status = computer.Status,
                StatusReason = computer.StatusReason
            };
        }
    }
}