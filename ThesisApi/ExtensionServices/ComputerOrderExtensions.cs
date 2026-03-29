using ThesisApi.Contracts.Responses.ComputerOrders;
using ThesisApi.Models;

namespace ThesisApi.ExtensionServices
{
    public static class ComputerOrderExtensions
    {
        public static ComputerOrderResponse ToResponse(this ComputerOrder order)
        {
            return new ComputerOrderResponse()
            {
                Id = order.Id,
                Customer = order.Customer.ToOrderResponse(),
                ComputerCategory = order.ComputerCategory.ToResponse(),
                PickupLocation = order.PickupLocation,
                Note = order.Note,
                Approver = order.Approver.ToOrderResponse(),
                Computer = order.Computer?.ToResponse(),
                Status = order.Status

            };
        }
    }
}