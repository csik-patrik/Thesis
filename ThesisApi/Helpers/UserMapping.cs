using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Contracts.Responses.Users;
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

        public static UserRoleResponse MapToResponse(this UserRole userRole)
        {
            return new UserRoleResponse()
            {
                Id = userRole.Id,
                Name = userRole.Name
            };
        }

        public static UserResponse MapToResponse(this User user)
        {
            return new UserResponse()
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Department = user.Department,
                CostCenter = user.CostCenter,
                UserRoles = user.UserRoles.Select(x => x.MapToResponse()).ToList()
            };
        }
    }
}