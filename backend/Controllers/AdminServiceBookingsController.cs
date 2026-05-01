using backend.Contracts.Admin;
using backend.Contracts.Common;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/admin/service-bookings")]
public class AdminServiceBookingsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminServiceBookingResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var bookings = await dbContext.ServiceBookings
            .AsNoTracking()
            .OrderByDescending(item => item.CreatedAtUtc)
            .Select(item => new AdminServiceBookingResponse(
                item.Id,
                item.CustomerFullName,
                item.CustomerEmail,
                item.CustomerPhone,
                item.ServiceOffering != null ? item.ServiceOffering.Name : "General Service",
                item.ScooterBrand,
                item.ScooterModel,
                item.IssueDescription,
                item.PreferredDateNote,
                item.Status.ToString(),
                item.CreatedAtUtc,
                item.AdminNotes))
            .ToListAsync(cancellationToken);

        return Ok(bookings);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<ApiMessageResponse>> UpdateStatus(
        [FromRoute] int id,
        [FromBody] UpdateServiceBookingStatusRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (!Enum.TryParse<ServiceBookingStatus>(request.Status, true, out var status))
        {
            return BadRequest(new ApiMessageResponse("Invalid service booking status."));
        }

        var booking = await dbContext.ServiceBookings.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (booking is null)
        {
            return NotFound(new ApiMessageResponse("Service booking not found."));
        }

        booking.Status = status;
        booking.AdminNotes = request.AdminNotes?.Trim();

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new ApiMessageResponse("Service booking status updated."));
    }
}
