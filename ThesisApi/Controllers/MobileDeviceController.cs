using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.ExtensionServices;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class MobileDeviceController : ControllerBase
    {
        private readonly IMobileDeviceRepository _mobileDeviceRepository;
        private readonly IMobileDeviceCategoryRepository _mobileDeviceCategoryRepository;
        public MobileDeviceController(
            IMobileDeviceRepository mobileDeviceRepository,
            IMobileDeviceCategoryRepository mobileDeviceCategoryRepository)
        {
            _mobileDeviceRepository = mobileDeviceRepository;
            _mobileDeviceCategoryRepository = mobileDeviceCategoryRepository;
        }

        [HttpPost("/mobile-devices")]
        public async Task<ActionResult<MobileDeviceResponse>> Create([FromBody] CreateMobileDeviceRequest request)
        {
            try
            {
                var mobileDevice = await MobileDevice.Create(request, _mobileDeviceCategoryRepository);

                var newMobileDevice = await _mobileDeviceRepository.AddAsync(mobileDevice);

                var response = mobileDevice.ToResponse();

                return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("/mobile-devices/bulk")]
        public async Task<ActionResult<IEnumerable<MobileDeviceResponse>>> CreateBulk([FromBody] List<CreateMobileDeviceRequest> request)
        {
            try
            {
                var newMobiles = await MobileDevice.CreateBulk(request, _mobileDeviceCategoryRepository);

                if (newMobiles == null || !newMobiles.Any())
                    return BadRequest("Error while creating devices!");

                await _mobileDeviceRepository.AddBulkAsync(newMobiles);

                var response = newMobiles.Select((mobileDevice) => mobileDevice.ToResponse()).ToList();

                return Created("", response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-devices")]
        public async Task<ActionResult<IEnumerable<MobileDeviceResponse>>> GetAll()
        {
            try
            {
                var mobileDevices = await _mobileDeviceRepository.GetAllAsync();

                var response = mobileDevices.Select((mobileDevice) => mobileDevice.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-devices/{id:int}")]
        public async Task<ActionResult<MobileDeviceResponse>> GetById([FromRoute] int id)
        {
            try
            {
                var mobileDevice = await _mobileDeviceRepository.GetByIdAsync(id);

                if (mobileDevice == null)
                    return NotFound();

                var response = mobileDevice.ToResponse();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-devices/allocation/{categoryId:int}")]
        public async Task<ActionResult<IEnumerable<MobileDeviceResponse>>> GetAllForAllocation([FromRoute] int categoryId)
        {
            try
            {
                var mobileDevices = await _mobileDeviceRepository.GetAllForAllocationAsync(categoryId);

                var response = mobileDevices.Select((mobileDevice) => mobileDevice.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-devices/deployed")]
        public async Task<ActionResult<IEnumerable<MobileDeviceResponse>>> GetAllDeployed()
        {
            try
            {
                var mobileDevices = await _mobileDeviceRepository.GetAllDeployedAsync();

                var response = mobileDevices.Select((mobileDevice) => mobileDevice.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-devices/my-devices")]
        public async Task<ActionResult<IEnumerable<MobileDeviceResponse>>> GetMyDevices()
        {
            try
            {
                var username = User.FindFirst("username")?.Value;

                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User is not logged in.");
                }

                var mobiles = await _mobileDeviceRepository.GetAllByUserAsync(username);

                var response = mobiles.Select((mobileDevice) => mobileDevice.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("/mobile-devices/return/{id:int}")]
        public async Task<IActionResult> ReturnMobileDevice([FromRoute] int id, [FromBody] ReturnMobileDeviceRequest request)
        {
            try
            {
                var mobileDevice = await _mobileDeviceRepository.GetByIdAsync(id);

                if (mobileDevice == null)
                    return NotFound("Mobile device is not found.");

                if (mobileDevice.Status != "Deployed")
                    return BadRequest("Only deployed mobile device can be returned.");

                await _mobileDeviceRepository.ReturnDeviceAsync(mobileDevice, request.Status, request.StatusReason);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("/mobile-devices/update/status-reason/{id:int}")]
        public async Task<IActionResult> UpdateStatusReason([FromRoute] int id, [FromBody] string statusReason)
        {
            try
            {
                var mobileDevice = await _mobileDeviceRepository.GetByIdAsync(id);

                if (mobileDevice == null)
                    return NotFound("Mobile device is not found.");


                await _mobileDeviceRepository.UpdateStatusReasonAsync(mobileDevice, statusReason);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("/mobile-devices/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var result = await _mobileDeviceRepository.DeleteAsync(id);

                if (!result)
                    return NotFound();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }
    }
}