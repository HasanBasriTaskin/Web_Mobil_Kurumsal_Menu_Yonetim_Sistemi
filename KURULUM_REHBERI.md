# 🚀 Kurulum ve Çalıştırma Rehberi

Bu rehber, backend (.NET Core), frontend (Next.js) ve MySQL veritabanını entegre etmek için adım adım talimatlar içerir.

---

## 📋 Gereksinimler

### 1. Gerekli Yazılımlar

- **.NET SDK 8.0** veya üzeri
- **Node.js 18+** ve **npm**
- **MySQL Server 8.0+**
- **Visual Studio Code** veya **Visual Studio** (opsiyonel)

---

## 🗄️ ADIM 1: MySQL Kurulumu ve Veritabanı Hazırlığı

### 1.1 MySQL Kurulumu

**macOS için:**
```bash
# Homebrew ile kurulum
brew install mysql

# MySQL'i başlat
brew services start mysql

# MySQL root şifresini ayarla (ilk kurulumda şifre boş olabilir)
mysql_secure_installation
```

**Windows için:**
- MySQL Installer'ı indirin: https://dev.mysql.com/downloads/installer/
- Kurulum sırasında root şifresini belirleyin

**Linux için:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### 1.2 Veritabanı Oluşturma

MySQL'e bağlanın:
```bash
mysql -u root -p
```

Veritabanını oluşturun:
```sql
CREATE DATABASE KurumsalMenuDb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 1.3 Connection String Kontrolü

`backend/CorporateMenuManagementSystem.API/appsettings.json` dosyasını kontrol edin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=KurumsalMenuDb;Uid=root;Pwd=YOUR_PASSWORD;"
  }
}
```

**ÖNEMLİ:** `YOUR_PASSWORD` kısmını MySQL root şifrenizle değiştirin!

---

## 🔧 ADIM 2: Backend (.NET Core) Kurulumu

### 2.1 .NET SDK Kontrolü

```bash
dotnet --version
```

Eğer yüklü değilse: https://dotnet.microsoft.com/download

### 2.2 Backend Dizinine Geçin

```bash
cd backend/CorporateMenuManagementSystem.API
```

### 2.3 Bağımlılıkları Yükleyin

```bash
dotnet restore
```

### 2.4 Veritabanı Migration'larını Çalıştırın

Backend ilk çalıştığında otomatik olarak migration'lar çalışacak, ancak manuel olarak da çalıştırabilirsiniz:

```bash
# Migration klasörüne git
cd ../CorporateMenuManagementSystem.DataAccessLayer

# Migration oluştur (gerekirse)
dotnet ef migrations add InitialCreate --startup-project ../CorporateMenuManagementSystem.API

# Veritabanını güncelle
dotnet ef database update --startup-project ../CorporateMenuManagementSystem.API
```

### 2.5 Backend'i Çalıştırın

```bash
cd ../CorporateMenuManagementSystem.API
dotnet run
```

**Backend şu adreste çalışacak:**
- HTTP: `http://localhost:5150`
- HTTPS: `https://localhost:7235`
- Swagger UI: `http://localhost:5150/swagger`

### 2.6 Backend Testi

Tarayıcıda şu adresi açın:
```
http://localhost:5150/swagger
```

Swagger UI'da API endpoint'lerini görebilirsiniz.

---

## 🎨 ADIM 3: Frontend (Next.js) Kurulumu

### 3.1 Node.js Kontrolü

```bash
node --version
npm --version
```

### 3.2 Frontend Dizinine Geçin

```bash
cd ../../frontend
```

### 3.3 Bağımlılıkları Yükleyin

```bash
npm install
```

### 3.4 Environment Variables Ayarlayın

`.env.local` dosyası oluşturun (eğer yoksa):

```bash
touch .env.local
```

`.env.local` dosyasına şunu ekleyin:

```env
NEXT_PUBLIC_API_URL=http://localhost:5150/api
```

**ÖNEMLİ:** Backend'in çalıştığı port ile eşleşmeli!

### 3.5 Frontend'i Çalıştırın

```bash
npm run dev
```

**Frontend şu adreste çalışacak:**
- `http://localhost:3000`

---

## 🔗 ADIM 4: Entegrasyon ve Test

### 4.1 Servisleri Başlatma Sırası

