# Backend - .NET 8 Web API

## Proje Yapısı

```
backend/
├── Controllers/      # API endpoints
├── Models/          # Domain models (Entities)
├── Data/            # DbContext ve migrations
├── DTOs/            # Data Transfer Objects
├── Services/        # Business logic
├── Validators/      # FluentValidation validators
├── Program.cs       # Application entry point
└── appsettings.json # Configuration
```

## Kullanılan Teknolojiler

- **.NET 8 Web API**
- **Entity Framework Core** - Code First yaklaşımı ile MySQL
- **Pomelo.EntityFrameworkCore.MySql** - MySQL provider
- **JWT Authentication** - Güvenli kimlik doğrulama
- **AutoMapper** - DTO mapping
- **FluentValidation** - Model validation
- **Serilog** - Structured logging

## Kurulum

```bash
# Bağımlılıkları yükle
dotnet restore

# Projeyi derle
dotnet build

# Çalıştır
dotnet run
```

## Veritabanı Migration

```bash
# Migration oluştur
dotnet ef migrations add InitialCreate

# Veritabanını güncelle
dotnet ef database update
```

## Yapılandırma

`appsettings.json` dosyasında aşağıdaki ayarları yapılandırın:

- **ConnectionStrings**: MySQL bağlantı dizesi
- **Jwt**: JWT ayarları (Issuer, Audience, Key, ExpiryMinutes)

## API Endpoints

- `GET /api/health` - Health check endpoint
- Swagger UI: `https://localhost:7xxx/swagger`
