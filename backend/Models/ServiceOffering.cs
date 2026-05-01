namespace backend.Models;

public class ServiceOffering
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PriceFrom { get; set; }
    public string Duration { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public ServiceStatus Status { get; set; } = ServiceStatus.Published;
    public string? ImageUrl { get; set; }
}
