using backend.Contracts.Common;
using backend.Contracts.Shop;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/shop/bookings")]
public class ShopBookingsController(AppDbContext dbContext) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ApiMessageResponse>> CreateBooking(
        [FromBody] CreateServiceBookingRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (!request.ServiceOfferingId.HasValue)
        {
            return BadRequest(new ApiMessageResponse("Service selection is required."));
        }

        var service = await dbContext.ServiceOfferings
            .AsNoTracking()
            .Where(s => s.Id == request.ServiceOfferingId.Value)
            .Select(s => new { s.Id, s.Status, s.Name })
            .FirstOrDefaultAsync(cancellationToken);

        if (service is null || service.Status != ServiceStatus.Published)
        {
            return NotFound(new ApiMessageResponse("Selected service is not available."));
        }

        var booking = new ServiceBooking
        {
            CustomerFullName = request.FullName.Trim(),
            CustomerEmail = request.Email.Trim(),
            CustomerPhone = request.Phone.Trim(),
            ServiceOfferingId = service.Id,
            ScooterBrand = request.ScooterBrand.Trim(),
            ScooterModel = request.ScooterModel.Trim(),
            IssueDescription = request.IssueDescription.Trim(),
            PreferredDateNote = string.IsNullOrWhiteSpace(request.PreferredDateNote)
                ? "Not specified"
                : request.PreferredDateNote.Trim()
        };

        await dbContext.ServiceBookings.AddAsync(booking, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id },
            new ApiMessageResponse("Service booking created successfully."));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ServiceBookingResponse>> GetBookingById(
        [FromRoute] int id,
        CancellationToken cancellationToken)
    {
        var booking = await dbContext.ServiceBookings
            .AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => new ServiceBookingResponse(
                b.Id,
                b.CustomerFullName,
                b.CustomerEmail,
                b.CustomerPhone,
                b.ServiceOffering != null ? b.ServiceOffering.Name : "General Service",
                b.ScooterBrand,
                b.ScooterModel,
                b.IssueDescription,
                b.PreferredDateNote,
                b.Status.ToString(),
                b.CreatedAtUtc,
                b.AdminNotes))
            .FirstOrDefaultAsync(cancellationToken);

        return booking is null ? NotFound() : Ok(booking);
    }
}
