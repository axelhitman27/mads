using System.ComponentModel.DataAnnotations;

namespace backend.Contracts.Shop;

public class CreateOrderRequest
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(40)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(250)]
    public string DeliveryAddress { get; set; } = string.Empty;

    [MaxLength(1200)]
    public string? Notes { get; set; }

    [Required]
    [MinLength(1)]
    public List<CreateOrderItemRequest> Items { get; set; } = [];
}

public class CreateOrderItemRequest
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, 50)]
    public int Quantity { get; set; }
}
