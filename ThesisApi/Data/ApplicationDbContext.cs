using Microsoft.EntityFrameworkCore;
using ThesisApi.Models;

namespace ThesisApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<DeviceStatus> DeviceStatuses { get; set; }
        public DbSet<DeviceStatusReason> DeviceStatusReasons { get; set; }
        public DbSet<SimCard> SimCards { get; set; }
        public DbSet<MobileDevice> MobileDevices { get; set; }
        public DbSet<MobileOrder> MobileOrders { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<MobileDeviceCategory> MobileDeviceCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<DeviceStatus>().HasData(
                new DeviceStatus { Id = 1, Name = "In Inventory" },
                new DeviceStatus { Id = 2, Name = "Deployed" },
                new DeviceStatus { Id = 3, Name = "Disposed" }
            );

            modelBuilder.Entity<DeviceStatusReason>().HasData(
                new DeviceStatusReason { Id = 1, Name = "In Inventory" },
                new DeviceStatusReason { Id = 2, Name = "Reserved" },
                new DeviceStatusReason { Id = 3, Name = "In Repair" },
                new DeviceStatusReason { Id = 4, Name = "Pending Disposal" }
            );

            modelBuilder.Entity<MobileDeviceCategory>().HasData(
                new MobileDeviceCategory { Id = 1, Name = "Standard smartphone" },
                new MobileDeviceCategory { Id = 2, Name = "Enhanced smartphone" },
                new MobileDeviceCategory { Id = 3, Name = "Feature phone" }
            );
        }
    }
}