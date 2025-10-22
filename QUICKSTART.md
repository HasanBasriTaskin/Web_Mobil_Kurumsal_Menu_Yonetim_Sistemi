# Hızlı Başlangıç Kılavuzu

Bu kılavuz, projeyi ilk kez kuranlara yönelik adım adım talimatlar içerir.

## Ön Koşullar

Sisteminizde aşağıdaki yazılımların kurulu olması gerekir:

- **Node.js** (v18 veya üzeri) - [İndir](https://nodejs.org/)
- **.NET SDK 8.0** - [İndir](https://dotnet.microsoft.com/download/dotnet/8.0)
- **MySQL** (v8.0 veya üzeri) - [İndir](https://dev.mysql.com/downloads/)
- **Git** - [İndir](https://git-scm.com/)

## Kurulum Adımları

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/HasanBasriTaskin/Web_Mobil_Kurumsal_Menu_Yonetim_Sistemi.git
cd Web_Mobil_Kurumsal_Menu_Yonetim_Sistemi
```

### 2. Backend Kurulumu

#### a. Bağımlılıkları Yükleyin

```bash
cd backend
dotnet restore
```

#### b. Veritabanını Yapılandırın

1. MySQL'de yeni bir veritabanı oluşturun:
```sql
CREATE DATABASE MenuManagementDb;
```

2. `appsettings.Development.json` dosyasını düzenleyin ve bağlantı dizesini güncelleyin:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=3306;Database=MenuManagementDb;User=root;Password=your_mysql_password;"
}
```

#### c. Migration'ları Çalıştırın

```bash
# İlk migration'ı oluştur
dotnet ef migrations add InitialCreate

# Veritabanını güncelle
dotnet ef database update
```

#### d. Backend'i Çalıştırın

```bash
dotnet run
```

Backend şu adreste çalışacaktır: `https://localhost:7xxx` (port numarası konsol çıktısında görünecektir)

### 3. Frontend Kurulumu

#### a. Bağımlılıkları Yükleyin

Yeni bir terminal penceresi açın:

```bash
cd frontend
npm install
```

#### b. Ortam Değişkenlerini Yapılandırın

`.env.local` dosyası oluşturun (`.env.example` dosyasını kopyalayın):

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_API_URL=https://localhost:7xxx/api
```

> **Not:** `7xxx` yerine backend'in çalıştığı gerçek port numarasını yazın.

#### c. Frontend'i Çalıştırın

```bash
npm run dev
```

Frontend şu adreste çalışacaktır: `http://localhost:3000`

## Doğrulama

### Backend'i Test Edin

Tarayıcınızda veya Postman'de şu adrese gidin:
```
https://localhost:7xxx/api/health
```

Şu şekilde bir yanıt görmelisiniz:
```json
{
  "status": "Healthy",
  "timestamp": "2025-10-22T...",
  "message": "Backend API is running successfully"
}
```

### Swagger UI

Backend API dokümantasyonunu görmek için:
```
https://localhost:7xxx/swagger
```

### Frontend'i Test Edin

Tarayıcınızda şu adrese gidin:
```
http://localhost:3000
```

Next.js varsayılan sayfasını görmelisiniz.

## Geliştirme İpuçları

### Backend

- **Hot Reload**: Kod değişikliklerinde otomatik yeniden derleme için:
  ```bash
  dotnet watch run
  ```

- **Logları İzleme**: Serilog konsol ve dosya logları `logs/` klasöründe saklanır

- **Migration Oluşturma**: Yeni migration eklemek için:
  ```bash
  dotnet ef migrations add MigrationName
  dotnet ef database update
  ```

### Frontend

- **Development Server**: Otomatik hot-reload aktiftir
- **Build**: Production build oluşturmak için: `npm run build`
- **Start**: Production modda çalıştırmak için: `npm run start`
- **Lint**: Kod kalitesi kontrolü: `npm run lint`

## Yaygın Sorunlar ve Çözümler

### MySQL Bağlantı Hatası
- MySQL servisinin çalıştığından emin olun
- Bağlantı dizesindeki kullanıcı adı ve şifrenin doğru olduğunu kontrol edin

### Frontend'de API Bağlantı Hatası
- Backend'in çalıştığından emin olun
- `.env.local` dosyasındaki API URL'nin doğru olduğunu kontrol edin
- CORS ayarlarının yapılandırıldığını doğrulayın

### Port Çakışması
- Backend veya Frontend'in kullandığı port meşgulse, farklı bir port kullanabilirsiniz:
  - Backend: `launchSettings.json` dosyasındaki port numarasını değiştirin
  - Frontend: `npm run dev -- -p 3001` ile farklı port kullanın

## Sonraki Adımlar

1. `STRUCTURE.md` dosyasını okuyarak proje yapısını anlayın
2. Frontend ve Backend README dosyalarını inceleyin
3. Example bileşenlerini inceleyerek kütüphanelerin kullanımını öğrenin
4. Kendi feature'larınızı geliştirmeye başlayın

## Yardım

Sorun yaşarsanız:
1. Projenin GitHub Issues sayfasını kontrol edin
2. Dokümantasyonu tekrar gözden geçirin
3. Hata mesajlarını ve logları inceleyin

İyi kodlamalar! 🚀
