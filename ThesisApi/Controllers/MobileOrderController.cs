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
        private readonly IUserRepository _userRepository;
        private readonly IMobileOrderRepository _mobileOrderRepository;
        private readonly IMobileDeviceRepository _mobileDeviceRepository;
        private readonly IMobileDeviceCategoryRepository _mobileDeviceCategoryRepository;
        private readonly ISimCallControlGroupRepository _simCallControlGroupRepository;
        private readonly ISimCardRepository _simCardRepository;
        private readonly IMapper _mapper;
        public MobileOrderController(
            IUserRepository userRepository,
            IMobileOrderRepository mobileOrderRepository,
            IMobileDeviceRepository mobileDeviceRepository,
            IMobileDeviceCategoryRepository mobileDeviceCategoryRepository,
            ISimCallControlGroupRepository simCallControlGroupRepository,
            ISimCardRepository simCardRepository,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _mobileOrderRepository = mobileOrderRepository;
            _mobileDeviceRepository = mobileDeviceRepository;
            _mobileDeviceCategoryRepository = mobileDeviceCategoryRepository;
            _simCallControlGroupRepository = simCallControlGroupRepository;
            _simCardRepository = simCardRepository;
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

        [HttpPut("/mobile-orders/allocate/device")]
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

        [HttpPut("/mobile-orders/allocate/sim-card")]
        public async Task<IActionResult> AllocateSimCard([FromBody] AllocateSimCardToOrderRequest request)
        {
            try
            {
                var mobileOrder = await _mobileOrderRepository.GetByIdAsync(request.OrderId);
                if (mobileOrder == null)
                    return NotFound("Mobile order is not found!");

                var simCard = await _simCardRepository.GetByIdAsync(request.SimCardId);
                if (simCard == null)
                    return NotFound("Sim card is not found!");

                if (mobileOrder.MobileDevice == null)
                    return StatusCode(400, "You must assign a mobile device first!");

                if (simCard.SimCallControlGroupId != mobileOrder.SimCallControlGroupId)
                    return StatusCode(400, "Sim card call control group is not the same as requested!");

                await _mobileOrderRepository.AllocateSimCardToOrderAsync(mobileOrder, simCard);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("/mobile-orders/deliver/{id:int}")]
        public async Task<IActionResult> DeliverOrder([FromRoute] int id)
        {
            try
            {
                var mobileOrder = await _mobileOrderRepository.GetByIdAsync(id);
                if (mobileOrder == null)
                    return NotFound("Mobile order is not found!");

                if (mobileOrder.MobileDevice == null)
                    return StatusCode(400, "Allocate a mobile device first!");

                if (mobileOrder.SimCard == null)
                    return StatusCode(400, "Allocate a sim card first!");

                await _mobileOrderRepository.DeliverOrderAsync(mobileOrder);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
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
    }
}