namespace backend.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public string Currency { get; set; } = "EUR";
    public string ImageUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string Brand { get; set; } = "MADS";
    public string ModelCode { get; set; } = string.Empty;
    public decimal? WeightKg { get; set; }
    public decimal? BatteryAh { get; set; }
    public decimal? RangeKm { get; set; }
    public decimal? TopSpeedKmh { get; set; }
    public decimal? MotorPowerW { get; set; }
    public int WarrantyMonths { get; set; } = 12;
    public int DisplayOrder { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public int StockQuantity { get; set; }
    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.Active;

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public ICollection<ProductCharacteristic> Characteristics { get; set; } = new List<ProductCharacteristic>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
