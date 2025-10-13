using System.Runtime.CompilerServices;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Contracts.Responses.MobileDeviceCategories;
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
        private readonly IUserRepository _userRepository;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IMapper _mapper;

        public AdminController(
            IUserRepository userRepository,
            IUserRoleRepository userRoleRepository,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _userRoleRepository = userRoleRepository;
            _mapper = mapper;
        }

        [HttpGet(ApiEndpoints.Admin.GetUsers)]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _userRepository.GetAllAsync();

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
                var roles = await _userRoleRepository.GetUserRolesByIdAsync(request.UserRoleIds);
                if (!roles.Any())
                    return BadRequest("User roles are not valid!");

                var user = new User()
                {
                    Username = request.Username,
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    Password = request.Password,
                    Department = request.Department,
                    CostCenter = request.CostCenter,
                    UserRoles = roles.ToList()
                };

                await _userRepository.CreateAsync(user);

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
                var user = await _userRepository.GetByIdAsync(id);
                if (user == null)
                    return NotFound("User is not found!");

                var result = await _userRepository.DeleteById(user);

                if (!result)
                {
                    return NotFound("Error while deleting");
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
                var roles = await _userRoleRepository.GetUserRolesAsync();

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