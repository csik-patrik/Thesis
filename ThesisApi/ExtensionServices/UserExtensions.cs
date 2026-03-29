using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Contracts.Responses.Users;
using ThesisApi.Models;

namespace ThesisApi.ExtensionServices
{
    public static class UserExtensions
    {
        public static UserResponse ToResponse(this User user)
        {
            return new UserResponse()
            {
                Id = user.Id,
                Username = user.Username,
                DisplayName = user.DisplayName,
                Email = user.Email,
                Department = user.Department,
                CostCenter = user.CostCenter,
                UserRoles = user.UserRoles.Select((role) => role.ToResponse()).ToList()
            };
        }

        public static UserOrderResponse ToOrderResponse(this User user)
        {
            return new UserOrderResponse()
            {
                Id = user.Id,
                UserName = user.Username,
                DisplayName = user.DisplayName,
                Email = user.Email,
                Department = user.Department,
                CostCenter = user.CostCenter
            };
        }

        public static UserRoleResponse ToResponse(this UserRole userRole)
        {
            return new UserRoleResponse()
            {
                Id = userRole.Id,
                Name = userRole.Name
            };
        }

        public static NewTokenRequest ToNewTokenRequest(this User user)
        {
            return new NewTokenRequest()
            {
                Id = user.Id,
                Username = user.Username,
                Displayname = user.DisplayName,
                Email = user.Email,
                Department = user.Department,
                CostCenter = user.CostCenter,
                UserRoles = user.UserRoles.Select((role) => role.ToResponse()).ToList()
            };
        }
    }
}