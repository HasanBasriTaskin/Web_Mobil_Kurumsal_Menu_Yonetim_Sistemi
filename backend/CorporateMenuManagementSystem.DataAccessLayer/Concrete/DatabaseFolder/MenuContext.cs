using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder
{
    public class MenuContext : IdentityDbContext<AppUser, AppRole, string>
    {
        public MenuContext(DbContextOptions<MenuContext> options) : base(options)
        {

        }

        public DbSet<Menu> Menus { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Survey> Surveys { get; set; }
        public DbSet<SurveyResponse> SurveyResponses { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // AppUser - Reservation ilişkisi (Bir'e Çok)
            builder.Entity<AppUser>()
                .HasMany(u => u.Reservations)
                .WithOne(r => r.AppUser)
                .HasForeignKey(r => r.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // AppUser - Feedback ilişkisi (Bir'e Çok)
            builder.Entity<AppUser>()
                .HasMany(u => u.Feedbacks)
                .WithOne(f => f.AppUser)
                .HasForeignKey(f => f.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // AppUser - Notification ilişkisi (Bir'e Çok)
            builder.Entity<AppUser>()
                .HasMany(u => u.Notifications)
                .WithOne(n => n.AppUser)
                .HasForeignKey(n => n.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Menu - Reservation ilişkisi (Bir'e Çok)
            builder.Entity<Menu>()
                .HasMany(m => m.Reservations)
                .WithOne(r => r.Menu)
                .HasForeignKey(r => r.MenuId)
                .OnDelete(DeleteBehavior.Cascade);

            // Menu - Feedback ilişkisi (Bir'e Çok)
            builder.Entity<Menu>()
                .HasMany(m => m.Feedbacks)
                .WithOne(f => f.Menu)
                .HasForeignKey(f => f.MenuId)
                .OnDelete(DeleteBehavior.Cascade);

            // Survey - SurveyResponse ilişkisi (Bir'e Çok)
            builder.Entity<Survey>()
                .HasMany(s => s.SurveyResponses)
                .WithOne(sr => sr.Survey)
                .HasForeignKey(sr => sr.SurveyId)
                .OnDelete(DeleteBehavior.Cascade);

            // AppUser - SurveyResponse ilişkisi (Bir'e Çok)
            builder.Entity<AppUser>()
                .HasMany<SurveyResponse>()
                .WithOne(sr => sr.AppUser)
                .HasForeignKey(sr => sr.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
