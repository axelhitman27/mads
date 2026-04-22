# MADS Redesign Prototype

Full-stack prototype for a redesigned e-scooter/e-bike store and service website.

- **Frontend**: React + Vite
- **Backend**: ASP.NET Core 8 Web API
- **Database**: PostgreSQL

The project is inspired by the current public content structure of `mads.gr` and is built so you can quickly demo a modern style to your customer.

## Project structure

```text
.
├── frontend/          # React UI
├── backend/           # ASP.NET Core API
├── docker-compose.yml # Full local stack (frontend + backend + postgres)
└── README.md
```

## What is included

- Modern homepage sections:
  - Hero
  - Category cards
  - Featured products
  - Services
  - Contact lead form
- API endpoints:
  - `GET /api/home`
  - `GET /api/products`
  - `GET /api/services`
  - `POST /api/contact`
- PostgreSQL-backed models with startup seed data

## Quick start with Docker (recommended for demo)

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:8080
- Backend API: http://localhost:5048
- Swagger: http://localhost:5048/swagger
- PostgreSQL: localhost:5432 (`postgres` / `postgres`)

## Local development (without Docker)

### 1) Database

Run PostgreSQL locally and create database `mads_redesign` (or change connection string).

Default backend connection string:

`Host=localhost;Port=5432;Database=mads_redesign;Username=postgres;Password=postgres`

### 2) Backend

> .NET SDK 8 required

```bash
cd backend
dotnet restore
dotnet run
```

API runs on `http://localhost:5048` by default.

### 3) Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Vite UI runs on `http://localhost:5173`.

## Notes

- Database initialization currently uses `EnsureCreated()` + `DataSeeder` for fast prototyping.
- For production, move to EF Core migrations and proper deployment secrets.
# mads
