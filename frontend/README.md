# Frontend - Kurumsal Menü Yönetim Sistemi

Next.js 16 ve React 19 ile geliştirilmiş modern ve kullanıcı dostu frontend uygulaması.

## Canlı Demo

URL: https://corporatemenusystem.taskinnovation.net

## Proje Yapısı

```
frontend/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin sayfaları
│   │   ├── menu-yonetimi/
│   │   ├── yemek-yonetimi/
│   │   ├── oylama-yonetimi/
│   │   ├── yorum-moderasyonu/
│   │   ├── raporlama/
│   │   └── profil/
│   ├── user/              # Kullanıcı sayfaları
│   │   ├── menuler/
│   │   ├── rezervasyonlarim/
│   │   ├── gecmis-menuler/
│   │   ├── oylama/
│   │   ├── anket/
│   │   ├── bildirimler/
│   │   └── profil/
│   ├── reset-password/    # Şifre sıfırlama
│   ├── layout.js          # Root layout
│   ├── page.js            # Login sayfası
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ProtectedRoute.jsx # Route koruma
│   └── Example.jsx
├── contexts/              # React Context
│   └── AuthContext.jsx    # Authentication context
├── services/              # API services
│   └── api.js             # Axios API client
├── lib/                   # Utilities
│   └── schemas/           # Zod validation schemas
└── middleware.js          # Next.js middleware
```

## Kullanılan Teknolojiler

| Teknoloji | Sürüm | Kullanım Alanı |
|-----------|-------|----------------|
| Next.js | 16.0.0 | React framework |
| React | 19.2.0 | UI library |
| Tailwind CSS | 4 | Styling |
| Framer Motion | 12.23.24 | Animations |
| Radix UI | Latest | Accessible components |
| Lucide React | 0.546.0 | Icons |
| Sonner | 2.0.7 | Toast notifications |
| React Hook Form | 7.65.0 | Form management |
| Zod | 4.1.12 | Schema validation |
| Axios | 1.12.2 | HTTP client |
| Recharts | 3.4.1 | Charts & graphs |

## Kurulum ve Çalıştırma

### Ön Gereksinimler

- Node.js v20.19.5 veya üzeri
- npm 10.8.2 veya üzeri

### Kurulum Adımları

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Ortam değişkenlerini yapılandırın
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# 3. Development sunucusunu başlatın
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

### Production Build

```bash
# Production build oluştur
npm run build

# Production server başlat
npm run start
```

### Diğer Komutlar

```bash
npm run lint      # ESLint çalıştır
npm run format    # Kod formatlama (eğer prettier kuruluysa)
```

## Kullanıcı Giriş Bilgileri

### Admin Hesabı
```
Email: admin@taskinnovation.com
Şifre: Taskinnovation1234!
```

### Test Kullanıcıları
```
Email: user1@example.com (veya user2, user3, ... user50)
Şifre: Password123!
```

## Ortam Değişkenleri

`.env.local` dosyası oluşturun:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Production için
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## API Endpoint Kullanımı

### Authentication

```javascript
import { authAPI } from '@/services/api';

// Login
const response = await authAPI.login(email, password);

// Register
await authAPI.register(firstName, lastName, email, password);

// Forgot Password
await authAPI.forgotPassword(email);

// Reset Password
await authAPI.resetPassword(email, token, newPassword, confirmPassword);
```

### Menu Operations

```javascript
import { menuAPI } from '@/services/api';

// Get weekly menu
const weeklyMenu = await menuAPI.getWeekly('current');

// Get today's menu
const todayMenu = await menuAPI.getToday();

// Admin: Get all menus
const allMenus = await menuAPI.getAll();

// Admin: Create menu
await menuAPI.create(menuData);

// Admin: Update menu
await menuAPI.update(id, menuData);

// Admin: Delete menu
await menuAPI.delete(id, force);
```

### Reservation Operations

```javascript
import { reservationAPI } from '@/services/api';

// Get my reservations
const myReservations = await reservationAPI.getMyReservations();

// Create reservation
await reservationAPI.create(menuId);

// Cancel reservation
await reservationAPI.cancel(reservationId);
```

