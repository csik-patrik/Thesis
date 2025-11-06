using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.ComputerOrders;
using ThesisApi.Contracts.Responses.ComputerOrders;
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
        private readonly IMapper _mapper;

        public ComputerOrderController(
            IComputerRepository computerRepository,
            IComputerOrderRepository computerOrderRepository,
            IUserRepository userRepository,
            IComputerCategoryRepository computerCategoryRepository,
            IMapper mapper
        )
        {
            _computerRepository = computerRepository;
            _computerOrderRepository = computerOrderRepository;
            _userRepository = userRepository;
            _computerCategoryRepository = computerCategoryRepository;
            _mapper = mapper;
        }

        [HttpPost("/computer-orders")]
        public async Task<IActionResult> Create([FromBody] CreateComputerOrderRequest request)
        {
            try
            {
                var order = await ComputerOrder.Create(
                    request,
                    _userRepository,
                    _computerCategoryRepository);

                await _computerOrderRepository.CreateAsync(order);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-orders")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var orders = await _computerOrderRepository.GetAllAsync();

                var responses = orders.Select(_mapper.Map<ComputerOrderResponse>).ToList();

                return Ok(responses);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-orders/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            try
            {
                var order = await _computerOrderRepository.GetByIdAsync(id);
                if (order == null)
                    return NotFound();

                var response = _mapper.Map<ComputerOrderResponse>(order);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-orders/my-orders")]
        public async Task<IActionResult> GetByCustomerId()
        {
            try
            {
                var username = User.FindFirst("username")?.Value;
                if (string.IsNullOrEmpty(username))
                    return Unauthorized("User is not logged in.");

                var orders = await _computerOrderRepository.GetByUsernameAsync(username);

                var response = orders.Select(_mapper.Map<ComputerOrderResponse>).ToList();

                return Ok(response);
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