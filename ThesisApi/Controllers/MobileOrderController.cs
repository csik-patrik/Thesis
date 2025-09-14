using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata;
using ThesisApi.Contracts.Requests.MobileOrders;
using ThesisApi.Contracts.Responses.MobileOrders;
using ThesisApi.Helpers;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MobileOrderController : ControllerBase
    {
        private readonly IMobileOrderRepository _mobileOrderRepository;
        private readonly IMapper _mapper;
        public MobileOrderController(IMobileOrderRepository mobileOrderRepository, IMapper mapper)
        {
            _mobileOrderRepository = mobileOrderRepository;
            _mapper = mapper;
        }

        [HttpGet(ApiEndpoints.MobileOrders.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _mobileOrderRepository.GetAllAsync();

            var responses = orders.Select(_mapper.Map<MobileOrderResponse>).ToList();

            return Ok(responses);
        }

        [HttpPut(ApiEndpoints.MobileOrders.AllocateMobileDevice)]
        public async Task<IActionResult> AllocateMobileDevice([FromRoute] int orderId, [FromBody] int mobileId)
        {
            try
            {
                var updatedOrder = await _mobileOrderRepository.AllocateMobileToOrderAsync(orderId, mobileId);
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

        [HttpPost(ApiEndpoints.MobileOrders.Create)]
        public async Task<IActionResult> Create([FromBody] CreateMobileOrderRequest request)
        {
            var order = _mapper.Map<MobileOrder>(request);

            if (order == null)
                return BadRequest();

            var newOrder = await _mobileOrderRepository.AddAsync(order);

            var response = _mapper.Map<MobileOrderResponse>(newOrder);

            return Ok(response);
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
        }
    }
}