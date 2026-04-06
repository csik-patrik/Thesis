[HttpPost("/login")]
[AllowAnonymous]
public async Task<IActionResult> Login(LoginRequest request)
{
    try {
        var user = await _context.Users
          .Include(x => x.UserRoles)
          .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
            return Unauthorized();

        var passwordHasher = new PasswordHasher<User>();
        var result = passwordHasher.VerifyHashedPassword(
          user, user.Password, request.Password);

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized();

        var newTokenRequest = user.ToNewTokenRequest();

        var access_token = _tokenGenerator.GenerateToken(newTokenRequest);

        return Ok(access_token);
    }
    catch (Exception e) {
        return BadRequest(e.Message);
    }
}