1. **MySQL** (zaten çalışıyor olmalı)
2. **Backend** (`dotnet run`)
3. **Frontend** (`npm run dev`)

### 4.2 Test Adımları

1. **Backend Test:**
   - `http://localhost:5150/swagger` adresini açın
   - API endpoint'lerini test edin

2. **Frontend Test:**
   - `http://localhost:3000` adresini açın
   - Login sayfası görünmeli

3. **Admin Girişi:**
   - Email: `admin@taskinnovation.com`
   - Password: `Taskinnovation1234!`
   - (appsettings.json'dan alınmıştır)

### 4.3 API Bağlantısı Kontrolü

Frontend'den backend'e istek atıldığında:
- Browser Console'u açın (F12)
- Network sekmesinde API isteklerini kontrol edin
- Hata varsa CORS ayarlarını kontrol edin

---

## ⚙️ ADIM 5: CORS Ayarları (Gerekirse)

Eğer frontend'den backend'e istek atarken CORS hatası alırsanız:

`backend/CorporateMenuManagementSystem.API/Program.cs` dosyasına ekleyin:

```csharp
// CORS ayarları (Program.cs'e ekleyin)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// app.UseAuthorization() satırından ÖNCE ekleyin:
app.UseCors("AllowFrontend");
```

---

## 🐛 Sorun Giderme

### MySQL Bağlantı Hatası

**Hata:** `Unable to connect to any of the specified MySQL hosts`

**Çözüm:**
1. MySQL servisinin çalıştığından emin olun:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status mysql
   ```

2. Connection string'i kontrol edin:
   - Host: `localhost`
   - Port: `3306` (varsayılan)
   - Database: `KurumsalMenuDb`
   - Username: `root`
   - Password: Doğru şifreyi girdiğinizden emin olun

### Backend Çalışmıyor

**Hata:** `Port already in use`

**Çözüm:**
1. Port'u değiştirin (`launchSettings.json`):
   ```json
   "applicationUrl": "http://localhost:5151"
   ```

2. Veya kullanan process'i bulun ve kapatın:
   ```bash
   # macOS/Linux
   lsof -ti:5150 | xargs kill -9
   ```

### Frontend API'ye Bağlanamıyor

**Hata:** `Network Error` veya `CORS Error`

**Çözüm:**
1. Backend'in çalıştığından emin olun
2. `.env.local` dosyasındaki `NEXT_PUBLIC_API_URL` değerini kontrol edin
3. CORS ayarlarını yapın (yukarıdaki ADIM 5)

### Migration Hatası

**Hata:** `Migration failed`

**Çözüm:**
1. Veritabanını silin ve yeniden oluşturun:
   ```sql
   DROP DATABASE KurumsalMenuDb;
   CREATE DATABASE KurumsalMenuDb;
   ```

2. Migration'ları yeniden çalıştırın:
   ```bash
   dotnet ef database update --startup-project ../CorporateMenuManagementSystem.API
   ```

---

## 📝 Önemli Notlar

1. **İlk Çalıştırmada:**
   - Backend otomatik olarak migration'ları çalıştırır
   - Admin kullanıcısı otomatik oluşturulur
   - Test verileri eklenir (Development modunda)

2. **Production için:**
   - `appsettings.json`'daki şifreleri değiştirin
   - JWT Secret'ı güçlü bir değerle değiştirin
   - CORS ayarlarını production domain'ine göre güncelleyin

3. **Veritabanı Yedekleme:**
   ```bash
   mysqldump -u root -p KurumsalMenuDb > backup.sql
   ```

---

## ✅ Başarı Kontrol Listesi

- [ ] MySQL kurulu ve çalışıyor
- [ ] Veritabanı oluşturuldu
- [ ] Connection string doğru yapılandırıldı
- [ ] Backend başarıyla çalışıyor (Swagger açılıyor)
- [ ] Frontend başarıyla çalışıyor (Login sayfası görünüyor)
- [ ] API istekleri başarılı (Network tab'ında 200 OK)
- [ ] Admin ile giriş yapılabiliyor

---

## 🆘 Yardım

Sorun yaşarsanız:
1. Console loglarını kontrol edin
2. Browser Developer Tools'u açın (F12)
3. Backend loglarını kontrol edin
4. MySQL loglarını kontrol edin

**İyi çalışmalar! 🚀**


