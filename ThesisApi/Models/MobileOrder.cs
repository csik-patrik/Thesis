using ThesisApi.Contracts.Requests.MobileOrders;
using ThesisApi.Interfaces;

namespace ThesisApi.Models
{
    public class MobileOrder
    {
        private MobileOrder() { }
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public User Customer { get; set; } = null!;
        public int MobileDeviceCategoryId { get; set; }
        public MobileDeviceCategory MobileDeviceCategory { get; set; } = null!;
        public int SimCallControlGroupId { get; set; }
        public SimCallControlGroup SimCallControlGroup { get; set; } = null!;
        public required string PickupLocation { get; set; }
        public string? Note { get; set; }
        public int ApproverId { get; set; }
        public User Approver { get; set; } = null!;
        public required string Status { get; set; }
        public int? MobileDeviceId { get; set; }
        public MobileDevice? MobileDevice { get; set; }
        public int? SimCardId { get; set; }
        public SimCard? SimCard { get; set; }


        public async static Task<MobileOrder> Create(
            CreateMobileOrderRequest request,
            IUserRepository userRepository,
            IMobileDeviceCategoryRepository mobileDeviceCategoryRepository,
            ISimCallControlGroupRepository simCallControlGroupRepository
            )
        {
            var customer = await userRepository.GetByIdAsync(request.CustomerId);

            if (customer == null)
                throw new Exception("Customer is not found!");

            var mobileDeviceCategory = await mobileDeviceCategoryRepository.GetByIdAsync(request.MobileDeviceCategoryId);

            if (mobileDeviceCategory == null)
                throw new Exception("Mobile device category not found!");

            var simCallControlGroup = await simCallControlGroupRepository.GetByIdAsync(request.SimCallControlGroupId);

            if (simCallControlGroup == null)
                throw new Exception("Sim call control group is not found!");

            var approver = await userRepository.GetByIdAsync(request.ApproverId);

            if (approver == null)
                throw new Exception("Approver is not found!");

            return new MobileOrder()
            {
                CustomerId = customer.Id,
                Customer = customer,
                MobileDeviceCategoryId = mobileDeviceCategory.Id,
                MobileDeviceCategory = mobileDeviceCategory,
                SimCallControlGroupId = simCallControlGroup.Id,
                SimCallControlGroup = simCallControlGroup,
                PickupLocation = request.PickupLocation,
                Note = request.Note,
                Status = "Waiting for approval",
                ApproverId = approver.Id,
                Approver = approver
            };
        }
    }
}