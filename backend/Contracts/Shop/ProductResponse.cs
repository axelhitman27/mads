namespace backend.Contracts.Shop;

public record ProductListResponse(
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
    string? Brand,
    string? ModelCode,
    decimal? WeightKg,
    decimal? BatteryAh,
    decimal? RangeKm,
    decimal? TopSpeedKmh,
    decimal? MotorPowerW,
    int WarrantyMonths,
    ProductStatusResponse Status,
    bool IsFeatured,
    bool IsPublished,
    int StockQuantity,
    bool IsInStock,
    string Category,
    int CategoryId,
    IReadOnlyList<ProductCharacteristicResponse> Characteristics);

public record ProductStatusResponse(
    string Value,
    string Label);

public record ProductCharacteristicResponse(
    string Label,
    string Value,
    string? GroupName,
    int SortOrder);
