using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

// Application Database Context
// This class represents the database and contains DbSets for entities
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets - Each DbSet represents a table in the database
    public DbSet<MenuItem> MenuItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure entity relationships and constraints here
        modelBuilder.Entity<MenuItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            
            // Add query filter for soft delete
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Seed initial data (optional)
        // modelBuilder.Entity<MenuItem>().HasData(
        //     new MenuItem { Id = 1, Name = "Sample Item", Category = "Sample", Price = 10.99m }
        // );
    }
}
