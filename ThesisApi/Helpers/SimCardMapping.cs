using ThesisApi.Contracts.Requests.SimCards;
using ThesisApi.Contracts.Responses.SimCards;
using ThesisApi.Models;

namespace ThesisApi.Helpers
{
    public static class SimCardMapping
    {
        public static SimCard MapToSimCard(this CreateSimCardRequest request)
        {
            return new SimCard()
            {
                PhoneNumber = request.PhoneNumber,
                Department = request.Department,
                CallControlGroup = request.CallControlGroup,
                IsDataEnabled = request.IsDataEnabled,
                Type = request.Type,
                Status = "In inventory",
                CreatedAt = DateTime.Now,
                CreatedBy = request.CreatedBy,
                ModifiedAt = DateTime.Now,
                ModifiedBy = request.CreatedBy
            };
        }

        public static SimCardResponse MapToResponse(this SimCard simCard)
        {
            return new SimCardResponse()
            {
                Id = simCard.Id,
                PhoneNumber = simCard.PhoneNumber,
                Department = simCard.Department,
                CallControlGroup = simCard.CallControlGroup,
                IsDataEnabled = simCard.IsDataEnabled,
                Type = simCard.Type,
                Status = simCard.Status,
                CreatedAt = simCard.CreatedAt,
                CreatedBy = simCard.CreatedBy,
                ModifiedAt = simCard.ModifiedAt,
                ModifiedBy = simCard.ModifiedBy
            };
        }
    }
}