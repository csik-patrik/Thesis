using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Data;
using ThesisApi.Services;
using Microsoft.AspNetCore.Identity;
using ThesisApi.Models;
using AutoMapper;
using ThesisApi.Interfaces;
using ThesisApi.Contracts.Responses.Users;
using Microsoft.AspNetCore.Authorization;
using ThesisApi.ExtensionServices;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly TokenGenerator _tokenGenerator;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UserController(
            IUserRepository userRepository,
            IUserRoleRepository userRoleRepository,
            TokenGenerator tokenGenerator,
            ApplicationDbContext context,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _userRoleRepository = userRoleRepository;
            _tokenGenerator = tokenGenerator;
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("/login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.Users.Include(x => x.UserRoles).FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return Unauthorized("Invalid email!");

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid password!");

            var newTokenRequest = _mapper.Map<NewTokenRequest>(user);

            var access_token = _tokenGenerator.GenerateToken(newTokenRequest);

            return Ok(access_token);

        }

        [HttpGet("/users")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsers()
        {
            try
            {
                var users = await _userRepository.GetAllAsync();

                var response = users.Select((user) => user.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/users/{id:int}")]
        public async Task<ActionResult<UserResponse>> GetUserById([FromRoute] int id)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                    return NotFound();

                var response = user.ToResponse();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        // [HttpGet("/users/{name}")]
        // public async Task<IActionResult> GetUsersByDisplayName([FromRoute] string name)
        // {
        //     try
        //     {
        //         var users = await _userRepository.GetByDisplayNameAsync(name);

        //         var response = users.Select(_mapper.Map<UserResponse>).ToList();

        //         return Ok(response);
        //     }
        //     catch (Exception e)
        //     {
        //         return BadRequest(e.Message);
        //     }
        // }

        [HttpPost("/users")]
        public async Task<ActionResult<UserResponse>> CreateUser(CreateUserRequest request)
        {
            try
            {
                var roles = await _userRoleRepository.GetUserRolesByIdAsync(request.UserRoleIds);
                if (!roles.Any())
                    return BadRequest("User roles are not valid!");

                var passwordHasher = new PasswordHasher<User>();

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

                user.Password = passwordHasher.HashPassword(user, user.Password);

                await _userRepository.CreateAsync(user);

                var response = user.ToResponse();

                return CreatedAtAction("", response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("/users")]
        public async Task<ActionResult<UserResponse>> UpdateUser([FromBody] UpdateUserRequest request)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(request.Id);

                if (user == null)
                    return NotFound();

                var updatedUser = await _userRepository.UpdateUserAsync(user, request);

                var response = user.ToResponse();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("/users/{id:int}")]
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

        [HttpGet("/roles")]
        public async Task<ActionResult<IEnumerable<UserRoleResponse>>> GetRoles()
        {
            try
            {
                var roles = await _userRoleRepository.GetUserRolesAsync();

                var response = roles.Select((role) => role.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/users/group-leader")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetGroupLeaders()
        {
            try
            {
                var users = await _userRepository.GetGroupLeadersAsync();

                var response = users.Select((user) => user.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}