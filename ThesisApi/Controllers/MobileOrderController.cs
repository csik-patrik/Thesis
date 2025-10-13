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
        private readonly IMobileDeviceRepository _mobileDeviceRepository;
        private readonly IMobileDeviceCategoryRepository _mobileDeviceCategoryRepository;
        private readonly ISimCallControlGroupRepository _simCallControlGroupRepository;
        private readonly IMapper _mapper;
        public MobileOrderController(
            IMobileOrderRepository mobileOrderRepository,
            IUserRepository userRepository,
            IMobileDeviceRepository mobileDeviceRepository,
            IMobileDeviceCategoryRepository mobileDeviceCategoryRepository,
            ISimCallControlGroupRepository simCallControlGroupRepository,
            IMapper mapper)
        {
            _mobileOrderRepository = mobileOrderRepository;
            _userRepository = userRepository;
            _mobileDeviceRepository = mobileDeviceRepository;
            _mobileDeviceCategoryRepository = mobileDeviceCategoryRepository;
            _simCallControlGroupRepository = simCallControlGroupRepository;
            _mapper = mapper;
        }

        [HttpPost("/mobile-orders")]
        public async Task<IActionResult> Create([FromBody] CreateMobileOrderRequest request)
        {
            try
            {
                var order = await MobileOrder.Create(
                request,
                _userRepository,
                _mobileDeviceCategoryRepository,
                _simCallControlGroupRepository);

                await _mobileOrderRepository.CreateAsync(order);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-orders")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var orders = await _mobileOrderRepository.GetAllAsync();

                var responses = orders.Select(_mapper.Map<MobileOrderResponse>).ToList();

                return Ok(responses);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-orders/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            try
            {
                var order = await _mobileOrderRepository.GetByIdAsync(id);
                if (order == null)
                    return NotFound();

                var response = _mapper.Map<MobileOrderResponse>(order);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("/mobile-orders/allocate")]
        public async Task<IActionResult> AllocateMobileDevice([FromBody] AllocateMobileDeviceToOrderRequest request)
        {
            try
            {
                var mobileOrder = await _mobileOrderRepository.GetByIdAsync(request.OrderId);
                if (mobileOrder == null)
                    return NotFound("Mobile order is not found!");

                var mobileDevice = await _mobileDeviceRepository.GetByIdAsync(request.MobileDeviceId);
                if (mobileDevice == null)
                    return NotFound("Mobile device is not found!");

                if (mobileOrder.MobileDeviceCategoryId != mobileDevice.MobileDeviceCategoryId)
                    return StatusCode(400, "Mobile device category is not the same as the requested!");

                await _mobileOrderRepository.AllocateMobileDeviceToOrderAsync(mobileOrder, mobileDevice);

                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpDelete("/mobile-orders/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var mobileOrder = await _mobileOrderRepository.GetByIdAsync(id);

                if (mobileOrder == null)
                    return NotFound();

                await _mobileOrderRepository.DeleteAsync(mobileOrder);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /*

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

        

        

        */
    }
}