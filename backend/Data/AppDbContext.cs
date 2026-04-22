using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ServiceOffering> ServiceOfferings => Set<ServiceOffering>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>()
            .HasMany(c => c.Products)
            .WithOne(p => p.Category)
            .HasForeignKey(p => p.CategoryId);

        modelBuilder.Entity<Category>()
            .Property(c => c.Name)
            .HasMaxLength(80);

        modelBuilder.Entity<Category>()
            .Property(c => c.Slug)
            .HasMaxLength(80);

        modelBuilder.Entity<Product>()
            .Property(p => p.Name)
            .HasMaxLength(140);

        modelBuilder.Entity<Product>()
            .Property(p => p.Slug)
            .HasMaxLength(140);

        modelBuilder.Entity<Product>()
            .Property(p => p.ImageUrl)
            .HasMaxLength(300);

        modelBuilder.Entity<ServiceOffering>()
            .Property(s => s.Name)
            .HasMaxLength(120);

        modelBuilder.Entity<ContactMessage>()
            .Property(c => c.FullName)
            .HasMaxLength(80);

        modelBuilder.Entity<ContactMessage>()
            .Property(c => c.Email)
            .HasMaxLength(120);
    }
}
