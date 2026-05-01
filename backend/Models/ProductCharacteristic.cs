namespace backend.Models;

public class ProductCharacteristic
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? GroupName { get; set; }
    public int SortOrder { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }
}
