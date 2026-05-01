using backend.Contracts.Shop;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/home")]
public class ShopHomeController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<HomeResponse>> Get(CancellationToken cancellationToken)
    {
        var categories = await dbContext.Categories
            .AsNoTracking()
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Name)
            .Select(c => new CategorySummaryDto(
                c.Id,
                c.Name,
                c.Slug,
                c.Description,
                c.ImageUrl))
            .ToListAsync(cancellationToken);

        var featuredProducts = await dbContext.Products
            .AsNoTracking()
            .Where(p => p.IsPublished && p.Status != ProductStatus.Archived)
            .OrderByDescending(p => p.IsFeatured)
            .ThenBy(p => p.DisplayOrder)
            .ThenBy(p => p.Name)
            .Take(8)
            .Select(p => new ProductCardDto(
                p.Id,
                p.Name,
                p.Slug,
                p.ShortDescription,
                p.Price,
                p.Currency,
                p.ImageUrl,
                p.StockQuantity,
                p.Status.ToString(),
                p.IsFeatured,
                p.CategoryId,
                p.Category != null ? p.Category.Name : string.Empty))
            .ToListAsync(cancellationToken);

        var products = await dbContext.Products
            .AsNoTracking()
            .Where(p => p.IsPublished && p.Status != ProductStatus.Archived)
            .OrderBy(p => p.DisplayOrder)
            .ThenByDescending(p => p.IsFeatured)
            .ThenBy(p => p.Name)
            .Select(p => new ProductCardDto(
                p.Id,
                p.Name,
                p.Slug,
                p.ShortDescription,
                p.Price,
                p.Currency,
                p.ImageUrl,
                p.StockQuantity,
                p.Status.ToString(),
                p.IsFeatured,
                p.CategoryId,
                p.Category != null ? p.Category.Name : string.Empty))
            .ToListAsync(cancellationToken);

        var services = await dbContext.ServiceOfferings
            .AsNoTracking()
            .Where(s => s.Status == ServiceStatus.Published)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new ServiceSummaryDto(
                s.Id,
                s.Name,
                s.Description,
                s.PriceFrom,
                "EUR",
                s.Duration,
                s.Status.ToString()))
            .ToListAsync(cancellationToken);

        var response = new HomeResponse(
            "MADS",
            "Premium e-mobility in Thessaloniki",
            "Το νέο e-shop για e-scooters & service",
            "Αγόρασε νέο πατίνι, βρες ανταλλακτικά και κλείσε service από εξειδικευμένο συνεργείο.",
            categories,
            featuredProducts,
            products,
            services);

        return Ok(response);
    }
}
