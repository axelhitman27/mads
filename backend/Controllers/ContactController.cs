using backend.Contracts;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController(AppDbContext dbContext) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var message = new ContactMessage
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            Phone = request.Phone?.Trim(),
            Message = request.Message.Trim(),
            CreatedAtUtc = DateTime.UtcNow
        };

        await dbContext.ContactMessages.AddAsync(message, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetMessageById), new { id = message.Id }, new
        {
            message = "Thank you. We will contact you shortly."
        });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetMessageById([FromRoute] int id, CancellationToken cancellationToken)
    {
        var message = await dbContext.ContactMessages
            .AsNoTracking()
            .Where(item => item.Id == id)
            .Select(item => new
            {
                item.Id,
                item.FullName,
                item.Email,
                item.Phone,
                item.Message,
                item.CreatedAtUtc
            })
            .FirstOrDefaultAsync(cancellationToken);

        return message is null ? NotFound() : Ok(message);
    }
}
