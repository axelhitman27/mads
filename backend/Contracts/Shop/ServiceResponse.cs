namespace backend.Contracts.Shop;

public record ServiceResponse(
    int Id,
    string Name,
    string Description,
    decimal PriceFrom,
    string Currency,
    string Duration,
    string Status);

public record ServiceBookingResponse(
    int Id,
    string CustomerFullName,
    string CustomerEmail,
    string CustomerPhone,
    string ServiceName,
    string ScooterBrand,
    string ScooterModel,
    string IssueDescription,
    string PreferredDateNote,
    string Status,
    DateTime CreatedAtUtc,
    string? AdminNotes);
