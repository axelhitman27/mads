using backend.Contracts.Common;
using backend.Contracts.Shop;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/shop/checkout")]
public class ShopCheckoutController(AppDbContext dbContext) : ControllerBase
{
    [HttpPost("orders")]
    public async Task<ActionResult<ApiMessageResponse>> CreateOrder(
        [FromBody] CreateOrderRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var requestedProductIds = request.Items
            .Select(item => item.ProductId)
            .Distinct()
            .ToList();

        var products = await dbContext.Products
            .AsNoTracking()
            .Where(product => requestedProductIds.Contains(product.Id))
            .ToDictionaryAsync(product => product.Id, cancellationToken);

        if (products.Count != requestedProductIds.Count)
        {
            return BadRequest(new ApiMessageResponse("One or more selected products do not exist."));
        }

        foreach (var item in request.Items)
        {
            var product = products[item.ProductId];
            if (!product.IsPublished || product.Status == ProductStatus.Archived)
            {
                return BadRequest(new ApiMessageResponse($"Product '{product.Name}' is not available."));
            }

            if (product.Status == ProductStatus.OutOfStock || product.StockQuantity <= 0)
            {
                return BadRequest(new ApiMessageResponse($"Product '{product.Name}' is out of stock."));
            }

            if (item.Quantity > product.StockQuantity)
            {
                return BadRequest(new ApiMessageResponse($"Product '{product.Name}' has only {product.StockQuantity} items left."));
            }
        }

        var orderItems = request.Items.Select(item =>
        {
            var product = products[item.ProductId];
            return new OrderItem
            {
                ProductId = product.Id,
                ProductNameSnapshot = product.Name,
                ProductSkuSnapshot = product.Sku,
                Quantity = item.Quantity,
                UnitPrice = product.Price,
                LineTotal = product.Price * item.Quantity
            };
        }).ToList();

        var totalAmount = orderItems.Sum(item => item.LineTotal);
        var order = new Order
        {
            CustomerFullName = request.FullName.Trim(),
            CustomerEmail = request.Email.Trim(),
            CustomerPhone = request.Phone.Trim(),
            DeliveryAddress = request.DeliveryAddress.Trim(),
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            Currency = "EUR",
            Status = OrderStatus.Pending,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow,
            TotalAmount = totalAmount,
            Items = orderItems
        };

        dbContext.Orders.Add(order);

        var mutableProducts = await dbContext.Products
            .Where(product => requestedProductIds.Contains(product.Id))
            .ToDictionaryAsync(product => product.Id, cancellationToken);

        foreach (var item in request.Items)
        {
            var mutableProduct = mutableProducts[item.ProductId];
            mutableProduct.StockQuantity = Math.Max(0, mutableProduct.StockQuantity - item.Quantity);
            mutableProduct.UpdatedAtUtc = DateTime.UtcNow;

            if (mutableProduct.StockQuantity == 0)
            {
                mutableProduct.Status = ProductStatus.OutOfStock;
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(CreateOrder), new { id = order.Id }, new ApiMessageResponse("Order request submitted successfully."));
    }
}
