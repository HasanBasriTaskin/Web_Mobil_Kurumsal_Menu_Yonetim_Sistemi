# Proje Klasör Yapısı

Bu dokümantasyon, projenin klasör yapısını ve her bir klasörün amacını açıklar.

## Genel Yapı

```
Web_Mobil_Kurumsal_Menu_Yonetim_Sistemi/
├── frontend/          # Next.js Frontend Uygulaması
├── backend/           # .NET 8 Web API Backend Uygulaması
├── .gitignore         # Git ignore kuralları
└── README.md          # Ana proje dokümantasyonu
```

## Frontend Klasör Yapısı

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.js          # Ana layout bileşeni
│   ├── page.js            # Ana sayfa
│   └── globals.css        # Global CSS stilleri
├── components/             # Yeniden kullanılabilir React bileşenleri
│   └── Example.jsx        # Örnek form bileşeni (React Hook Form + Zod)
├── lib/                    # Yardımcı fonksiyonlar ve konfigürasyonlar
│   └── schemas/           # Zod validation şemaları
│       └── validationSchemas.js
├── services/              # API servisleri ve HTTP istemcileri
│   └── api.js            # Axios yapılandırması
├── public/               # Statik dosyalar
├── .env.example          # Ortam değişkenleri örneği
├── package.json          # Node.js bağımlılıkları
├── next.config.mjs       # Next.js konfigürasyonu
├── tailwind.config.js    # Tailwind CSS konfigürasyonu
└── README.md             # Frontend dokümantasyonu
```

## Backend Klasör Yapısı

```
backend/
├── Controllers/          # API endpoint'leri
│   └── HealthController.cs
├── Models/              # Domain modelleri (Entity'ler)
│   └── MenuItem.cs      # Örnek entity
├── Data/                # DbContext ve migrations
│   └── ApplicationDbContext.cs
├── DTOs/                # Data Transfer Objects
│   └── LoginDto.cs
├── Services/            # İş mantığı katmanı
├── Validators/          # FluentValidation doğrulayıcıları
│   └── LoginDtoValidator.cs
├── Mappings/            # AutoMapper profilleri
│   └── MappingProfile.cs
├── Properties/          # Proje özellikleri
│   └── launchSettings.json
├── Program.cs           # Uygulama giriş noktası
├── appsettings.json     # Uygulama yapılandırması
├── appsettings.Development.json  # Geliştirme ortamı yapılandırması
├── backend.csproj       # .NET proje dosyası
└── README.md            # Backend dokümantasyonu
```

## Klasör Açıklamaları

### Frontend

- **app/**: Next.js 13+ App Router yapısı, sayfalar ve layout'lar
- **components/**: Yeniden kullanılabilir UI bileşenleri
- **lib/**: Yardımcı fonksiyonlar, sabitler, tip tanımları
- **services/**: API çağrıları ve dış servis entegrasyonları
- **public/**: Statik dosyalar (resimler, fontlar vb.)

### Backend

- **Controllers/**: HTTP endpoint'lerini yöneten controller'lar
- **Models/**: Veritabanı entity'leri (domain modelleri)
- **Data/**: EF Core DbContext ve migration dosyaları
- **DTOs/**: API request/response için kullanılan Data Transfer Objects
- **Services/**: İş mantığı ve servis katmanı
- **Validators/**: FluentValidation ile input doğrulama
- **Mappings/**: AutoMapper profilleri ve mapping yapılandırması

## Geliştirme Sırası Önerileri

1. **Backend**:
   - Models klasöründe entity'leri oluştur
   - DTOs klasöründe request/response modelleri tanımla
   - Validators ile doğrulama kurallarını yaz
   - Mappings ile DTO-Entity eşleştirmelerini yap
   - Services ile iş mantığını yaz
   - Controllers ile API endpoint'lerini oluştur

2. **Frontend**:
   - lib/schemas klasöründe validasyon şemalarını tanımla
   - components klasöründe UI bileşenlerini oluştur
   - services klasöründe API çağrılarını yaz
   - app klasöründe sayfaları oluştur

## Kod Standartları

- **Frontend**: ESLint kurallarına uygun kod yaz
- **Backend**: C# naming conventions'larını takip et
- **Commit**: Anlamlı commit mesajları kullan
- **Dokümantasyon**: Her yeni feature için dokümantasyon güncelle
