using backend.Contracts.Admin;
using backend.Contracts.Common;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/admin/orders")]
public class AdminOrdersController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminOrderSummaryDto>>> GetOrders(CancellationToken cancellationToken)
    {
        var orders = await dbContext.Orders
            .AsNoTracking()
            .OrderByDescending(order => order.CreatedAtUtc)
            .Select(order => new AdminOrderSummaryDto(
                order.Id,
                order.CustomerFullName,
                order.CustomerEmail,
                order.CustomerPhone,
                order.TotalAmount,
                order.Currency,
                order.Status.ToString(),
                order.CreatedAtUtc,
                order.Items.Count))
            .ToListAsync(cancellationToken);

        return Ok(orders);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AdminOrderDetailDto>> GetOrderById([FromRoute] int id, CancellationToken cancellationToken)
    {
        var order = await dbContext.Orders
            .AsNoTracking()
            .Include(item => item.Items)
            .Where(item => item.Id == id)
            .Select(item => new AdminOrderDetailDto(
                item.Id,
                item.CustomerFullName,
                item.CustomerEmail,
                item.CustomerPhone,
                item.DeliveryAddress,
                item.Notes,
                item.TotalAmount,
                item.Currency,
                item.Status.ToString(),
                item.CreatedAtUtc,
                item.Items
                    .Select(orderItem => new AdminOrderItemDto(
                        orderItem.ProductId,
                        orderItem.ProductNameSnapshot,
                        orderItem.ProductSkuSnapshot,
                        orderItem.UnitPrice,
                        orderItem.Quantity,
                        orderItem.LineTotal))
                    .ToList()))
            .FirstOrDefaultAsync(cancellationToken);

        return order is null ? NotFound(new ApiMessageResponse("Order not found.")) : Ok(order);
    }

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<ApiMessageResponse>> UpdateOrderStatus(
        [FromRoute] int id,
        [FromBody] AdminStatusUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var order = await dbContext.Orders.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (order is null)
        {
            return NotFound(new ApiMessageResponse("Order not found."));
        }

        if (!Enum.TryParse<OrderStatus>(request.Status, true, out var status))
        {
            return BadRequest(new ApiMessageResponse("Invalid order status."));
        }

        order.Status = status;
        order.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new ApiMessageResponse("Order status updated."));
    }
}
