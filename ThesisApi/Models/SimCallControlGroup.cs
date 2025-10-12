using ThesisApi.Contracts.Requests.SimCallControlGroups;

namespace ThesisApi.Models
{
    public class SimCallControlGroup
    {
        private SimCallControlGroup() { }
        public int Id { get; set; }
        public required string Name { get; set; }
        public required bool IsDataEnabled { get; set; }
        public ICollection<SimCard> SimCards { get; set; } = new List<SimCard>();
        public ICollection<MobileOrder> MobileOrders { get; set; } = new List<MobileOrder>();

        public static SimCallControlGroup Create(CreateSimCallControlGroupRequest request)
        {
            return new SimCallControlGroup()
            {
                Name = request.Name,
                IsDataEnabled = request.IsDataEnabled
            };
        }
    }
}