# Backend - ASP.NET Core Web API

This is the backend API for ProjetPFE.

## Prerequisites

- [.NET 10.0 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) (You already have .NET 10.0.2 installed ✓)
- SQL Server (LocalDB, Express, or Full version)

## Getting Started

### 1. Install .NET SDK

You already have .NET 10.0.2 installed! ✓

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Update Database Connection String

Edit `appsettings.json` and update the connection string to match your SQL Server configuration.

### 4. Run Migrations (when you add them)

```bash
dotnet ef database update
```

### 5. Run the Application

```bash
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7000`
- HTTP: `http://localhost:5000`
- Swagger UI: `https://localhost:7000/swagger`

## Project Structure

```
Backend/
├── Controllers/     # API Controllers
├── Models/         # Data models/entities
├── Services/       # Business logic services
├── Data/           # Database context and migrations
├── Program.cs      # Application entry point
└── appsettings.json # Configuration
```

## Development

### Adding a New Controller

1. Create a new file in `Controllers/` folder
2. Inherit from `ControllerBase`
3. Add `[ApiController]` and `[Route("api/[controller]")]` attributes

### Adding a Database Model

1. Create a new file in `Models/` folder
2. Add the model to `ApplicationDbContext.cs`
3. Create and run a migration:
   ```bash
   dotnet ef migrations add YourMigrationName
   dotnet ef database update
   ```

## API Documentation

Once running, visit `/swagger` to see the interactive API documentation.
