public static async Task<ComputerOrder> Create(
    CreateComputerOrderRequest request,
    IUserRepository userRepository,
    IComputerCategoryRepository computerCategoryRepository
)
{
    var customer = await userRepository.GetByIdAsync(request.CustomerId);

    if (customer == null)
        throw new Exception("Customer is not found!");

    var category = await computerCategoryRepository.GetByIdAsync(request.ComputerCategoryId);

    if (category == null)
        throw new Exception("Computer category not found!");

    var approver = await userRepository.GetByIdAsync(request.ApproverId);

    if (approver == null)
        throw new Exception("Approver is not found!");

    return new ComputerOrder()
    {
        CustomerId = customer.Id,
        Customer = customer,
        ComputerCategoryId = category.Id,
        ComputerCategory = category,
        PickupLocation = request.PickupLocation,
        Note = request.Note,
        Status = "Waiting for approval",
        ApproverId = approver.Id,
        Approver = approver
    };
}