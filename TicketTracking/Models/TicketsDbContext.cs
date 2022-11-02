using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace TicketTracking.Models
{
    public class TicketsDbContext : IdentityDbContext<IdentityUser>
    {
        public TicketsDbContext(DbContextOptions options) : base(options)
        { }

        public DbSet<Ticket> Tickets { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
