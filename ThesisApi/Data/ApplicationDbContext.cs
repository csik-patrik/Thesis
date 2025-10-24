using Microsoft.EntityFrameworkCore;
using ThesisApi.Models;

namespace ThesisApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }
        public DbSet<SimCallControlGroup> SimCallControlGroups { get; set; }
        public DbSet<SimCard> SimCards { get; set; }
        public DbSet<MobileDevice> MobileDevices { get; set; }
        public DbSet<MobileOrder> MobileOrders { get; set; }
        public DbSet<Computer> Computers { get; set; }
        public DbSet<ComputerCategory> ComputerCategories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<MobileDeviceCategory> MobileDeviceCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>().HasData(
                new UserRole { Id = 1, Name = "User" },
                new UserRole { Id = 2, Name = "Admin" }
            );
        }
    }
}