using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MobileDeviceController : ControllerBase
    {
        private readonly IMobileDeviceRepository _mobileDeviceRepository;
        private readonly IMapper _mapper;
        public MobileDeviceController(IMobileDeviceRepository mobileDeviceRepository, IMapper mapper)
        {
            _mobileDeviceRepository = mobileDeviceRepository;
            _mapper = mapper;
        }

        [HttpGet(ApiEndpoints.MobileDevices.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            var mobileDevices = await _mobileDeviceRepository.GetAllAsync();

            var response = mobileDevices.Select(_mapper.Map<MobileDeviceResponse>).ToList();

            return Ok(response);
        }

        [HttpGet(ApiEndpoints.MobileDevices.GetAllForAllocation)]
        public async Task<IActionResult> GetAllForAllocation()
        {
            var mobileDevices = await _mobileDeviceRepository.GetAllForAllocationAsync();

            var response = mobileDevices.Select(_mapper.Map<MobileDeviceResponse>).ToList();

            return Ok(response);
        }

        [HttpPost(ApiEndpoints.MobileDevices.Create)]
        public async Task<IActionResult> Create([FromBody] CreateMobileDeviceRequest request)
        {
            var mobileDevice = _mapper.Map<MobileDevice>(request);

            if (mobileDevice == null)
                return BadRequest();

            var newMobileDevice = await _mobileDeviceRepository.AddAsync(mobileDevice);

            var response = _mapper.Map<MobileDeviceResponse>(newMobileDevice);

            return Ok(response);
        }

        [HttpGet(ApiEndpoints.MobileDevices.Get)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var mobileDevice = await _mobileDeviceRepository.GetByIdAsync(id);

            if (mobileDevice == null)
                return NotFound();

            var response = _mapper.Map<MobileDeviceResponse>(mobileDevice);

            return Ok(response);
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

                var response = models.Select(_mapper.Map<MobileDeviceCategoryResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}