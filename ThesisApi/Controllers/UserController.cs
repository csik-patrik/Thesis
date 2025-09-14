using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Data;
using ThesisApi.Services;
using Microsoft.AspNetCore.Identity;
using ThesisApi.Models;
using AutoMapper;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly TokenGenerator _tokenGenerator;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UserController(TokenGenerator tokenGenerator, ApplicationDbContext context, IMapper mapper)
        {
            _tokenGenerator = tokenGenerator;
            _context = context;
            _mapper = mapper;
        }

        [HttpPost(ApiEndpoints.Users.Login)]
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

    }
}