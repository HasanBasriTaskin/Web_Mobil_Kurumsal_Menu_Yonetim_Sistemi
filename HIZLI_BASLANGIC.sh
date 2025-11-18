#!/bin/bash

# Hızlı Başlangıç Scripti
# Bu script tüm servisleri başlatır

echo "🚀 Kurumsal Menü Yönetim Sistemi - Hızlı Başlangıç"
echo "=================================================="
echo ""

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# MySQL kontrolü
echo -e "${YELLOW}📊 MySQL kontrol ediliyor...${NC}"
if mysql -u root -e "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✅ MySQL çalışıyor${NC}"
else
    echo -e "${RED}❌ MySQL çalışmıyor! Lütfen MySQL'i başlatın:${NC}"
    echo "   macOS: brew services start mysql"
    echo "   Linux: sudo systemctl start mysql"
    exit 1
fi

# Veritabanı kontrolü
echo -e "${YELLOW}🗄️  Veritabanı kontrol ediliyor...${NC}"
if mysql -u root -e "USE KurumsalMenuDb" &> /dev/null; then
    echo -e "${GREEN}✅ Veritabanı mevcut${NC}"
else
    echo -e "${YELLOW}⚠️  Veritabanı bulunamadı, oluşturuluyor...${NC}"
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS KurumsalMenuDb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo -e "${GREEN}✅ Veritabanı oluşturuldu${NC}"
fi

# Backend kontrolü
echo -e "${YELLOW}🔧 Backend kontrol ediliyor...${NC}"
if command -v dotnet &> /dev/null; then
    echo -e "${GREEN}✅ .NET SDK yüklü${NC}"
else
    echo -e "${RED}❌ .NET SDK bulunamadı! Lütfen yükleyin: https://dotnet.microsoft.com/download${NC}"
    exit 1
fi

# Frontend kontrolü
echo -e "${YELLOW}🎨 Frontend kontrol ediliyor...${NC}"
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js yüklü ($(node --version))${NC}"
else
    echo -e "${RED}❌ Node.js bulunamadı! Lütfen yükleyin: https://nodejs.org${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Tüm gereksinimler karşılandı!${NC}"
echo ""
echo "📝 Servisleri başlatmak için:"
echo ""
echo "   1️⃣  Backend için:"
echo "      cd backend/CorporateMenuManagementSystem.API"
echo "      dotnet run"
echo ""
echo "   2️⃣  Frontend için (yeni terminal):"
echo "      cd frontend"
echo "      npm run dev"
echo ""
echo "🌐 Erişim adresleri:"
echo "   - Backend API: http://localhost:5150"
echo "   - Swagger UI: http://localhost:5150/swagger"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "🔑 Admin Giriş Bilgileri:"
echo "   Email: admin@taskinnovation.com"
echo "   Password: Taskinnovation1234!"
echo ""


