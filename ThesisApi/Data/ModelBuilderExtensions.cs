using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ThesisApi.Contracts.Requests.ComputerCategories;
using ThesisApi.Contracts.Requests.MobileDeviceCategories;
using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Models;

namespace ThesisApi.Data
{
    public static class ModelBuilderExtensions
    {
        public static void Seed(this ModelBuilder builder)
        {
            builder.Entity<UserRole>().HasData(
                new UserRole { Id = 1, Name = "User" },
                new UserRole { Id = 2, Name = "Admin" },
                new UserRole { Id = 3, Name = "Group leader" }
            );

            builder.Entity<ComputerCategory>().HasData(
                ComputerCategory.Create(new CreateComputerCategoryRequest() { Name = "Standard" }),
                ComputerCategory.Create(new CreateComputerCategoryRequest() { Name = "Enhanced" }),
                ComputerCategory.Create(new CreateComputerCategoryRequest() { Name = "Professional" })
            );

            builder.Entity<MobileDeviceCategory>().HasData(
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest() { Name = "Feature phone" }),
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest() { Name = "Standard smartphone" }),
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest() { Name = "Enhanced smartphone" })
            );

            builder.Entity<MobileDeviceCategory>().HasData(
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest() { Name = "Feature phone" }),
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest() { Name = "Standard smartphone" }),
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest() { Name = "Enhanced smartphone" })
            );

            builder.Entity<User>().HasData(
                CreateUser(new CreateUserRequest() { Username = "user1", DisplayName = "Demo User1", CostCenter = "000001", Department = "Demo department", Email = "demo.user1@demo.com", Password = "PasswordDev01", UserRoleIds = [1] }, new UserRole() { Id = 1, Name = "User" }),
                CreateUser(new CreateUserRequest() { Username = "user2", DisplayName = "Demo User2", CostCenter = "000001", Department = "Demo department", Email = "demo.user2@demo.com", Password = "PasswordDev02", UserRoleIds = [2] }, new UserRole() { Id = 2, Name = "Admin" }),
                CreateUser(new CreateUserRequest() { Username = "user3", DisplayName = "Demo User3", CostCenter = "000001", Department = "Demo department", Email = "demo.user3@demo.com", Password = "PasswordDev03", UserRoleIds = [3] }, new UserRole() { Id = 2, Name = "Group leader" })
            );
        }

        private static User CreateUser(CreateUserRequest request, UserRole role)
        {
            var passwordHasher = new PasswordHasher<User>();

            var user = new User()
            {
                Username = request.Username,
                DisplayName = request.DisplayName,
                Email = request.Email,
                Password = request.Password,
                Department = request.Department,
                CostCenter = request.CostCenter,
                UserRoles = [role]
            };

            user.Password = passwordHasher.HashPassword(user, user.Password);

            return user;
        }
    }
}