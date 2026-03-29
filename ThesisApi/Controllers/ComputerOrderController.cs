using System.ComponentModel.DataAnnotations;
using AutoMapper;
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

        public ComputerOrderController(
            IComputerRepository computerRepository,
            IComputerOrderRepository computerOrderRepository,
            IUserRepository userRepository,
            IComputerCategoryRepository computerCategoryRepository,
            INotificationService notificationService
        )
        {
            _computerRepository = computerRepository;
            _computerOrderRepository = computerOrderRepository;
            _userRepository = userRepository;
            _computerCategoryRepository = computerCategoryRepository;
            _notificationService = notificationService;
        }

        [HttpPost("/computer-orders")]
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

                return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-orders")]
        public async Task<ActionResult<IEnumerable<ComputerOrderResponse>>> GetAll()
        {
            try
            {
                var orders = await _computerOrderRepository.GetAllAsync();

                var responses = orders.Select((order) => order.ToResponse()).ToList();

                return Ok(responses);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-orders/{id:int}")]
        public async Task<ActionResult<ComputerOrderResponse>> GetById([FromRoute] int id)
        {
            try
            {
                var order = await _computerOrderRepository.GetByIdAsync(id);
                if (order == null)
                    return NotFound();

                var response = order.ToResponse();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-orders/my-orders")]
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
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var order = await _computerOrderRepository.GetByIdAsync(id);

                if (order == null)
                    return NotFound();

                await _computerOrderRepository.DeleteAsync(order);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}