[HttpPost("/computer-orders")]
[Authorize(Roles = "User, Group leader")]
public async Task<ActionResult<ComputerOrderResponse>> Create([FromBody] CreateComputerOrderRequest request)
{
  try {
    var order = await ComputerOrder.Create(
    request,
    _userRepository,
    _computerCategoryRepository);

    await _computerOrderRepository.CreateAsync(order);

    await _notificationService.SendAsync(
    order.ApproverId,
    $"New computer order from {order.Customer.DisplayName} is waiting for your approval.");

    var response = order.ToResponse();

    return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
  }
  catch (Exception e) {
    return BadRequest(e.Message);
  }
}