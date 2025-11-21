# Backend - Kurumsal Menü Yönetim Sistemi API

.NET 8 Web API ile geliştirilmiş RESTful API servisi. Entity Framework Core Code First yaklaşımı ve JWT Authentication ile güvenli ve ölçeklenebilir backend çözümü.

## API Base URL

- Production: https://api.corporatemenusystem.taskinnovation.net/api (örnek)
- Local Development: http://localhost:5000/api
- Swagger UI: http://localhost:5000/swagger

## Proje Yapısı

```
backend/
└── CorporateMenuManagementSystem.sln
    ├── CorporateMenuManagementSystem.API/          # Web API Layer
    │   ├── Controllers/                            # API Controllers
    │   │   ├── AuthController.cs
    │   │   ├── MenuController.cs
    │   │   ├── ReservationController.cs
    │   │   ├── FeedbackController.cs
    │   │   ├── NotificationController.cs
    │   │   ├── ProfileController.cs
    │   │   ├── SurveyController.cs
    │   │   ├── AdminSurveyController.cs
    │   │   └── AdminDashboardController.cs
    │   ├── Mappings/                               # AutoMapper Profiles
    │   ├── Program.cs                              # Application entry point
    │   └── appsettings.json                        # Configuration
    │
    ├── CorporateMenuManagementSystem.BusinessLayer/  # Business Logic Layer
    │   ├── Abstract/                               # Service Interfaces
    │   └── Concrete/                               # Service Implementations
    │
    ├── CorporateMenuManagementSystem.DataAccessLayer/  # Data Access Layer
    │   ├── Abstract/                               # Repository Interfaces
    │   ├── Concrete/
    │   │   ├── DatabaseFolder/                     # DbContext & Configurations
    │   │   └── Repositories/                       # Repository Implementations
    │   └── Migrations/                             # EF Core Migrations
    │
    ├── CorporateMenuManagementSystem.EntityLayer/  # Entity & DTOs Layer
    │   ├── Entities/                               # Database Entities
    │   ├── DTOs/                                   # Data Transfer Objects
    │   └── Enums/                                  # Enumerations
    │
    └── CorporateMenuManagementSystem.Tests/        # Test Project
        ├── Controllers/
        ├── Services/
        └── Repositories/
```

## Teknolojiler

| Teknoloji | Sürüm | Kullanım Alanı |
|-----------|-------|----------------|
| .NET | 8.0 | Web API Framework |
| Entity Framework Core | 9.0.10 | ORM |
| Pomelo.EntityFrameworkCore.MySql | 9.0.0 | MySQL Provider |
| ASP.NET Core Identity | 8.0.11 | User Management |
| JWT Bearer Authentication | 8.0.11 | Token-based Auth |
| AutoMapper | 12.0.1 | Object Mapping |
| Swagger/OpenAPI | 6.6.2 | API Documentation |
| MySQL | 8.0+ | Database |

## Kurulum ve Çalıştırma

### Ön Gereksinimler

- .NET SDK 8.0 veya üzeri
- MySQL 8.0+ (local veya cloud)
- Visual Studio 2022 / VS Code / Rider (önerilen)

### Kurulum Adımları

#### 1. Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/Web_Mobil_Kurumsal_Menu_Yonetim_Sistemi.git
cd Web_Mobil_Kurumsal_Menu_Yonetim_Sistemi/backend
```

#### 2. Veritabanı Yapılandırması

```bash
cd CorporateMenuManagementSystem.API

# appsettings.json dosyasını oluşturun
cp appsettings.example.json appsettings.json
```

`appsettings.json` dosyasını düzenleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=KurumsalMenuDb;Uid=YOUR_USERNAME;Pwd=YOUR_PASSWORD;"
  },
  "JwtSettings": {
    "Secret": "YOUR_SECRET_KEY_AT_LEAST_32_CHARACTERS_LONG",
    "Issuer": "https://your-domain.com",
    "Audience": "https://your-domain.com",
    "ExpirationInDays": 3
  }
}
```

#### 3. Bağımlılıkları Yükleyin

```bash
dotnet restore
```

#### 4. Veritabanı Migration'ları

```bash
# Migration'ları uygulayın
dotnet ef database update

# Yeni migration oluşturmak için (gerekirse)
dotnet ef migrations add MigrationName
```

#### 5. Uygulamayı Çalıştırın

```bash
# Development mode
dotnet run

# Production mode
dotnet run --configuration Release
```

API varsayılan olarak şu adreslerde çalışır:
- **HTTP:** `http://localhost:5000`
- **HTTPS:** `https://localhost:5001`
- **Swagger:** `http://localhost:5000/swagger`

