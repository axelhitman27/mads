using System.ComponentModel.DataAnnotations;

namespace backend.Contracts.Admin;

public record AdminServiceBookingResponse(
    int Id,
    string CustomerFullName,
    string Email,
    string CustomerPhone,
    string ServiceName,
    string ScooterBrand,
    string ScooterModel,
    string IssueDescription,
    string PreferredDateNote,
    string Status,
    DateTime CreatedAtUtc,
    string? AdminNotes);

public class UpdateServiceBookingStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;

    [MaxLength(3000)]
    public string? AdminNotes { get; set; }
}
