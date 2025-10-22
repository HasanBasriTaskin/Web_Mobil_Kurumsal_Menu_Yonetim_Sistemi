# Bağımlılıklar ve Paket Listesi

Bu dokümantasyon, projede kullanılan tüm bağımlılıkları ve sürümlerini listeler.

## Frontend Bağımlılıkları

### Ana Bağımlılıklar (dependencies)

| Paket | Sürüm | Açıklama |
|-------|-------|----------|
| next | 16.0.0 | React framework |
| react | 19.2.0 | UI kütüphanesi |
| react-dom | 19.2.0 | React DOM renderer |
| tailwindcss | ^4 | Utility-first CSS framework |
| framer-motion | ^12.23.24 | Animasyon kütüphanesi |
| @radix-ui/react-dialog | ^1.1.15 | Modal/dialog bileşeni |
| @radix-ui/react-dropdown-menu | ^2.1.16 | Dropdown menu bileşeni |
| @radix-ui/react-select | ^2.2.6 | Select bileşeni |
| @radix-ui/react-toast | ^1.2.15 | Toast notification bileşeni |
| @radix-ui/react-label | ^2.1.7 | Label bileşeni |
| @radix-ui/react-slot | ^1.2.3 | Slot utility |
| lucide-react | ^0.546.0 | İkon kütüphanesi |
| sonner | ^2.0.7 | Toast notification system |
| react-hook-form | ^7.65.0 | Form yönetimi |
| zod | ^4.1.12 | Schema validation |
| @hookform/resolvers | ^5.2.2 | React Hook Form resolvers |
| axios | ^1.12.2 | HTTP client |

### Geliştirme Bağımlılıkları (devDependencies)

| Paket | Sürüm | Açıklama |
|-------|-------|----------|
| @tailwindcss/postcss | ^4 | Tailwind PostCSS plugin |
| eslint | ^9 | JavaScript linter |
| eslint-config-next | 16.0.0 | Next.js ESLint config |

## Backend Bağımlılıkları

### NuGet Paketleri

| Paket | Sürüm | Açıklama |
|-------|-------|----------|
| Microsoft.AspNetCore.OpenApi | 8.0.20 | OpenAPI support |
| Swashbuckle.AspNetCore | 6.6.2 | Swagger/OpenAPI tooling |
| Pomelo.EntityFrameworkCore.MySql | 9.0.0 | MySQL provider for EF Core |
| Microsoft.EntityFrameworkCore.Design | 9.0.10 | EF Core design-time tools |
| Microsoft.AspNetCore.Authentication.JwtBearer | 8.0.11 | JWT authentication |
| AutoMapper.Extensions.Microsoft.DependencyInjection | 12.0.1 | AutoMapper DI integration |
| FluentValidation.AspNetCore | 11.3.0 | FluentValidation for ASP.NET Core |
| Serilog.AspNetCore | 8.0.3 | Serilog logging integration |
| Serilog.Sinks.Console | 6.0.0 | Serilog console sink |
| Serilog.Sinks.File | 6.0.0 | Serilog file sink |

## Framework Sürümleri

- **Node.js**: v20.19.5
- **.NET**: 8.0 (SDK 9.0.305 ile uyumlu)
- **npm**: 10.8.2

## Veritabanı

- **MySQL**: 8.0+ (önerilen)
- **ORM**: Entity Framework Core Code First

## Deployment Platformları

- **Frontend**: Vercel (Next.js için optimize edilmiş)
- **Backend**: Google Cloud (Cloud Run veya App Engine önerilir)

## Güncelleme Notları

### Frontend Paketlerini Güncelleme

```bash
cd frontend
npm update
```

### Backend Paketlerini Güncelleme

```bash
cd backend
dotnet list package --outdated
dotnet add package PackageName --version x.x.x
```

## Uyumluluk Notları

- **Next.js 16**: Turbopack desteği ile gelir
- **React 19**: En son React sürümü
- **Tailwind CSS 4**: Yeni CSS engine
- **.NET 8**: Long-term support (LTS) sürümü
- **Pomelo MySQL**: .NET 9 EF Core ile uyumlu

## Güvenlik

Bağımlılıkları düzenli olarak güncelleyin:

```bash
# Frontend
npm audit
npm audit fix

# Backend
dotnet list package --vulnerable
```

Son Güncelleme: 2025-10-22
