using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.ComputerOrders;
using ThesisApi.Contracts.Responses.ComputerOrders;
using ThesisApi.ExtensionServices;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ComputerOrderController : ControllerBase
    {
        private readonly IComputerRepository _computerRepository;
        private readonly IComputerOrderRepository _computerOrderRepository;
        private readonly IUserRepository _userRepository;
        private readonly IComputerCategoryRepository _computerCategoryRepository;
        private readonly INotificationService _notificationService;
        private readonly IAuditLogsRepository _logRepository;

        public ComputerOrderController(
            IComputerRepository computerRepository,
            IComputerOrderRepository computerOrderRepository,
            IUserRepository userRepository,
            IComputerCategoryRepository computerCategoryRepository,
            INotificationService notificationService,
            IAuditLogsRepository auditLogsRepository
        )
        {
            _computerRepository = computerRepository;
            _computerOrderRepository = computerOrderRepository;
            _userRepository = userRepository;
            _computerCategoryRepository = computerCategoryRepository;
            _notificationService = notificationService;
            _logRepository = auditLogsRepository;
        }

        [HttpPost("/computer-orders")]
        [Authorize(Roles = "User, Admin, Group leader")]
        public async Task<ActionResult<ComputerOrderResponse>> Create([FromBody] CreateComputerOrderRequest request)
        {
            try
            {
                var order = await ComputerOrder.Create(
                    request,
                    _userRepository,
                    _computerCategoryRepository);

                await _computerOrderRepository.CreateAsync(order);

                await _notificationService.SendAsync(
                    order.ApproverId,
                    $"New computer order from {order.Customer.DisplayName} is waiting for your approval.");

                var response = order.ToResponse();

                var loggedInUser = await GetLoggedInUserAsync();

                await _logRepository.CreateNewComputerOrderLog(loggedInUser!, response.Id);

                return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-orders")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ComputerOrderResponse>>> GetAll()
        {
            try
            {
                var orders = await _computerOrderRepository.GetAllAsync();

                var responses = orders.Select((order) => order.ToResponse()).ToList();

                var loggedInUser = await GetLoggedInUserAsync();

                await _logRepository.CreateGetComputerOrdersLog(loggedInUser!);

                return Ok(responses);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-orders/{id:int}")]
        [Authorize(Roles = "Admin, User, Group leader")]
        public async Task<ActionResult<ComputerOrderResponse>> GetById([FromRoute] int id)
        {
            try
            {
                var order = await _computerOrderRepository.GetByIdAsync(id);
                if (order == null)
                    return NotFound();

                var response = order.ToResponse();

                var loggedInUser = await GetLoggedInUserAsync();

                await _logRepository.CreateGetComputerOrderLog(loggedInUser!, id);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-orders/my-orders")]
        [Authorize(Roles = "User, Admin, Group leader")]
        public async Task<ActionResult<IEnumerable<ComputerOrderResponse>>> GetByCustomerId()
        {
            try
            {
                var username = User.FindFirst("username")?.Value;
                if (string.IsNullOrEmpty(username))
                    return Unauthorized("User is not logged in.");

                var orders = await _computerOrderRepository.GetByUsernameAsync(username);

                if (orders != null)
                {
                    var response = orders.Select((order) => order.ToResponse()).ToList();

                    return Ok(response);
                }
                return Ok();

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-orders/approval")]
        [Authorize(Roles = "Group leader")]
        public async Task<ActionResult<IEnumerable<ComputerOrderResponse>>> GetAllForApproval()
        {
            try
            {
                var username = User.FindFirst("username")?.Value;

                if (string.IsNullOrEmpty(username))
                    return Unauthorized("User is not logged in.");

                var orders = await _computerOrderRepository.GetAllForApprovalAsync(username);

                if (orders != null)
                {
                    var response = orders.Select((order) => order.ToResponse()).ToList();

                    return Ok(response);
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("/computer-orders/approval/{id:int}")]
        [Authorize(Roles = "Group leader")]
        public async Task<IActionResult> MakeDecisionAsGroupLeader([FromRoute] int id, [FromBody] bool decision)
        {
            try
            {
                var username = User.FindFirst("username")?.Value;

                if (string.IsNullOrEmpty(username))
                    return Unauthorized("User is not logged in.");

                var order = await _computerOrderRepository.GetByIdAsync(id);

                if (order == null)
                    return NotFound($"Order with the id: {id} is not found!");

                if (order.Approver.Username != username)
                    throw new ValidationException("Only the approver can make a decision about this order!");

                if (order.Status != "Waiting for approval")
                    throw new ValidationException("This order already has a decision!");

                await _computerOrderRepository.MakeDecisionAsGroupLeaderAsync(order, decision);

                var message = decision
                    ? "Your computer order has been approved."
                    : "Your computer order has been rejected.";
                await _notificationService.SendAsync(order.CustomerId, message);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("/computer-orders/allocate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AllocateMobileDevice([FromBody] AllocateComputerToOrderRequest request)
        {
            try
            {
                var computerOrder = await _computerOrderRepository.GetByIdAsync(request.OrderId);
                if (computerOrder == null)
                    return NotFound("Computer order is not found!");

                var computer = await _computerRepository.GetByIdAsync(request.ComputerId);
                if (computer == null)
                    return NotFound("Computer is not found!");

                if (computerOrder.ComputerCategoryId != computer.ComputerCategoryId)
                    return StatusCode(400, "Computer category is not the same as the requested!");

                await _computerOrderRepository.AllocateComputerToOrder(computerOrder, computer);

                await _notificationService.SendAsync(
                    computerOrder.CustomerId,
                    "A computer has been allocated to your order.");

                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpPut("/computer-orders/deliver/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeliverOrder([FromRoute] int id)
        {
            try
            {
                var order = await _computerOrderRepository.GetByIdAsync(id);
                if (order == null)
                    return NotFound("Computer order is not found!");

                if (order.Computer == null)
                    return StatusCode(400, "Allocate a computer first!");

                await _computerOrderRepository.DeliverOrderAsync(order);

                await _notificationService.SendAsync(
                    order.CustomerId,
                    "Your computer order has been delivered.");

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("/computer-orders/{id:int}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var order = await _computerOrderRepository.GetByIdAsync(id);

                if (order == null)
                    return NotFound();

                await _computerOrderRepository.DeleteAsync(order);

                var loggedInUser = await GetLoggedInUserAsync();

                await _logRepository.CreateDeleteComputerOrderLog(loggedInUser!, id);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private async Task<User?> GetLoggedInUserAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return null;

            return await _userRepository.GetByIdAsync(Convert.ToInt32(userId));
        }
    }
}