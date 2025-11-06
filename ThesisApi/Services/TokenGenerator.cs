using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ThesisApi.Contracts.Requests.Users;

namespace ThesisApi.Services
{
    public class TokenGenerator
    {
        private const string SecretKey = "qweertzruztjhngbdfsavrgvfrsdgfsrdtbggfrtbgfxbfdv123123123?????????";
        private const string Issuer = "Api";
        private const string Audience = "Users";

        public string GenerateToken(NewTokenRequest request)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(SecretKey);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Sub, request.Id.ToString() ?? string.Empty),
                new(JwtRegisteredClaimNames.GivenName, request.Username ?? string.Empty),
                new(JwtRegisteredClaimNames.Email, request.Email ?? string.Empty),

                new("username", request.Username ?? string.Empty),
                new("displayname", request.Displayname ?? string.Empty),
                new("department", request.Department ?? string.Empty),
                new("costCenter", request.CostCenter ?? string.Empty)
            };

            if (request.UserRoles != null)
            {
                foreach (var role in request.UserRoles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role.Name));
                }
            }

            //var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = "Api",          // must match validator
                Audience = "Users",      // must match validator
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };


            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}