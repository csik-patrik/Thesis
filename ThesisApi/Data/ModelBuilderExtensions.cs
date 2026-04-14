using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
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
                new ComputerCategory() { Id = 1, Name = "Standard" },
                new ComputerCategory() { Id = 2, Name = "Enhanced" },
                new ComputerCategory() { Id = 3, Name = "Professional" }
            );

            builder.Entity<MobileDeviceCategory>().HasData(
                new MobileDeviceCategory() { Id = 1, Name = "Feature phone" },
                new MobileDeviceCategory() { Id = 2, Name = "Standard smartphone" },
                new MobileDeviceCategory() { Id = 3, Name = "Enhanced smartphone" }
            );

            builder.Entity<SimCallControlGroup>().HasData(
                new SimCallControlGroup() { Id = 1, Name = "Small", IsDataEnabled = false },
                new SimCallControlGroup() { Id = 2, Name = "Medium", IsDataEnabled = false },
                new SimCallControlGroup() { Id = 3, Name = "Large", IsDataEnabled = true }
            );

            builder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "user1",
                    DisplayName = "Demo User1",
                    CostCenter = "000001",
                    Department = "Demo department",
                    Email = "demo.user1@demo.com",
                    Password = "AQAAAAIAAYagAAAAECz6RUU/Xc9H9QwB0DJhf5kXqwWVw9wEhlgR48pNE28mp+5wY+qzLqoYsH2mW2oYxQ=="
                },
                new User
                {
                    Id = 2,
                    Username = "user2",
                    DisplayName = "Demo User2",
                    CostCenter = "000001",
                    Department = "Demo department",
                    Email = "demo.user2@demo.com",
                    Password = "AQAAAAIAAYagAAAAEKQyl5xwymUK928U9RYrzGZs1VZADbwFhh8WawPXDpFJ+hXUfkEbThjZPYFmtFjiVg=="
                },
                new User
                {
                    Id = 3,
                    Username = "user3",
                    DisplayName = "Demo User3",
                    CostCenter = "000001",
                    Department = "Demo department",
                    Email = "demo.user3@demo.com",
                    Password = "AQAAAAIAAYagAAAAEGWIGMJ2/ljmbfUjrxGwYS5j2f+BjcWZRY4Fl6zEqGUsaCxUdRsNK4c6+o0lZJvIcA=="
                }
            );

            builder.Entity<User>()
                .HasMany(u => u.UserRoles)
                .WithMany(r => r.Users)
                .UsingEntity(j => j.HasData(
                    new { UsersId = 1, UserRolesId = 1 },
                    new { UsersId = 2, UserRolesId = 2 },
                    new { UsersId = 3, UserRolesId = 3 }
                ));
        }

    public static void ApplyMigrations(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        db.Database.Migrate();
    }

        private static User CreateUser(int id, string username, string displayName, string costCenter, string department, string email, string password)
        {
            var user = new User()
            {
                Id = id,
                Username = username,
                DisplayName = displayName,
                Email = email,
                Password = password,
                Department = department,
                CostCenter = costCenter,
                // UserRoles-t NEM állítjuk be itt!
            };

            var passwordHasher = new PasswordHasher<User>();
            user.Password = passwordHasher.HashPassword(user, password);
            return user;
        }
    }
}