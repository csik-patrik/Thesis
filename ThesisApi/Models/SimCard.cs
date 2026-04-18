using ThesisApi.Contracts.Requests.SimCards;
using ThesisApi.Interfaces;

namespace ThesisApi.Models
{
    public class SimCard
    {
        private SimCard() { }
        public int Id { get; set; }
        public required string PhoneNumber { get; set; }
        public int SimCallControlGroupId { get; set; }
        public SimCallControlGroup SimCallControlGroup { get; set; } = null!;
        public required string Status { get; set; }
        public MobileDevice? MobileDevice { get; set; }
        public ICollection<MobileOrder> MobileOrders { get; set; } = new List<MobileOrder>();

        public async static Task<SimCard> Create(CreateSimCardRequest request, ISimCallControlGroupRepository repository)
        {
            var simCallControlGroup = await repository.GetByIdAsync(request.SimCallControlGroupId);

            if (simCallControlGroup == null)
                throw new Exception("Call control group cannot be found!");

            return new SimCard()
            {
                PhoneNumber = request.PhoneNumber,
                SimCallControlGroupId = simCallControlGroup.Id,
                SimCallControlGroup = simCallControlGroup,
                Status = "In inventory"
            };
        }

        public static async Task<List<SimCard>> CreateBulk(List<CreateSimCardRequest> request, ISimCallControlGroupRepository simCallControlGroupRepository)
        {
            var simCards = new List<SimCard>();

            foreach (var item in request)
            {
                var callControlGroup = await simCallControlGroupRepository.GetByIdAsync(item.SimCallControlGroupId);

                if (callControlGroup == null)
                    throw new Exception("Sim call control group not found!");

                simCards.Add(new SimCard()
                {
                    PhoneNumber = item.PhoneNumber,
                    SimCallControlGroupId = callControlGroup.Id,
                    SimCallControlGroup = callControlGroup,
                    Status = "In inventory"
                });
            }

            return simCards;
        }
    }
}