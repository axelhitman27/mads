using System.ComponentModel.DataAnnotations;

namespace backend.Contracts.Common;

public class AdminStatusUpdateRequest
{
    [Required]
    [MaxLength(200)]
    public string Status { get; set; } = string.Empty;
}
