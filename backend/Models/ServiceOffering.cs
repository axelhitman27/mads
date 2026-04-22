namespace backend.Models;

public class ServiceOffering
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PriceFrom { get; set; }
    public string Duration { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
