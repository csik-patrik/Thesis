using Microsoft.EntityFrameworkCore;
using ThesisApi.Models;

namespace ThesisApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<SimCard> SimCards { get; set; }
        public DbSet<MobileDevice> MobileDevices { get; set; }
        public DbSet<MobileOrder> MobileOrders { get; set; }
        public DbSet<User> Users { get; set; }

    }
}