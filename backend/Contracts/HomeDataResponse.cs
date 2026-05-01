namespace backend.Contracts;

public record CategoryDto(int Id, string Name, string Slug, string Description, string ImageUrl);

public record ProductDto(
    int Id,
    string Name,
    string Slug,
    string Description,
    decimal Price,
    string Currency,
    string ImageUrl,
    bool IsAvailable,
    string Category);

public record ServiceDto(
    Guid Id,
    string Name,
    string Description,
    decimal PriceFrom,
    string Currency,
    string Duration);

public record HomeDataResponse(
    string Brand,
    string Tagline,
    string HeroTitle,
    string HeroSubtitle,
    IReadOnlyList<CategoryDto> Categories,
    IReadOnlyList<ProductDto> FeaturedProducts,
    IReadOnlyList<ProductOverviewDto> AllProducts,
    IReadOnlyList<ServiceDto> Services);

public record ProductOverviewDto(
    int Id,
    string Name,
    string Slug,
    string ShortDescription,
    decimal Price,
    string ImageUrl,
    bool IsFeatured,
    int CategoryId);
