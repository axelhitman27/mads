using backend.Contracts.Admin;
using backend.Contracts.Common;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/admin/products")]
public class AdminProductsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminProductListItemResponse>>> GetProducts(CancellationToken cancellationToken)
    {
        var products = await dbContext.Products
            .AsNoTracking()
            .Include(product => product.Category)
            .OrderByDescending(product => product.UpdatedAtUtc)
            .Select(product => new AdminProductListItemResponse(
                product.Id,
                product.Name,
                product.Slug,
                product.ShortDescription,
                product.Price,
                product.Currency,
                product.StockQuantity,
                product.Status.ToString(),
                product.IsPublished,
                product.IsFeatured,
                product.Category != null ? product.Category.Name : "-"))
            .ToListAsync(cancellationToken);

        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AdminProductDetailResponse>> GetProductById([FromRoute] int id, CancellationToken cancellationToken)
    {
        var product = await dbContext.Products
            .AsNoTracking()
            .Include(item => item.Characteristics.OrderBy(characteristic => characteristic.SortOrder))
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (product is null)
        {
            return NotFound(new ApiMessageResponse("Product not found."));
        }

        var response = new AdminProductDetailResponse(
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
            product.StockQuantity,
            product.Status.ToString(),
            product.IsPublished,
            product.IsFeatured,
            product.DisplayOrder,
            product.CategoryId,
            product.Characteristics
                .OrderBy(characteristic => characteristic.SortOrder)
                .Select(characteristic => new ProductCharacteristicResponse(
                    characteristic.Id,
                    characteristic.Label,
                    characteristic.Value,
                    characteristic.GroupName,
                    characteristic.SortOrder))
                .ToList());

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<AdminProductDetailResponse>> CreateProduct([FromBody] UpsertProductRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var normalizedSlug = request.Slug.Trim().ToLowerInvariant();

        var slugInUse = await dbContext.Products
            .AsNoTracking()
            .AnyAsync(product => product.Slug == normalizedSlug, cancellationToken);

        if (slugInUse)
        {
            return Conflict(new ApiMessageResponse("Product slug already exists."));
        }

        var categoryExists = await dbContext.Categories
            .AsNoTracking()
            .AnyAsync(category => category.Id == request.CategoryId, cancellationToken);

        if (!categoryExists)
        {
            return BadRequest(new ApiMessageResponse("Invalid category."));
        }

        if (!TryParseProductStatus(request.Status, out var parsedStatus))
        {
            return BadRequest(new ApiMessageResponse("Invalid product status."));
        }

        var now = DateTime.UtcNow;
        var product = new Product
        {
            Name = request.Name.Trim(),
            Slug = normalizedSlug,
            ShortDescription = request.ShortDescription.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            CompareAtPrice = request.CompareAtPrice,
            Currency = request.Currency.Trim().ToUpperInvariant(),
            ImageUrl = request.ImageUrl.Trim(),
            ThumbnailUrl = request.ThumbnailUrl?.Trim() ?? string.Empty,
            Sku = request.Sku?.Trim().ToUpperInvariant() ?? string.Empty,
            Brand = string.IsNullOrWhiteSpace(request.Brand) ? "MADS" : request.Brand.Trim(),
            ModelCode = request.ModelCode?.Trim() ?? string.Empty,
            WeightKg = request.WeightKg,
            BatteryAh = request.BatteryAh,
            RangeKm = request.RangeKm,
            TopSpeedKmh = request.TopSpeedKmh,
            MotorPowerW = request.MotorPowerW,
            WarrantyMonths = request.WarrantyMonths,
            StockQuantity = request.StockQuantity,
            Status = parsedStatus,
            IsPublished = request.IsPublished,
            IsFeatured = request.IsFeatured,
            DisplayOrder = request.DisplayOrder,
            CategoryId = request.CategoryId,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        product.Characteristics = request.Characteristics
            .Select((characteristic, index) => new ProductCharacteristic
            {
                Label = characteristic.Label.Trim(),
                Value = characteristic.Value.Trim(),
                GroupName = characteristic.GroupName?.Trim(),
                SortOrder = characteristic.SortOrder == 0 ? index + 1 : characteristic.SortOrder
            })
            .ToList();

        dbContext.Products.Add(product);
        await dbContext.SaveChangesAsync(cancellationToken);

        return await GetProductById(product.Id, cancellationToken);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AdminProductDetailResponse>> UpdateProduct([FromRoute] int id, [FromBody] UpsertProductRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var product = await dbContext.Products
            .Include(item => item.Characteristics)
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (product is null)
        {
            return NotFound(new ApiMessageResponse("Product not found."));
        }

        var normalizedSlug = request.Slug.Trim().ToLowerInvariant();

        var slugInUse = await dbContext.Products
            .AsNoTracking()
            .AnyAsync(item => item.Id != id && item.Slug == normalizedSlug, cancellationToken);

        if (slugInUse)
        {
            return Conflict(new ApiMessageResponse("Product slug already exists."));
        }

        var categoryExists = await dbContext.Categories
            .AsNoTracking()
            .AnyAsync(category => category.Id == request.CategoryId, cancellationToken);

        if (!categoryExists)
        {
            return BadRequest(new ApiMessageResponse("Invalid category."));
        }

        if (!TryParseProductStatus(request.Status, out var parsedStatus))
        {
            return BadRequest(new ApiMessageResponse("Invalid product status."));
        }

        product.Name = request.Name.Trim();
        product.Slug = normalizedSlug;
        product.ShortDescription = request.ShortDescription.Trim();
        product.Description = request.Description.Trim();
        product.Price = request.Price;
        product.CompareAtPrice = request.CompareAtPrice;
        product.Currency = request.Currency.Trim().ToUpperInvariant();
        product.ImageUrl = request.ImageUrl.Trim();
        product.ThumbnailUrl = request.ThumbnailUrl?.Trim() ?? string.Empty;
        product.Sku = request.Sku?.Trim().ToUpperInvariant() ?? string.Empty;
        product.Brand = string.IsNullOrWhiteSpace(request.Brand) ? "MADS" : request.Brand.Trim();
        product.ModelCode = request.ModelCode?.Trim() ?? string.Empty;
        product.WeightKg = request.WeightKg;
        product.BatteryAh = request.BatteryAh;
        product.RangeKm = request.RangeKm;
        product.TopSpeedKmh = request.TopSpeedKmh;
        product.MotorPowerW = request.MotorPowerW;
        product.WarrantyMonths = request.WarrantyMonths;
        product.StockQuantity = request.StockQuantity;
        product.Status = parsedStatus;
        product.IsPublished = request.IsPublished;
        product.IsFeatured = request.IsFeatured;
        product.DisplayOrder = request.DisplayOrder;
        product.CategoryId = request.CategoryId;
        product.UpdatedAtUtc = DateTime.UtcNow;

        dbContext.ProductCharacteristics.RemoveRange(product.Characteristics);
        product.Characteristics = request.Characteristics
            .Select((characteristic, index) => new ProductCharacteristic
            {
                Label = characteristic.Label.Trim(),
                Value = characteristic.Value.Trim(),
                GroupName = characteristic.GroupName?.Trim(),
                SortOrder = characteristic.SortOrder == 0 ? index + 1 : characteristic.SortOrder
            })
            .ToList();

        await dbContext.SaveChangesAsync(cancellationToken);

        return await GetProductById(id, cancellationToken);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateProductStatus([FromRoute] int id, [FromBody] AdminStatusUpdateRequest request, CancellationToken cancellationToken)
    {
        var product = await dbContext.Products.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (product is null)
        {
            return NotFound(new ApiMessageResponse("Product not found."));
        }

        if (!TryParseProductStatus(request.Status, out var parsedStatus))
        {
            return BadRequest(new ApiMessageResponse("Invalid product status."));
        }

        product.Status = parsedStatus;
        product.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new ApiMessageResponse("Product status updated."));
    }

    [HttpPatch("{id:int}/publish")]
    public async Task<IActionResult> TogglePublish([FromRoute] int id, [FromBody] AdminStatusUpdateRequest request, CancellationToken cancellationToken)
    {
        var product = await dbContext.Products.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (product is null)
        {
            return NotFound(new ApiMessageResponse("Product not found."));
        }

        if (!bool.TryParse(request.Status, out var isPublished))
        {
            return BadRequest(new ApiMessageResponse("Publish payload must be true or false."));
        }

        product.IsPublished = isPublished;
        product.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new ApiMessageResponse("Product publish status updated."));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct([FromRoute] int id, CancellationToken cancellationToken)
    {
        var product = await dbContext.Products
            .Include(item => item.Characteristics)
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (product is null)
        {
            return NotFound(new ApiMessageResponse("Product not found."));
        }

        dbContext.Products.Remove(product);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static bool TryParseProductStatus(string value, out ProductStatus status)
        => Enum.TryParse(value, true, out status);
}
