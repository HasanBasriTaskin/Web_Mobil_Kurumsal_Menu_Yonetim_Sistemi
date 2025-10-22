# Frontend - Next.js Application

## Proje Yapısı

```
frontend/
├── app/              # Next.js App Router
│   ├── layout.js    # Root layout
│   ├── page.js      # Home page
│   └── globals.css  # Global styles
├── components/       # Reusable UI components
├── services/        # API services (Axios)
├── public/          # Static files
└── package.json     # Dependencies
```

## Kullanılan Teknolojiler

- **Next.js 16** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server başlat
npm run dev

# Production build
npm run build

# Production server
npm run start
```

Development server: [http://localhost:3000](http://localhost:3000)

## Ortam Değişkenleri

`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Geliştirme

- Hot reload otomatik olarak aktiftir
- Tailwind CSS IntelliSense önerilir
- `app/page.js` dosyasını düzenleyerek başlayabilirsiniz

## Deployment

Bu proje Vercel'e deploy edilmek üzere tasarlanmıştır.

Detaylı bilgi için [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) sayfasına bakabilirsiniz.

