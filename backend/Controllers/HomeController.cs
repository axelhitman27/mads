using backend.Contracts;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<HomeDataResponse>> Get(CancellationToken cancellationToken)
    {
        var categories = await dbContext.Categories
            .AsNoTracking()
            .OrderBy(c => c.Id)
            .Select(c => new CategoryDto(c.Id, c.Name, c.Slug, c.Description, c.ImageUrl))
            .ToListAsync(cancellationToken);

        var featuredProducts = await dbContext.Products
            .AsNoTracking()
            .Where(p => p.IsFeatured)
            .OrderBy(p => p.Name)
            .Take(6)
            .Select(p => new ProductDto(
                p.Id,
                p.Name,
                p.Slug,
                p.ShortDescription,
                p.Price,
                "EUR",
                p.ImageUrl,
                p.IsActive,
                p.Category != null ? p.Category.Name : string.Empty))
            .ToListAsync(cancellationToken);

        var allProducts = await dbContext.Products
            .AsNoTracking()
            .Where(p => p.IsActive)
            .OrderByDescending(p => p.IsFeatured)
            .ThenBy(p => p.Name)
            .Select(p => new ProductOverviewDto(
                p.Id,
                p.Name,
                p.Slug,
                p.ShortDescription,
                p.Price,
                p.ImageUrl,
                p.IsFeatured,
                p.CategoryId))
            .ToListAsync(cancellationToken);

        var services = await dbContext.ServiceOfferings
            .AsNoTracking()
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new ServiceDto(
                s.Id,
                s.Name,
                s.Description,
                s.PriceFrom,
                "EUR",
                s.Duration))
            .ToListAsync(cancellationToken);

        var response = new HomeDataResponse(
            "MADS",
            "Premium e-mobility in Thessaloniki",
            "Το νέο e-mobility store για πατίνια και service",
            "Ανανεωμένο design, αξιόπιστα προϊόντα και τεχνική υποστήριξη από εξειδικευμένη ομάδα.",
            categories,
            featuredProducts,
            allProducts,
            services
        );

        return Ok(response);
    }
}
