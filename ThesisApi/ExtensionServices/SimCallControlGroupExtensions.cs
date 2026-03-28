using ThesisApi.Contracts.Responses.SimCards;
using ThesisApi.Models;

namespace ThesisApi.ExtensionServices
{
    public static class SimCallControlGroupExtensions
    {
        public static SimCallControlGroupResponse ToResponse(this SimCallControlGroup simCallControlGroup)
        {
            return new SimCallControlGroupResponse()
            {
                Id = simCallControlGroup.Id,
                Name = simCallControlGroup.Name,
                IsDataEnabled = simCallControlGroup.IsDataEnabled
            };
        }
    }
}