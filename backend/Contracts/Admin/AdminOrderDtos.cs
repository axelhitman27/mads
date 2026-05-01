namespace backend.Contracts.Admin;

public record AdminOrderSummaryDto(
    int Id,
    string CustomerName,
    string Email,
    string? Phone,
    decimal TotalAmount,
    string Currency,
    string Status,
    DateTime CreatedAtUtc,
    int ItemCount);

public record AdminOrderDetailDto(
    int Id,
    string CustomerName,
    string Email,
    string? Phone,
    string DeliveryAddress,
    string? Notes,
    decimal TotalAmount,
    string Currency,
    string Status,
    DateTime CreatedAtUtc,
    IReadOnlyList<AdminOrderItemDto> Items);

public record AdminOrderItemDto(
    int ProductId,
    string ProductName,
    string? Sku,
    decimal UnitPrice,
    int Quantity,
    decimal LineTotal);
