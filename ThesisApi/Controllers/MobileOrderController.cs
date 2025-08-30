using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.MobileOrders;
using ThesisApi.Helpers;
using ThesisApi.Interfaces;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class MobileOrderController : ControllerBase
    {
        private readonly IMobileOrderRepository _mobileOrderRepository;

        public MobileOrderController(IMobileOrderRepository mobileOrderRepository)
        {
            _mobileOrderRepository = mobileOrderRepository;
        }

        [HttpGet(ApiEndpoints.MobileOrders.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _mobileOrderRepository.GetAllAsync();
            return Ok(orders);
        }

        [HttpPost(ApiEndpoints.MobileOrders.Create)]
        public async Task<IActionResult> Create([FromBody] CreateMobileOrderRequest request)
        {
            var order = request.MapToOrder();

            if (order == null)
                return BadRequest();

            var newOrder = await _mobileOrderRepository.AddAsync(order);

            return Ok(newOrder.MapToResponse());
        }

        [HttpGet(ApiEndpoints.MobileOrders.Get)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var order = await _mobileOrderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound();
            return Ok(order.MapToResponse());
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