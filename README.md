# MADS E-Shop + Service Platform

Full-stack prototype for a modern e-scooter shop and service platform inspired by `mads.gr`.

- **Frontend**: React + Vite
- **Backend**: ASP.NET Core 8 Web API
- **Database**: PostgreSQL

## What is implemented

### Public e-shop experience

- Homepage with:
  - hero and branding
  - category cards
  - featured products
  - full product preview list
  - service highlights
- Product catalog page (search + sorting + category routes)
- Product details page (description + technical characteristics + stock state)
- Cart + checkout request flow
- Service booking flow for scooter repair/maintenance requests
- About page based on current business information

### Admin experience

- Admin dashboard summary
- Admin product management:
  - create product
  - edit product
  - set status (`Draft`, `Active`, `OutOfStock`, `Archived`)
  - enable/disable publish state
  - delete product
  - manage characteristics/specs
- Admin order management:
  - list orders
  - inspect order details
  - update order status
- Admin service booking management:
  - list bookings
  - update booking status
  - save admin notes

## API overview

### Public APIs

- `GET /api/home`
- `GET /api/shop/products`
- `GET /api/shop/products/{slug}`
- `GET /api/shop/services`
- `POST /api/shop/bookings`
- `POST /api/shop/checkout/orders`

### Admin APIs (require header `X-Admin-Api-Key`)

- `GET /api/admin/products`
- `GET /api/admin/products/{id}`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `PATCH /api/admin/products/{id}/status`
- `PATCH /api/admin/products/{id}/publish`
- `DELETE /api/admin/products/{id}`
- `GET /api/admin/orders`
- `GET /api/admin/orders/{id}`
- `PUT /api/admin/orders/{id}/status`
- `GET /api/admin/service-bookings`
- `PATCH /api/admin/service-bookings/{id}/status`

## Local development (without Docker)

### 1) Database

Run PostgreSQL locally and create database `mads_redesign` (or adjust connection string).

Default backend connection string:

`Host=localhost;Port=5432;Database=mads_redesign;Username=postgres;Password=postgres`

### 2) Backend

> .NET SDK 8 required

```bash
cd backend
dotnet restore
dotnet run --launch-profile http
```

Backend runs on `http://localhost:5048`.

### 3) Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment variables

### Backend

- `ConnectionStrings__DefaultConnection` - PostgreSQL connection string
- `Frontend__Origin` - allowed CORS origin for frontend
- `Admin__ApiKey` - API key used for admin endpoints

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL` (example: `http://localhost:5048`)
- `VITE_ADMIN_API_KEY` (must match backend `Admin__ApiKey`)

## Notes

- Database init currently uses `EnsureCreated()` + `DataSeeder` for quick prototyping.
- For production, replace with EF Core migrations and secure secret management.