### Feedback Operations

```javascript
import { feedbackAPI } from '@/services/api';

// Submit feedback
await feedbackAPI.submit(menuId, rating, comment);

// Update feedback
await feedbackAPI.update(feedbackId, rating, comment);

// Get my feedback for menu
const myFeedback = await feedbackAPI.getMyFeedback(menuId);
```

### Survey Operations

```javascript
import { surveyAPI } from '@/services/api';

// User: Get active survey
const activeSurvey = await surveyAPI.getActive();

// User: Respond to survey
await surveyAPI.respond(surveyId, answer);

// Admin: Create survey
await surveyAPI.create({ title, question, endDate });

// Admin: Get survey results
const results = await surveyAPI.getResults(surveyId);
```

### Profile & Notifications

```javascript
import { profileAPI, notificationAPI } from '@/services/api';

// Get profile
const profile = await profileAPI.getMe();

// Update profile
await profileAPI.update(profileData);

// Get notifications
const notifications = await notificationAPI.getAll();

// Mark as read
await notificationAPI.markAsRead(notificationId);
```

## Önemli Bileşenler

### ProtectedRoute

Sayfa erişimini rol bazlı kontrol eder:

```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      {/* Admin content */}
    </ProtectedRoute>
  );
}
```

### AuthContext

Authentication state yönetimi:

```jsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? `Welcome ${user.email}` : 'Please login'}
    </div>
  );
}
```

## Sayfa Yapısı

### Public Sayfalar
- `/` - Login sayfası
- `/reset-password` - Şifre sıfırlama

### User Sayfaları (Authenticated)
- `/user` - Dashboard
- `/user/menuler` - Günlük/haftalık menüler
- `/user/rezervasyonlarim` - Rezervasyonlar
- `/user/gecmis-menuler` - Geçmiş menüler
- `/user/oylama` - Menü oylama
- `/user/anket` - Anket katılımı
- `/user/bildirimler` - Bildirimler
- `/user/profil` - Profil güncelleme

### Admin Sayfaları (Admin Role)
- `/admin` - Admin dashboard
- `/admin/menu-yonetimi` - Menü yönetimi
- `/admin/yemek-yonetimi` - Yemek CRUD
- `/admin/oylama-yonetimi` - Anket yönetimi
- `/admin/yorum-moderasyonu` - Geri bildirim moderasyonu
- `/admin/raporlama` - İstatistikler ve raporlar
- `/admin/profil` - Admin profil

## Özellikler

### Kullanıcı Özellikleri
- Modern ve responsive tasarım
- Dark mode desteği (Tailwind CSS)
- Real-time form validasyonu (Zod)
- Toast notifications (Sonner)
- Smooth animations (Framer Motion)
- Accessible components (Radix UI)
- Automatic token refresh
- Protected routes
- Role-based access control

### Developer Experience
- TypeScript-like type safety (JSDoc)
- Hot Module Replacement
- ESLint configuration
- Component-based architecture
- API service layer
- Context-based state management

## Deployment

### Vercel (Önerilen)

1. Vercel hesabınızı GitHub ile bağlayın
2. Repository'yi import edin
3. Environment variables ekleyin:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   ```
4. Deploy edin

### Manuel Deployment

```bash
# Build oluştur
npm run build

# Build çıktısını deploy et (.next ve public klasörleri)
# Node.js server gereklidir
npm run start
```

## Bilinen Sorunlar ve Çözümler

### API Connection Hatası

```bash
# Backend'in çalıştığından emin olun
# .env.local dosyasındaki URL'i kontrol edin
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Token Expiration

Token varsayılan olarak 3 gün geçerlidir. Otomatik logout gerçekleşir.

### CORS Hatası

Backend'de CORS ayarlarını kontrol edin. Frontend URL'i whitelist'e eklenmeli.

## Daha Fazla Bilgi

- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Radix UI: https://www.radix-ui.com

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
- Backend Dokümantasyonu: backend/README.md