### Diğer Komutlar

```bash
# Build
dotnet build

# Test çalıştır
dotnet test

# Production build
dotnet publish -c Release -o ./publish

# Migration silme
dotnet ef database drop
dotnet ef migrations remove
```

## Kullanıcı Giriş Bilgileri

### Admin Hesabı (Otomatik Oluşturulur)
```
Email: admin@taskinnovation.com
Şifre: Taskinnovation1234!
Role: Admin
```

### Test Kullanıcıları (Otomatik Oluşturulur)
```
Email: user1@example.com, user2@example.com, ... user50@example.com
Şifre: Password123!
Role: User
```

**Not:** İlk çalıştırmada `DataSeeder` otomatik olarak admin kullanıcısı ve test kullanıcılarını oluşturur.

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı | No |
| POST | `/api/auth/login` | Kullanıcı girişi | No |
| POST | `/api/auth/forgot-password` | Şifre sıfırlama isteği | No |
| POST | `/api/auth/reset-password` | Şifre sıfırlama | No |

#### Register Request
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### Login Request
```json
{
  "email": "admin@taskinnovation.com",
  "password": "Taskinnovation1234!"
}
```

#### Login Response
```json
{
  "isSuccessful": true,
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2025-11-24T12:00:00Z"
  }
}
```

### Menu Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/menu/today` | Bugünün menüsü | No |
| GET | `/api/menu/weekly?week=current` | Haftalık menüler | No |
| GET | `/api/menu/past?weeks=4` | Geçmiş menüler | No |
| GET | `/api/top-rated?count=5` | En yüksek puanlı menüler | No |
| GET | `/api/admin/menu` | Tüm menüler | Admin |
| GET | `/api/admin/menu/{id}` | Belirli menü | Admin |
| POST | `/api/admin/menu` | Menü oluştur | Admin |
| PUT | `/api/admin/menu/{id}` | Menü güncelle | Admin |
| DELETE | `/api/admin/menu/{id}?force=false` | Menü sil | Admin |

#### Create Menu Request
```json
{
  "date": "2025-11-22",
  "mainCourse": "Izgara Tavuk",
  "sideDish": "Pilav",
  "soup": "Mercimek Çorbası",
  "dessert": "Sütlaç",
  "salad": "Mevsim Salata",
  "price": 45.00,
  "calories": 650
}
```

### Reservation Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/reservations/me` | Rezervasyonlarım | User |
| POST | `/api/reservations` | Rezervasyon yap | User |
| DELETE | `/api/reservations/{id}` | Rezervasyon iptal | User |
| GET | `/api/admin/reservations/summary` | Rezervasyon özeti | Admin |
| GET | `/api/admin/reservations/daily?date=2025-11-22` | Günlük rezervasyonlar | Admin |

#### Create Reservation Request
```json
{
  "menuId": 123
}
```

### Feedback Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/feedback` | Geri bildirim gönder | User |
| PUT | `/api/feedback/{id}` | Geri bildirim güncelle | User |
| GET | `/api/feedback/my/{menuId}` | Benim geri bildirimim | User |
| GET | `/api/feedback/daily/{menuId}` | Günlük geri bildirimler | No |
| GET | `/api/admin/feedback` | Tüm geri bildirimler | Admin |

#### Submit Feedback Request
```json
{
  "menuId": 123,
  "rating": 5,
  "comment": "Çok lezzetliydi!"
}
```

### Notification Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/notifications` | Bildirimlerim | User |
| GET | `/api/notifications/unread-count` | Okunmamış sayısı | User |
| POST | `/api/notifications/mark-read` | Okundu işaretle | User |

#### Mark as Read Request
```json
{
  "notificationId": 123,
  "markAllAsRead": false
}
```

### Profile Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/profile/me` | Profil bilgileri | User |
| PUT | `/api/profile/me` | Profil güncelle | User |

#### Update Profile Request
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### Survey Endpoints (User)

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/survey/active` | Aktif anket | User |
| POST | `/api/survey/respond` | Ankete cevap ver | User |

#### Survey Response Request
```json
{
  "surveyId": 1,
  "answer": "Evet, çok memnunum"
}
```

### Survey Endpoints (Admin)

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/admin/survey` | Anket oluştur | Admin |
| GET | `/api/admin/survey/{id}/results` | Anket sonuçları | Admin |
| PUT | `/api/admin/survey/{id}/status` | Anket durumu güncelle | Admin |

