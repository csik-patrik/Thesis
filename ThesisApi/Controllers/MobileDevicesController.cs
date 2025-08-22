using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Helpers;
using ThesisApi.Interfaces;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MobileDevicesController : ControllerBase
    {
        private readonly IMobileDeviceRepository _mobileDeviceRepository;

        public MobileDevicesController(IMobileDeviceRepository mobileDeviceRepository)
        {
            _mobileDeviceRepository = mobileDeviceRepository;
        }

        [HttpGet("mobile-devices")]
        public async Task<IActionResult> GetAll()
        {
            var mobileDevices = await _mobileDeviceRepository.GetAllAsync();
            return Ok(mobileDevices);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateMobileDeviceRequest request)
        {
            var mobileDevice = request.MapToMobileDevice();

            if (mobileDevice == null)
                return BadRequest();

            var newMobileDevice = await _mobileDeviceRepository.AddAsync(mobileDevice);

            return Ok(newMobileDevice.MapToResponse());
        }

        [HttpGet("get/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var mobileDevice = await _mobileDeviceRepository.GetByIdAsync(id);
            if (mobileDevice == null)
                return NotFound();
            return Ok(mobileDevice.MapToResponse());
        }

        [HttpDelete("delete/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var result = await _mobileDeviceRepository.DeleteAsync(id);

            if (!result)
                return NotFound();
            return Ok();
        }
    }
}