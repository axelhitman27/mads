using backend.Data;
using backend.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public ServicesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices(CancellationToken cancellationToken)
    {
        var services = await _dbContext.ServiceOfferings
            .AsNoTracking()
            .OrderBy(service => service.DisplayOrder)
            .Select(service => new ServiceDto(
                service.Id,
                service.Name,
                service.Description,
                service.PriceFrom,
                "EUR",
                service.Duration))
            .ToListAsync(cancellationToken);

        return Ok(services);
    }
}