#### Create Survey Request
```json
{
  "title": "Menü Memnuniyet Anketi",
  "question": "Bugünkü menüden memnun kaldınız mı?",
  "endDate": "2025-12-31"
}
```

### Admin Dashboard Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/admin/dashboard/summary` | Dashboard özet istatistikleri | Admin |

## Authentication

API JWT (JSON Web Token) authentication kullanır.

### Token Kullanımı

Login sonrası dönen token'ı her istekte header'a ekleyin:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Claims

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "User",
  "exp": 1732464000
}
```

## Veritabanı Yapısı

### Ana Tablolar

- **AppUsers** - Kullanıcı bilgileri (ASP.NET Identity)
- **AppRoles** - Roller (Admin, User)
- **Menus** - Menü kayıtları
- **Reservations** - Rezervasyonlar
- **Feedbacks** - Geri bildirimler
- **Notifications** - Bildirimler
- **Surveys** - Anketler
- **SurveyResponses** - Anket cevapları

### İlişkiler

```
AppUsers
├── Reservations (1:N)
├── Feedbacks (1:N)
├── Notifications (1:N)
└── SurveyResponses (1:N)

Menus
├── Reservations (1:N)
└── Feedbacks (1:N)

Surveys
└── SurveyResponses (1:N)
```

## Yapılandırma

### appsettings.json Özellikleri

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "MySQL connection string"
  },
  "JwtSettings": {
    "Secret": "Secret key (min 32 chars)",
    "Issuer": "Token issuer",
    "Audience": "Token audience",
    "ExpirationInDays": 3
  },
  "DataSeedingSettings": {
    "AdminUser": {
      "FirstName": "Admin",
      "LastName": "User",
      "Email": "admin@example.com",
      "UserName": "admin",
      "Password": "AdminPassword123!"
    },
    "Roles": [
      { "Name": "Admin", "Description": "Administrator role" },
      { "Name": "User", "Description": "Standard user role" }
    ]
  },
  "DataFakerSettings": {
    "IsEnabled": true,
    "UserCount": 50,
    "MenuDays": 30,
    "DefaultPassword": "Password123!"
  }
}
```

## Testing

```bash
# Tüm testleri çalıştır
dotnet test

# Code coverage ile
dotnet test /p:CollectCoverage=true

# Belirli test çalıştır
dotnet test --filter "FullyQualifiedName~AuthControllerTests"
```

## Deployment

### Docker Deployment

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CorporateMenuManagementSystem.API/CorporateMenuManagementSystem.API.csproj", "CorporateMenuManagementSystem.API/"]
RUN dotnet restore "CorporateMenuManagementSystem.API/CorporateMenuManagementSystem.API.csproj"
COPY . .
WORKDIR "/src/CorporateMenuManagementSystem.API"
RUN dotnet build "CorporateMenuManagementSystem.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CorporateMenuManagementSystem.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CorporateMenuManagementSystem.API.dll"]
```

### Google Cloud Run

```bash
# Build docker image
docker build -t gcr.io/PROJECT_ID/corporate-menu-api .

# Push to Google Container Registry
docker push gcr.io/PROJECT_ID/corporate-menu-api

# Deploy to Cloud Run
gcloud run deploy corporate-menu-api \
  --image gcr.io/PROJECT_ID/corporate-menu-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Performance & Optimization

- **Database Indexing:** Kritik sorgular için index'ler eklendi
- **Async/Await:** Tüm I/O operasyonları asenkron
- **Response Caching:** Statik içerik için caching
- **Query Optimization:** Include() ile N+1 problemi önlendi
- **Connection Pooling:** EF Core connection pooling aktif

## Troubleshooting

### Migration Hataları

```bash
# Migration'ları sıfırla
dotnet ef database drop --force
dotnet ef migrations remove
dotnet ef migrations add Initial
dotnet ef database update
```

### Connection String Hataları

MySQL bağlantı dizesi formatı kontrol edin:
```
Server=localhost;Database=KurumsalMenuDb;Uid=root;Pwd=password;
```

### JWT Token Hataları

- Secret key minimum 32 karakter olmalı
- Token expiration kontrolü yapın
- Clock skew ayarlarını kontrol edin

## API Response Format

Tüm API response'ları şu formatta döner:

### Success Response
```json
{
  "isSuccessful": true,
  "statusCode": 200,
  "data": { /* actual data */ },
  "message": "Success message",
  "errors": null
}
```

### Error Response
```json
{
  "isSuccessful": false,
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "errors": ["Error 1", "Error 2"]
}
```

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**İlgili Dokümantasyon**
- Ana Dokümantasyon: README.md
- Frontend Dokümantasyonu: frontend/README.md

