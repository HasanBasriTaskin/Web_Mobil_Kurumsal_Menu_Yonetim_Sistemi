# Kurumsal Menü Yönetim Sistemi – Kısa Referans

## Kurulum ve çalıştırma adımları

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Yerel adres: `http://localhost:3000`

### Backend
```bash
cd backend/CorporateMenuManagementSystem.API
dotnet restore
dotnet build
dotnet run
```
Adres: `http://localhost:5000` 

## Kullanıcı giriş bilgileri

- **Admin:** `admin@taskinnovation.com` / `Taskinnovation1234!`  
- **User:** Kayıt olup giriş yapılır; `POST /api/auth/register` kullanılarak yeni kullanıcı oluşturulabilir.

## API endpoint listesi

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Menu
- `GET /api/menu/weekly`
- `GET /api/menu/today`
- `GET /api/menu/top-rated`
- `GET /api/menu/past?month=YYYY-MM`
- `POST /api/admin/menu`
- `PUT /api/admin/menu/{id}`
- `DELETE /api/admin/menu/{id}`

### Reservation
- `POST /api/reservations`
- `DELETE /api/reservations/{id}`
- `GET /api/reservations/me`
- `GET /api/admin/reservations/...`

### Feedback
- `POST /api/feedback`
- `PUT /api/feedback/{id}`
- `GET /api/feedback/daily/{id}`
- `GET /api/feedback/my/{menuId}`
- `GET /api/admin/feedback`

### Profile
- `GET /api/profile/me`
- `PUT /api/profile/me`

### Notification
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `POST /api/notifications/mark-read`

### Survey
- `POST /admin/survey`
- `GET /admin/surveys`
- `PUT /admin/survey/{id}/status`
- `DELETE /admin/survey/{id}`
- `GET /survey/actives`
- `POST /survey/respond`
- `GET /admin/survey/{id}/results`

## Canlı proje linki

[http://corporatemenusystem.taskinnovation.net](http://corporatemenusystem.taskinnovation.net)  
Admin bilgileri yukarıdaki “Kullanıcı giriş bilgileri” bölümünde yer alıyor.

