using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Services;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly TokenGenerator _tokenGenerator;

        public UserController(TokenGenerator tokenGenerator)
        {
            _tokenGenerator = tokenGenerator;
        }

        [HttpPost("/login")]
        public IActionResult Login(LoginRequest loginRequest)
        {
            var access_token = _tokenGenerator.GenerateToken(loginRequest.Email);

            return Ok(access_token);

        }

    }
}