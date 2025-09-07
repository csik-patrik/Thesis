using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ThesisApi.Contracts.Requests.Users;

namespace ThesisApi.Services
{
    public class TokenGenerator
    {
        public string GenerateToken(GenerateTokenRequest request)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.UTF8.GetBytes("qweertzruztjhngbdfsavrgvfrsdgfsrdtbggfrtbgfxbfdv123123123?????????");


            var claims = new List<Claim>()
            {
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Sub, request.Email),
                new(JwtRegisteredClaimNames.GivenName, request.Username),
                new(JwtRegisteredClaimNames.Email, request.Email),

                new("username", request.Username),
                new("department", request.Department),
                new("costCenter", request.CostCenter)
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