using System.ComponentModel.DataAnnotations;

namespace backend.Contracts;

public class ContactRequest
{
    [Required]
    [MaxLength(80)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(40)]
    public string? Phone { get; set; }

    [Required]
    [MaxLength(1500)]
    public string Message { get; set; } = string.Empty;
}
