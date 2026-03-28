using ThesisApi.Contracts.Responses.SimCards;
using ThesisApi.Models;

namespace ThesisApi.ExtensionServices
{
    public static class SimCardExtensions
    {
        public static SimCardResponse ToResponse(this SimCard simCard)
        {
            return new SimCardResponse()
            {
                Id = simCard.Id,
                PhoneNumber = simCard.PhoneNumber,
                SimCallControlGroup = simCard.SimCallControlGroup.ToResponse(),
                Status = simCard.Status
            };
        }
    }
}