using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] int? categoryId)
    {
        var query = dbContext.Products
            .AsNoTracking()
            .Where(product => product.IsActive);

        if (categoryId.HasValue)
        {
            query = query.Where(product => product.CategoryId == categoryId.Value);
        }

        var products = await query
            .OrderByDescending(product => product.IsFeatured)
            .ThenBy(product => product.Name)
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("category/{slug}")]
    public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategorySlug([FromRoute] string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            return BadRequest("Category slug is required.");
        }

        var categoryId = await dbContext.Categories
            .AsNoTracking()
            .Where(category => category.Slug == slug.Trim())
            .Select(category => (int?)category.Id)
            .FirstOrDefaultAsync();

        if (!categoryId.HasValue)
        {
            return NotFound($"Category '{slug}' was not found.");
        }

        var products = await dbContext.Products
            .AsNoTracking()
            .Where(product => product.IsActive && product.CategoryId == categoryId.Value)
            .OrderByDescending(product => product.IsFeatured)
            .ThenBy(product => product.Name)
            .ToListAsync();

        return Ok(products);
    }
}
