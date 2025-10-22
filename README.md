# Web ve Mobil Kurumsal Menu Yönetim Sistemi

Monolitik yapıda kurumsal menu yönetim sistemi. Frontend ve Backend ayrı klasörlerde yer almaktadır.

## Proje Yapısı

```
├── frontend/          # Next.js Frontend Uygulaması
└── backend/           # .NET 8 Web API Backend Uygulaması
```

## Teknolojiler

### Frontend
- **Framework:** Next.js (JavaScript)
- **Styling:** Tailwind CSS
- **Animasyon:** Framer Motion
- **UI Bileşenleri:** Radix UI
- **İkonlar:** Lucide React
- **Bildirimler:** Sonner
- **Form Yönetimi:** React Hook Form
- **Validasyon:** Zod
- **HTTP İstemcisi:** Axios

### Backend
- **Framework:** .NET 8 Web API
- **Veritabanı:** MySQL (Entity Framework Core Code First)
- **Kimlik Doğrulama:** JWT Authentication
- **Mapping:** AutoMapper
- **Validasyon:** FluentValidation
- **Logging:** Serilog

## Kurulum

### Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:3000` adresinde çalışır.

### Backend Kurulumu

```bash
cd backend
dotnet restore
dotnet run
```

Backend varsayılan olarak `https://localhost:7XXX` adresinde çalışır.

## Deployment

- **Frontend:** Vercel
- **Backend:** Google Cloud

## Geliştirme

### Frontend Geliştirme

```bash
cd frontend
npm run dev        # Geliştirme sunucusu
npm run build      # Production build
npm run start      # Production sunucusu
npm run lint       # Linting
```

### Backend Geliştirme

```bash
cd backend
dotnet build       # Derleme
dotnet run         # Çalıştırma
dotnet test        # Testler
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.