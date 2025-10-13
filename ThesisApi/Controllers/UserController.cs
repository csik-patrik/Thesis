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

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return Unauthorized("Invalid email or password.");

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid email or password.");

            var newTokenRequest = _mapper.Map<NewTokenRequest>(user);

            var access_token = _tokenGenerator.GenerateToken(newTokenRequest);

            return Ok(access_token);

        }

        [HttpGet("/users")]
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

        [HttpPost("/users")]
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