using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.Contracts.Responses.MobileOrders;
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
        private readonly IMapper _mapper;
        public MobileDeviceController(
            IMobileDeviceRepository mobileDeviceRepository,
            IMobileDeviceCategoryRepository mobileDeviceCategoryRepository,
            IMobileOrderRepository mobileOrderRepository,
            IMapper mapper)
        {
            _mobileDeviceRepository = mobileDeviceRepository;
            _mobileDeviceCategoryRepository = mobileDeviceCategoryRepository;
            _mapper = mapper;
        }

        [HttpPost("/mobile-devices")]
        public async Task<IActionResult> Create([FromBody] CreateMobileDeviceRequest request)
        {
            try
            {
                var mobileDevice = await MobileDevice.Create(request, _mobileDeviceCategoryRepository);

                var newMobileDevice = await _mobileDeviceRepository.AddAsync(mobileDevice);

                var response = _mapper.Map<MobileDeviceResponse>(newMobileDevice);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("/mobile-devices/bulk")]
        public async Task<IActionResult> CreateBulk([FromBody] List<CreateMobileDeviceRequest> request)
        {
            try
            {
                var mobiles = await MobileDevice.CreateBulk(request, _mobileDeviceCategoryRepository);

                if (mobiles == null || !mobiles.Any())
                    return BadRequest("Error while creating devices!");

                await _mobileDeviceRepository.AddBulkAsync(mobiles);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-devices")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var mobileDevices = await _mobileDeviceRepository.GetAllAsync();

                var response = mobileDevices.Select(_mapper.Map<MobileDeviceResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-devices/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            try
            {
                var mobileDevice = await _mobileDeviceRepository.GetByIdAsync(id);

                if (mobileDevice == null)
                    return NotFound();

                var response = _mapper.Map<MobileDeviceResponse>(mobileDevice);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-devices/allocation/{categoryId:int}")]
        public async Task<IActionResult> GetAllForAllocation([FromRoute] int categoryId)
        {
            try
            {
                var mobileDevices = await _mobileDeviceRepository.GetAllForAllocationAsync(categoryId);

                var response = mobileDevices.Select(_mapper.Map<MobileDeviceResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-devices/deployed")]
        public async Task<IActionResult> GetAllDeployed()
        {
            try
            {
                var mobileDevices = await _mobileDeviceRepository.GetAllDeployedAsync();

                var response = mobileDevices.Select(_mapper.Map<MobileDeviceResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/mobile-devices/my-devices")]
        public async Task<IActionResult> GetMyDevices()
        {
            try
            {
                var username = User.FindFirst("username")?.Value;

                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User is not logged in.");
                }

                var mobiles = await _mobileDeviceRepository.GetAllByUserAsync(username);

                var response = mobiles.Select(_mapper.Map<MobileDeviceResponse>).ToList();

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

                var updatedMobileDevice = await _mobileDeviceRepository.ReturnDeviceAsync(mobileDevice, request.Status, request.StatusReason);

                var response = _mapper.Map<MobileOrderResponse>(updatedMobileDevice);

                return Ok(response);
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