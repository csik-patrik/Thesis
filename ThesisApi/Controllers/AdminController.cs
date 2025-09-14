using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.Contracts.Responses.Users;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IMapper _mapper;

        public AdminController(IAdminRepository adminRepository, IMapper mapper)
        {
            _adminRepository = adminRepository;
            _mapper = mapper;
        }

        [HttpGet(ApiEndpoints.Admin.GetAllMobileDeviceCategories)]
        public async Task<IActionResult> GetAllMobileDeviceCategories()
        {
            try
            {
                var models = await _adminRepository.GetAllMobileDeviceCategoriesAsync();

                var response = _mapper.Map<List<MobileDeviceCategoryResponse>>(models);

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

                var response = _mapper.Map<MobileDeviceCategoryResponse>(model);

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

                var response = _mapper.Map<MobileDeviceCategoryResponse>(model);

                return Ok(response);
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

        [HttpGet(ApiEndpoints.Admin.GetUsers)]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _adminRepository.GetUsersAsync();

                var response = users.Select(_mapper.Map<UserResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost(ApiEndpoints.Admin.CreateUser)]
        public async Task<IActionResult> CreateUser(CreateUserRequest request)
        {
            try
            {
                var roles = await _adminRepository.GetUserRolesByIdAsync(request.UserRoleIds);
                if (!roles.Any())
                    return BadRequest("User roles are not valid!");

                var user = new User()
                {
                    Username = request.Username,
                    Email = request.Email,
                    Password = request.Password,
                    Department = request.Department,
                    CostCenter = request.CostCenter,
                    UserRoles = roles.ToList()
                };

                await _adminRepository.AddUserAsync(user);

                var response = _mapper.Map<UserResponse>(user);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete(ApiEndpoints.Admin.DeleteUser)]
        public async Task<IActionResult> DeleteUser([FromRoute] int id)
        {
            try
            {
                var result = await _adminRepository.DeleteUserById(id);

                if (!result)
                {
                    return NotFound("User not found!");
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet(ApiEndpoints.Admin.GetRoles)]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var roles = await _adminRepository.GetUserRolesAsync();

                var response = roles.Select(_mapper.Map<UserRoleResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}