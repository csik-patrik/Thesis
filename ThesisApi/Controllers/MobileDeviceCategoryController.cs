using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.MobileDeviceCategories;
using ThesisApi.Contracts.Responses.MobileDeviceCategories;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MobileDeviceCategoryController : ControllerBase
    {
        private readonly IMobileDeviceCategoryRepository _mobileDeviceCategoryRepository;
        private readonly IMapper _mapper;

        public MobileDeviceCategoryController(
            IMobileDeviceCategoryRepository mobileDeviceCategoryRepository,
            IMapper mapper)
        {
            _mobileDeviceCategoryRepository = mobileDeviceCategoryRepository;
            _mapper = mapper;
        }

        [HttpPost("mobile-device-categories")]
        public async Task<IActionResult> Create(CreateMobileDeviceCategoryRequest request)
        {
            try
            {
                var mobileDeviceCategory = MobileDeviceCategory.Create(request);

                await _mobileDeviceCategoryRepository.AddAsync(mobileDeviceCategory);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("mobile-device-categories")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _mobileDeviceCategoryRepository.GetAllAsync();

                var responses = categories.Select(_mapper.Map<MobileDeviceCategoryResponse>).ToList();

                return Ok(responses);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("mobile-device-categories/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            try
            {
                var category = await _mobileDeviceCategoryRepository.GetByIdAsync(id);

                var response = _mapper.Map<MobileDeviceCategoryResponse>(category);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}