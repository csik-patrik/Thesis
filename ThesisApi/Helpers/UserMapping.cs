using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Models;

namespace ThesisApi.Helpers
{
    public static class UserMapping
    {
        public static GenerateTokenRequest MapToTokenRequest(this User user)
        {
            return new GenerateTokenRequest()
            {
                Username = user.Username,
                Email = user.Email,
                Department = user.Department,
                CostCenter = user.CostCenter
            };
        }
    }
}