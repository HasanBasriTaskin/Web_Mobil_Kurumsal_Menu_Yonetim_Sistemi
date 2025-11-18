# Backend Çalıştırma Rehberi

## Backend'i Çalıştırma

### 1. Terminal'de Backend Dizinine Gidin

```bash
cd ~/Desktop/Web_Mobil_Kurumsal_Menu_Yonetim_Sistemi/backend/CorporateMenuManagementSystem.API
```

### 2. Backend'i Başlatın

```bash
dotnet run
```

## ✅ Başarılı Çalıştırmada Göreceğiniz Çıktı

Backend başarıyla çalıştığında terminal'de şunları göreceksiniz:

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /Users/nese/Desktop/.../backend/CorporateMenuManagementSystem.API
```

**Önemli:** 
- `Now listening on: http://localhost:5000` mesajını görmelisiniz
- Eğer hata görürseniz, hata mesajını paylaşın

## 🔍 Backend Çalışıyor mu Kontrol Etme

Backend çalıştıktan sonra tarayıcıda şu adresi açın:
- **Swagger UI:** http://localhost:5000/swagger
- Bu sayfada API endpoint'lerini görebilirsiniz

## ❌ Olası Hatalar ve Çözümleri

### 1. MySQL Bağlantı Hatası
```
MySqlConnector.MySqlException: Access denied for user 'root'@'localhost'
```
**Çözüm:** `appsettings.json` dosyasındaki şifrenin doğru olduğundan emin olun.

### 2. Port Zaten Kullanılıyor
```
System.Net.HttpListenerException: Address already in use
```
**Çözüm:** 5000 portunu kullanan başka bir uygulama var. Onu durdurun veya portu değiştirin.

### 3. .NET SDK Bulunamadı
```
Could not execute because the specified command or file was not found.
```
**Çözüm:** .NET SDK kurulu değil. Kurulum için: https://dotnet.microsoft.com/download

## 🛑 Backend'i Durdurma

Backend'i durdurmak için terminal'de `Ctrl+C` tuşlarına basın.

