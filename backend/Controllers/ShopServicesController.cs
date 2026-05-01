using backend.Contracts.Shop;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/shop/services")]
public class ShopServicesController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceResponse>>> GetServices(CancellationToken cancellationToken)
    {
        var services = await dbContext.ServiceOfferings
            .AsNoTracking()
            .Where(service => service.Status == ServiceStatus.Published)
            .OrderBy(service => service.DisplayOrder)
            .Select(service => new ServiceResponse(
                service.Id,
                service.Name,
                service.Description,
                service.PriceFrom,
                "EUR",
                service.Duration,
                service.Status.ToString()))
            .ToListAsync(cancellationToken);

        return Ok(services);
    }
}
