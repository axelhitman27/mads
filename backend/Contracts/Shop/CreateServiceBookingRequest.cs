using System.ComponentModel.DataAnnotations;

namespace backend.Contracts.Shop;

public class CreateServiceBookingRequest
{
    [Required]
    [MaxLength(120)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(180)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(60)]
    public string Phone { get; set; } = string.Empty;

    public int? ServiceOfferingId { get; set; }

    [Required]
    [MaxLength(80)]
    public string ScooterBrand { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string ScooterModel { get; set; } = string.Empty;

    [Required]
    [MaxLength(4000)]
    public string IssueDescription { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? PreferredDateNote { get; set; }
}
