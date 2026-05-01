using backend.Contracts.Shop;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/shop/products")]
public class ShopProductsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductListResponse>>> GetProducts(
        [FromQuery] int? categoryId,
        [FromQuery] string? categorySlug,
        [FromQuery] string? query,
        CancellationToken cancellationToken)
    {
        var productsQuery = dbContext.Products
            .AsNoTracking()
            .Include(product => product.Category)
            .Include(product => product.Characteristics)
            .Where(product => product.IsPublished && product.Status != ProductStatus.Archived);

        if (categoryId.HasValue)
        {
            productsQuery = productsQuery.Where(product => product.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(categorySlug))
        {
            var normalizedSlug = categorySlug.Trim().ToLowerInvariant();
            productsQuery = productsQuery.Where(product => product.Category != null && product.Category.Slug == normalizedSlug);
        }

        if (!string.IsNullOrWhiteSpace(query))
        {
            var normalizedQuery = query.Trim().ToLowerInvariant();
            productsQuery = productsQuery.Where(product =>
                product.Name.ToLower().Contains(normalizedQuery) ||
                product.ShortDescription.ToLower().Contains(normalizedQuery) ||
                product.Description.ToLower().Contains(normalizedQuery));
        }

        var products = await productsQuery
            .OrderBy(product => product.DisplayOrder)
            .ThenByDescending(product => product.IsFeatured)
            .ThenBy(product => product.Name)
            .Select(product => new ProductListResponse(
                product.Id,
                product.Name,
                product.Slug,
                product.ShortDescription,
                product.Description,
                product.Price,
                product.CompareAtPrice,
                product.Currency,
                product.ImageUrl,
                product.ThumbnailUrl,
                product.Sku,
                product.Brand,
                product.ModelCode,
                product.WeightKg,
                product.BatteryAh,
                product.RangeKm,
                product.TopSpeedKmh,
                product.MotorPowerW,
                product.WarrantyMonths,
                new ProductStatusResponse(
                    product.Status.ToString(),
                    product.Status == ProductStatus.OutOfStock ? "Out of stock" :
                    product.Status == ProductStatus.Draft ? "Draft" :
                    product.Status == ProductStatus.Archived ? "Archived" : "Available"),
                product.IsFeatured,
                product.IsPublished,
                product.StockQuantity,
                product.StockQuantity > 0 && product.Status == ProductStatus.Active,
                product.Category != null ? product.Category.Name : string.Empty,
                product.CategoryId,
                product.Characteristics
                    .OrderBy(characteristic => characteristic.SortOrder)
                    .Select(characteristic => new ProductCharacteristicResponse(
                        characteristic.Label,
                        characteristic.Value,
                        characteristic.GroupName,
                        characteristic.SortOrder))
                    .ToList()))
            .ToListAsync(cancellationToken);

        return Ok(products);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductListResponse>> GetProductBySlug(
        [FromRoute] string slug,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            return BadRequest("Product slug is required.");
        }

        var normalizedSlug = slug.Trim().ToLowerInvariant();

        var product = await dbContext.Products
            .AsNoTracking()
            .Include(item => item.Category)
            .Include(item => item.Characteristics.OrderBy(characteristic => characteristic.SortOrder))
            .Where(item => item.IsPublished && item.Status != ProductStatus.Archived && item.Slug == normalizedSlug)
            .Select(item => new ProductListResponse(
                item.Id,
                item.Name,
                item.Slug,
                item.ShortDescription,
                item.Description,
                item.Price,
                item.CompareAtPrice,
                item.Currency,
                item.ImageUrl,
                item.ThumbnailUrl,
                item.Sku,
                item.Brand,
                item.ModelCode,
                item.WeightKg,
                item.BatteryAh,
                item.RangeKm,
                item.TopSpeedKmh,
                item.MotorPowerW,
                item.WarrantyMonths,
                new ProductStatusResponse(
                    item.Status.ToString(),
                    item.Status == ProductStatus.OutOfStock ? "Out of stock" :
                    item.Status == ProductStatus.Draft ? "Draft" :
                    item.Status == ProductStatus.Archived ? "Archived" : "Available"),
                item.IsFeatured,
                item.IsPublished,
                item.StockQuantity,
                item.StockQuantity > 0 && item.Status == ProductStatus.Active,
                item.Category != null ? item.Category.Name : string.Empty,
                item.CategoryId,
                item.Characteristics
                    .OrderBy(characteristic => characteristic.SortOrder)
                    .Select(characteristic => new ProductCharacteristicResponse(
                        characteristic.Label,
                        characteristic.Value,
                        characteristic.GroupName,
                        characteristic.SortOrder))
                    .ToList()))
            .FirstOrDefaultAsync(cancellationToken);

        if (product is null)
        {
            return NotFound("Product not found.");
        }

        return Ok(product);
    }
}
