using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Helpers;
using ThesisApi.Interfaces;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MobileDeviceController : ControllerBase
    {
        private readonly IMobileDeviceRepository _mobileDeviceRepository;

        public MobileDeviceController(IMobileDeviceRepository mobileDeviceRepository)
        {
            _mobileDeviceRepository = mobileDeviceRepository;
        }

        [HttpGet(ApiEndpoints.MobileDevices.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var mobileDevices = await _mobileDeviceRepository.GetAllAsync();
            return Ok(mobileDevices);
        }

        [HttpPost(ApiEndpoints.MobileDevices.Create)]
        public async Task<IActionResult> Create([FromBody] CreateMobileDeviceRequest request)
        {
            var mobileDevice = request.MapToMobileDevice();

            if (mobileDevice == null)
                return BadRequest();

            var newMobileDevice = await _mobileDeviceRepository.AddAsync(mobileDevice);

            return Ok(newMobileDevice.MapToResponse());
        }

        [HttpGet(ApiEndpoints.MobileDevices.Get)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var mobileDevice = await _mobileDeviceRepository.GetByIdAsync(id);
            if (mobileDevice == null)
                return NotFound();
            return Ok(mobileDevice.MapToResponse());
        }

        [HttpDelete(ApiEndpoints.MobileDevices.Delete)]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var result = await _mobileDeviceRepository.DeleteAsync(id);

            if (!result)
                return NotFound();
            return Ok();
        }

        [HttpGet(ApiEndpoints.MobileDevices.GetAllMobileDeviceCategories)]
        public async Task<IActionResult> GetAllMobileDeviceCategories()
        {
            try
            {
                var models = await _mobileDeviceRepository.GetMobileDeviceCategoriesAsync();

                var response = models.Select(x => x.MapToResponse());

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}