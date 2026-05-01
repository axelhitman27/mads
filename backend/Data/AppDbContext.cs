using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductCharacteristic> ProductCharacteristics => Set<ProductCharacteristic>();
    public DbSet<ServiceOffering> ServiceOfferings => Set<ServiceOffering>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<ServiceBooking> ServiceBookings => Set<ServiceBooking>();

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

        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Slug)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .Property(p => p.Name)
            .HasMaxLength(140);

        modelBuilder.Entity<Product>()
            .Property(p => p.Slug)
            .HasMaxLength(140);

        modelBuilder.Entity<Product>()
            .Property(p => p.ImageUrl)
            .HasMaxLength(300);

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Slug)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasColumnType("numeric(12,2)");

        modelBuilder.Entity<Product>()
            .Property(p => p.CompareAtPrice)
            .HasColumnType("numeric(12,2)");

        modelBuilder.Entity<Product>()
            .Property(p => p.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        modelBuilder.Entity<Product>()
            .Property(p => p.Sku)
            .HasMaxLength(40);

        modelBuilder.Entity<Product>()
            .Property(p => p.ShortDescription)
            .HasMaxLength(500);

        modelBuilder.Entity<Product>()
            .Property(p => p.Description)
            .HasMaxLength(6000);

        modelBuilder.Entity<Product>()
            .Property(p => p.Brand)
            .HasMaxLength(80);

        modelBuilder.Entity<Product>()
            .Property(p => p.ModelCode)
            .HasMaxLength(80);

        modelBuilder.Entity<Product>()
            .Property(p => p.ThumbnailUrl)
            .HasMaxLength(350);

        modelBuilder.Entity<Product>()
            .Property(p => p.ImageUrl)
            .HasMaxLength(350);

        modelBuilder.Entity<Product>()
            .Property(p => p.WeightKg)
            .HasColumnType("numeric(8,2)");

        modelBuilder.Entity<Product>()
            .Property(p => p.BatteryAh)
            .HasColumnType("numeric(8,2)");

        modelBuilder.Entity<Product>()
            .Property(p => p.RangeKm)
            .HasColumnType("numeric(8,2)");

        modelBuilder.Entity<Product>()
            .Property(p => p.TopSpeedKmh)
            .HasColumnType("numeric(8,2)");

        modelBuilder.Entity<Product>()
            .Property(p => p.MotorPowerW)
            .HasColumnType("numeric(10,2)");

        modelBuilder.Entity<Product>()
            .Property(p => p.WarrantyMonths)
            .HasDefaultValue(12);

        modelBuilder.Entity<Product>()
            .HasMany(p => p.Characteristics)
            .WithOne(c => c.Product)
            .HasForeignKey(c => c.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProductCharacteristic>()
            .Property(c => c.Label)
            .HasMaxLength(120);

        modelBuilder.Entity<ProductCharacteristic>()
            .Property(c => c.Value)
            .HasMaxLength(500);

        modelBuilder.Entity<ProductCharacteristic>()
            .Property(c => c.GroupName)
            .HasMaxLength(100);

        modelBuilder.Entity<ProductCharacteristic>()
            .HasIndex(c => new { c.ProductId, c.SortOrder });

        modelBuilder.Entity<ServiceOffering>()
            .Property(s => s.Name)
            .HasMaxLength(120);

        modelBuilder.Entity<ServiceOffering>()
            .Property(s => s.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        modelBuilder.Entity<ServiceOffering>()
            .Property(s => s.Description)
            .HasMaxLength(3000);

        modelBuilder.Entity<ServiceOffering>()
            .Property(s => s.PriceFrom)
            .HasColumnType("numeric(12,2)");

        modelBuilder.Entity<ServiceOffering>()
            .Property(s => s.Duration)
            .HasMaxLength(80);

        modelBuilder.Entity<ServiceOffering>()
            .Property(s => s.ImageUrl)
            .HasMaxLength(350);

        modelBuilder.Entity<Order>()
            .Property(o => o.Status)
            .HasConversion<string>()
            .HasMaxLength(30);

        modelBuilder.Entity<Order>()
            .Property(o => o.CustomerFullName)
            .HasMaxLength(120);

        modelBuilder.Entity<Order>()
            .Property(o => o.CustomerEmail)
            .HasMaxLength(180);

        modelBuilder.Entity<Order>()
            .Property(o => o.CustomerPhone)
            .HasMaxLength(60);

        modelBuilder.Entity<Order>()
            .Property(o => o.DeliveryAddress)
            .HasMaxLength(500);

        modelBuilder.Entity<Order>()
            .Property(o => o.Notes)
            .HasMaxLength(3000);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasColumnType("numeric(12,2)");

        modelBuilder.Entity<Order>()
            .Property(o => o.Currency)
            .HasMaxLength(10);

        modelBuilder.Entity<Order>()
            .HasMany(o => o.Items)
            .WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .Property(i => i.UnitPrice)
            .HasColumnType("numeric(12,2)");

        modelBuilder.Entity<OrderItem>()
            .Property(i => i.LineTotal)
            .HasColumnType("numeric(12,2)");

        modelBuilder.Entity<OrderItem>()
            .Property(i => i.ProductNameSnapshot)
            .HasMaxLength(180);

        modelBuilder.Entity<OrderItem>()
            .Property(i => i.ProductSkuSnapshot)
            .HasMaxLength(40);

        modelBuilder.Entity<ServiceBooking>()
            .Property(b => b.Status)
            .HasConversion<string>()
            .HasMaxLength(30);

        modelBuilder.Entity<ServiceBooking>()
            .Property(b => b.CustomerFullName)
            .HasMaxLength(120);

        modelBuilder.Entity<ServiceBooking>()
            .Property(b => b.CustomerEmail)
            .HasMaxLength(180);

        modelBuilder.Entity<ServiceBooking>()
            .Property(b => b.CustomerPhone)
            .HasMaxLength(60);

        modelBuilder.Entity<ServiceBooking>()
            .Property(b => b.ScooterBrand)
            .HasMaxLength(80);

        modelBuilder.Entity<ServiceBooking>()
            .Property(b => b.ScooterModel)
            .HasMaxLength(120);

        modelBuilder.Entity<ServiceBooking>()
            .Property(b => b.IssueDescription)
            .HasMaxLength(4000);

        modelBuilder.Entity<ServiceBooking>()
            .Property(b => b.PreferredDateNote)
            .HasMaxLength(200);

        modelBuilder.Entity<ServiceBooking>()
            .Property(b => b.AdminNotes)
            .HasMaxLength(3000);

        modelBuilder.Entity<ServiceBooking>()
            .HasOne(b => b.ServiceOffering)
            .WithMany()
            .HasForeignKey(b => b.ServiceOfferingId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
