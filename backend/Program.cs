using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var allowedFrontendOrigin = builder.Configuration["Frontend:Origin"] ?? "http://localhost:5173";
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy.WithOrigins(allowedFrontendOrigin)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var adminApiKey = builder.Configuration["Admin:ApiKey"] ?? "change-me-admin-key";
builder.Services.AddSingleton(new AdminApiOptions(adminApiKey));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await dbContext.Database.EnsureCreatedAsync();
    await DataSeeder.SeedAsync(dbContext);
}

app.UseHttpsRedirection();
app.UseCors("frontend");
app.UseMiddleware<AdminApiKeyMiddleware>();
app.UseAuthorization();
app.MapControllers();

app.Run();

public sealed record AdminApiOptions(string ApiKey);

public sealed class AdminApiKeyMiddleware(RequestDelegate next, AdminApiOptions options)
{
    private const string HeaderName = "X-Admin-Api-Key";

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/admin", StringComparison.OrdinalIgnoreCase))
        {
            var providedKey = context.Request.Headers[HeaderName].FirstOrDefault();
            if (string.IsNullOrWhiteSpace(providedKey) || !string.Equals(providedKey, options.ApiKey, StringComparison.Ordinal))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { message = "Unauthorized admin request." });
                return;
            }
        }

        await next(context);
    }
}
