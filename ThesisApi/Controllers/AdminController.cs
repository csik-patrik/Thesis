using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ThesisApi.Helpers;
using ThesisApi.Interfaces;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _adminRepository;

        public AdminController(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        [HttpGet(ApiEndpoints.Admin.GetAllMobileDeviceCategories)]
        public async Task<IActionResult> GetAllMobileDeviceCategories()
        {
            try
            {
                var models = await _adminRepository.GetAllMobileDeviceCategoriesAsync();

                var response = models.Select(x => x.MapToResponse());

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet(ApiEndpoints.Admin.GetMobileDeviceCategoryById)]
        public async Task<IActionResult> GetMobileDeviceCategoryById([FromRoute] int id)
        {
            try
            {
                var model = await _adminRepository.GetMobileDeviceCategoryByIdAsync(id);

                if (model == null)
                    return NotFound();

                var response = model.MapToResponse();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost(ApiEndpoints.Admin.CreateMobileDeviceCategory)]
        public async Task<IActionResult> CreateMobileDeviceCategory([FromBody] string name)
        {
            try
            {
                var model = await _adminRepository.CreateMobileDeviceCategoryAsync(name);

                return Ok(model.MapToResponse());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut(ApiEndpoints.Admin.UpdateMobileDeviceCategory)]
        public async Task<IActionResult> UpdateMobileDeviceCategory([FromRoute] int id, [FromBody] string name)
        {
            try
            {
                var model = await _adminRepository.UpdateMobileDeviceCategoryAsync(id, name);
                if (model == null)
                    return NotFound();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete(ApiEndpoints.Admin.DeleteMobileDeviceCategory)]
        public async Task<IActionResult> DeleteMobileDeviceCategory([FromRoute] int id)
        {
            try
            {
                var result = await _adminRepository.DeleteMobileDeviceCategory(id);

                if (result)
                    return Ok();

                return NotFound();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}