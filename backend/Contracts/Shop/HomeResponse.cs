namespace backend.Contracts.Shop;

public record HomeResponse(
    string Brand,
    string Tagline,
    string HeroTitle,
    string HeroSubtitle,
    IReadOnlyList<CategorySummaryDto> Categories,
    IReadOnlyList<ProductCardDto> FeaturedProducts,
    IReadOnlyList<ProductCardDto> Products,
    IReadOnlyList<ServiceSummaryDto> Services);

public record CategorySummaryDto(
    int Id,
    string Name,
    string Slug,
    string Description,
    string ImageUrl);

public record ProductCardDto(
    int Id,
    string Name,
    string Slug,
    string ShortDescription,
    decimal Price,
    string Currency,
    string ImageUrl,
    int StockQuantity,
    string Status,
    bool IsFeatured,
    int CategoryId,
    string CategoryName);

public record ServiceSummaryDto(
    int Id,
    string Name,
    string Description,
    decimal BasePrice,
    string Currency,
    string EstimatedDuration,
    string Status);
