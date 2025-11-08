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
        public DbSet<ComputerOrder> ComputerOrders { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<MobileDeviceCategory> MobileDeviceCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>().HasData(
                new UserRole { Id = 1, Name = "User" },
                new UserRole { Id = 2, Name = "Admin" },
                new UserRole { Id = 3, Name = "Group leader" }
            );

            base.OnModelCreating(modelBuilder);

            // Configure Customer relationship
            modelBuilder.Entity<ComputerOrder>()
                .HasOne(o => o.Customer)
                .WithMany(u => u.CustomerComputerOrders)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Approver relationship
            modelBuilder.Entity<ComputerOrder>()
                .HasOne(o => o.Approver)
                .WithMany(u => u.ApproverComputerOrders)
                .HasForeignKey(o => o.ApproverId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Customer relationship
            modelBuilder.Entity<MobileOrder>()
                .HasOne(o => o.Customer)
                .WithMany(u => u.CustomerMobileOrders)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Approver relationship
            modelBuilder.Entity<MobileOrder>()
                .HasOne(o => o.Approver)
                .WithMany(u => u.ApproverMobileOrders)
                .HasForeignKey(o => o.ApproverId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}