using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using ThesisApi.Contracts.Requests.Users;

namespace ThesisApi.Services
{
    public class TokenGenerator
    {
        public string GenerateToken(GenerateTokenRequest request)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = "qweertzruztjhngbdfsavrgvfrsdgfsrdtbggfrtbgfxbfdv123123123?????????"u8.ToArray();

            var claims = new List<Claim>()
            {
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Sub, request.Email),
                new(JwtRegisteredClaimNames.GivenName, request.Username),
                new(JwtRegisteredClaimNames.Email, request.Email)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(60),
                Issuer = "Api",
                Audience = "Users",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}