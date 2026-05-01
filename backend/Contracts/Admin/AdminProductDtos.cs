using System.ComponentModel.DataAnnotations;

namespace backend.Contracts.Admin;

public record AdminProductListItemResponse(
    int Id,
    string Name,
    string Slug,
    string ShortDescription,
    decimal Price,
    string Currency,
    int StockQuantity,
    string Status,
    bool IsPublished,
    bool IsFeatured,
    string Category);

public class UpsertProductRequest
{
    [Required]
    [MaxLength(140)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(160)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string ShortDescription { get; set; } = string.Empty;

    [Required]
    [MaxLength(6000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0.0, 9999999.0)]
    public decimal Price { get; set; }

    [Range(0.0, 9999999.0)]
    public decimal? CompareAtPrice { get; set; }

    [MaxLength(8)]
    public string Currency { get; set; } = "EUR";

    [Required]
    [MaxLength(350)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(350)]
    public string? ThumbnailUrl { get; set; }

    [MaxLength(40)]
    public string? Sku { get; set; }

    [MaxLength(80)]
    public string? Brand { get; set; }

    [MaxLength(80)]
    public string? ModelCode { get; set; }

    [Range(0.0, 9999.0)]
    public decimal? WeightKg { get; set; }

    [Range(0.0, 9999.0)]
    public decimal? BatteryAh { get; set; }

    [Range(0.0, 9999.0)]
    public decimal? RangeKm { get; set; }

    [Range(0.0, 9999.0)]
    public decimal? TopSpeedKmh { get; set; }

    [Range(0.0, 99999.0)]
    public decimal? MotorPowerW { get; set; }

    [Range(0, 120)]
    public int WarrantyMonths { get; set; } = 12;

    [Range(0, 999999)]
    public int StockQuantity { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Draft";

    public bool IsPublished { get; set; }
    public bool IsFeatured { get; set; }

    [Range(0, 9999)]
    public int DisplayOrder { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    [MinLength(1)]
    public List<ProductCharacteristicInput> Characteristics { get; set; } = [];
}

public class ProductCharacteristicInput
{
    [Required]
    [MaxLength(120)]
    public string Label { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Value { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? GroupName { get; set; }

    [Range(0, 9999)]
    public int SortOrder { get; set; }
}

public record AdminProductDetailResponse(
    int Id,
    string Name,
    string Slug,
    string ShortDescription,
    string Description,
    decimal Price,
    decimal? CompareAtPrice,
    string Currency,
    string ImageUrl,
    string? ThumbnailUrl,
    string? Sku,
    string Brand,
    string? ModelCode,
    decimal? WeightKg,
    decimal? BatteryAh,
    decimal? RangeKm,
    decimal? TopSpeedKmh,
    decimal? MotorPowerW,
    int WarrantyMonths,
    int StockQuantity,
    string Status,
    bool IsPublished,
    bool IsFeatured,
    int DisplayOrder,
    int CategoryId,
    IReadOnlyList<ProductCharacteristicResponse> Characteristics);

public record ProductCharacteristicResponse(
    int Id,
    string Label,
    string Value,
    string? GroupName,
    int SortOrder);
