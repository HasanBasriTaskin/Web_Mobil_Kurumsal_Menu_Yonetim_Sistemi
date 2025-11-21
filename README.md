# Web ve Mobil Kurumsal Menü Yönetim Sistemi

Modern ve kullanıcı dostu kurumsal menü yönetim sistemi. Çalışanların günlük menüleri görüntülemesi, rezervasyon yapması, geri bildirim vermesi ve anketlere katılması için kapsamlı bir platform.

## Canlı Demo

**Frontend:** https://corporatemenusystem.taskinnovation.net

## Proje Yapısı

```
├── frontend/          # Next.js Frontend Uygulaması
├── backend/           # .NET 8 Web API Backend Uygulaması
├── DEPENDENCIES.md    # Detaylı paket listesi
└── README.md          # Bu dosya
```

## Hızlı Başlangıç

### Ön Gereksinimler

- **Node.js:** v20.19.5 veya üzeri
- **.NET SDK:** 8.0 veya üzeri
- **MySQL:** 8.0+ 
- **npm:** 10.8.2 veya üzeri

### Kurulum Adımları

#### 1. Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/Web_Mobil_Kurumsal_Menu_Yonetim_Sistemi.git
cd Web_Mobil_Kurumsal_Menu_Yonetim_Sistemi
```

#### 2. Backend Kurulumu

```bash
cd backend/CorporateMenuManagementSystem.API

# Bağımlılıkları yükleyin
dotnet restore

# appsettings.json dosyasını yapılandırın
cp appsettings.example.json appsettings.json
# appsettings.json içindeki veritabanı bağlantı dizesini düzenleyin

# Veritabanı migration'ları uygulayın
dotnet ef database update

# Uygulamayı çalıştırın
dotnet run
```

Backend varsayılan olarak `https://localhost:5000` adresinde çalışır.

#### 3. Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# .env.local dosyası oluşturun
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Development sunucusunu başlatın
npm run dev
```

Frontend varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Kullanıcı Giriş Bilgileri

### Admin Hesabı
- **Email:** admin@taskinnovation.com
- **Şifre:** Taskinnovation1234!
- **Yetkiler:** Tüm sistem yetkileri, menü yönetimi, kullanıcı yönetimi, raporlama

### Test Kullanıcıları
Sistem otomatik olarak 50 adet test kullanıcısı oluşturur.
- **Şifre (Tüm test kullanıcıları için):** Password123!
- **Format:** user1@example.com, user2@example.com, ... user50@example.com

## Teknolojiler

### Frontend
- **Framework:** Next.js 16.0.0 (React 19.2.0)
- **Styling:** Tailwind CSS 4
- **Animasyon:** Framer Motion
- **UI Bileşenleri:** Radix UI
- **İkonlar:** Lucide React
- **Form Yönetimi:** React Hook Form + Zod
- **HTTP İstemcisi:** Axios
- **Bildirimler:** Sonner

### Backend
- **Framework:** .NET 8 Web API
- **ORM:** Entity Framework Core (Code First)
- **Veritabanı:** MySQL 8.0+
- **Kimlik Doğrulama:** ASP.NET Core Identity + JWT
- **Mapping:** AutoMapper
- **API Dokümantasyonu:** Swagger/OpenAPI

## API Dokümantasyonu

API endpoint'lerinin detaylı listesi için:
- **Frontend README:** [frontend/README.md](frontend/README.md)
- **Backend README:** [backend/README.md](backend/README.md)

Backend çalıştırıldığında Swagger UI'a erişim:
- **Local:** https://localhost:5000/swagger
- **Production:** API Swagger dokümantasyonu

## Özellikler

### Kullanıcı (User) Özellikleri
- Günlük ve haftalık menüleri görüntüleme
- Menü rezervasyonu yapma/iptal etme
- Geçmiş menüleri görüntüleme
- Menülere puan ve yorum verme
- Anketlere katılma
- Bildirim alma ve yönetme
- Profil güncelleme

### Admin Özellikleri
- Menü oluşturma, düzenleme, silme
- Rezervasyon takibi
- Geri bildirim moderasyonu
- Anket oluşturma ve sonuçları görüntüleme
- Dashboard ve raporlama
- Kullanıcı yönetimi

## Detaylı Dokümantasyon

- **Frontend README:** frontend/README.md - Frontend kurulum, çalıştırma ve API kullanımı
- **Backend README:** backend/README.md - Backend kurulum, API endpoint'leri ve veritabanı yapısı
- **Bağımlılıklar:** DEPENDENCIES.md - Tüm paketler ve sürüm bilgileri

## Deployment

### Frontend (Vercel)
- Platform: Vercel
- Auto-deploy: main branch
- Environment Variables: `NEXT_PUBLIC_API_URL`

### Backend (Google Cloud)
- Platform: Google Cloud Run
- Container: Docker
- Database: Cloud SQL (MySQL)

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

- Website: https://corporatemenusystem.taskinnovation.net
- Email: admin@taskinnovation.com

---

**Not:** Detaylı kurulum ve API kullanımı için frontend ve backend klasörlerindeki README dosyalarını inceleyiniz.