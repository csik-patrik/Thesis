using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using ThesisApi.Data;
using ThesisApi.Models;

namespace ThesisApi.Services
{
    public class UserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByLoginRequestAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email && x.Password == request.Password);

            return user;
        }
    }
}