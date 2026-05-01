namespace backend.Models;

public class ServiceBooking
{
    public int Id { get; set; }
    public string CustomerFullName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public int? ServiceOfferingId { get; set; }
    public ServiceOffering? ServiceOffering { get; set; }
    public string ScooterBrand { get; set; } = string.Empty;
    public string ScooterModel { get; set; } = string.Empty;
    public string IssueDescription { get; set; } = string.Empty;
    public string PreferredDateNote { get; set; } = string.Empty;
    public string? AdminNotes { get; set; }
    public ServiceBookingStatus Status { get; set; } = ServiceBookingStatus.Pending;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
