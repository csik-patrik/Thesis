using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Helpers;
using ThesisApi.Services;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly TokenGenerator _tokenGenerator;

        public UserController(TokenGenerator tokenGenerator, UserService userService)
        {
            _tokenGenerator = tokenGenerator;
            _userService = userService;
        }

        [HttpPost(ApiEndpoints.Users.Login)]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            var user = await _userService.GetUserByLoginRequestAsync(loginRequest);

            if (user == null)
                return Unauthorized();

            var access_token = _tokenGenerator.GenerateToken(user.MapToTokenRequest());

            return Ok(access_token);

        }

    }
}