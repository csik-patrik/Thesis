using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.MobileOrders;
using ThesisApi.Contracts.Responses.MobileOrders;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MobileOrderController : ControllerBase
    {
        private readonly IMobileOrderRepository _mobileOrderRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMobileDeviceCategoryRepository _mobileDeviceCategoryRepository;
        private readonly ISimCallControlGroupRepository _simCallControlGroupRepository;
        private readonly IMapper _mapper;
        public MobileOrderController(
            IMobileOrderRepository mobileOrderRepository,
            IUserRepository userRepository,
            IMobileDeviceCategoryRepository mobileDeviceCategoryRepository,
            ISimCallControlGroupRepository simCallControlGroupRepository,
            IMapper mapper)
        {
            _mobileOrderRepository = mobileOrderRepository;
            _userRepository = userRepository;
            _mobileDeviceCategoryRepository = mobileDeviceCategoryRepository;
            _simCallControlGroupRepository = simCallControlGroupRepository;
            _mapper = mapper;
        }

        [HttpPost(ApiEndpoints.MobileOrders.Create)]
        public async Task<IActionResult> Create([FromBody] CreateMobileOrderRequest request)
        {
            var order = await MobileOrder.Create(request, _userRepository, _mobileDeviceCategoryRepository, _simCallControlGroupRepository);

            var newOrder = await _mobileOrderRepository.CreateAsync(order);

            var response = _mapper.Map<MobileOrderResponse>(newOrder);

            return Ok(response);
        }

        /*[HttpGet(ApiEndpoints.MobileOrders.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _mobileOrderRepository.GetAllAsync();

            var responses = orders.Select(_mapper.Map<MobileOrderResponse>).ToList();

            return Ok(responses);
        }

        [HttpPut(ApiEndpoints.MobileOrders.AllocateMobileDevice)]
        public async Task<IActionResult> AllocateMobileDevice([FromRoute] int id, [FromBody] int mobileId)
        {
            try
            {
                var updatedOrder = await _mobileOrderRepository.AllocateMobileToOrderAsync(id, mobileId);
                if (updatedOrder == null)
                    return NotFound("Order or mobile not found!");

                var response = _mapper.Map<MobileOrderResponse>(updatedOrder);

                return Ok(response);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpPut(ApiEndpoints.MobileOrders.AllocateSimCard)]
        public async Task<IActionResult> AllocateSimCard([FromRoute] int id, [FromBody] int simId)
        {
            try
            {
                var updatedOrder = await _mobileOrderRepository.AllocateSimCardToOrderAsync(id, simId);
                if (updatedOrder == null)
                    return NotFound("Order or SIM card not found!");

                var response = _mapper.Map<MobileOrderResponse>(updatedOrder);

                return Ok(response);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpPut(ApiEndpoints.MobileOrders.DeliverOrder)]
        public async Task<IActionResult> DeliverOrder([FromRoute] int id)
        {
            try
            {
                var updatedOrder = await _mobileOrderRepository.DeliverOrderAsync(id);
                if (updatedOrder == null)
                    return NotFound("Order not found!");

                var response = _mapper.Map<MobileOrderResponse>(updatedOrder);

                return Ok(response);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        

        [HttpGet(ApiEndpoints.MobileOrders.Get)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var order = await _mobileOrderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound();

            var response = _mapper.Map<MobileOrderResponse>(order);

            return Ok(response);
        }

        [HttpDelete(ApiEndpoints.MobileOrders.Delete)]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var result = await _mobileOrderRepository.DeleteAsync(id);

            if (!result)
                return NotFound();
            return Ok();
        }*/
    }
}