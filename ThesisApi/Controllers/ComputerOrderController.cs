using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.ComputerOrders;
using ThesisApi.Contracts.Responses.ComputerOrders;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ComputerOrderController : ControllerBase
    {
        private readonly IComputerOrderRepository _computerOrderRepository;
        private readonly IUserRepository _userRepository;
        private readonly IComputerCategoryRepository _computerCategoryRepository;
        private readonly IMapper _mapper;

        public ComputerOrderController(
            IComputerOrderRepository computerOrderRepository,
            IUserRepository userRepository,
            IComputerCategoryRepository computerCategoryRepository,
            IMapper mapper
        )
        {
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