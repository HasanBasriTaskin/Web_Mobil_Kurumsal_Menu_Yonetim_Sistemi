'use client';

import Link from 'next/link';

export default function AdminPage() {
  // Örnek veriler (gerçek uygulamada API'den gelecek)
  const stats = {
    todayReservations: 152,
    tomorrowReservations: 98,
    weekReservations: 1245,
    activeMenus: 12,
    totalMeals: 45,
    pendingComments: 8,
    activeVotings: 1,
  };

  const recentActivities = [
    { type: 'comment', text: 'Yeni yorum eklendi - Çalışan #12345', time: '5 dakika önce' },
    { type: 'meal', text: 'Köfte yemeği eklendi', time: '1 saat önce' },
    { type: 'menu', text: 'Haftalık menü yayınlandı', time: '2 saat önce' },
    { type: 'voting', text: 'Yeni oylama başlatıldı', time: '3 saat önce' },
    { type: 'comment', text: 'Yorum onaylandı - Çalışan #67890', time: '4 saat önce' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ana Sayfa</h1>
        <p className="text-gray-600">Sistem özeti ve hızlı erişim</p>
      </div>

      {/* Rezervasyon Raporu - Kritik Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-base font-medium text-gray-900 mb-3">
            Bugün İçin Alınan Toplam Rezervasyon: <span className="text-4xl font-bold text-green-600">{stats.todayReservations}</span> kişi
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-base font-medium text-gray-900 mb-3">
            Yarın İçin Alınan Toplam Rezervasyon: <span className="text-4xl font-bold text-blue-600">{stats.tomorrowReservations}</span> kişi
          </p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Bu Hafta Rezervasyonlar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Bu Hafta</p>
          <p className="text-4xl font-bold text-blue-600 mb-1">{stats.weekReservations.toLocaleString('tr-TR')}</p>
          <p className="text-sm text-gray-500">Toplam Rezervasyon</p>
        </div>

        {/* Aktif Menüler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Aktif Menüler</p>
          <p className="text-4xl font-bold text-purple-600 mb-1">{stats.activeMenus}</p>
          <p className="text-sm text-gray-500">Haftalık Menü</p>
        </div>

        {/* Toplam Yemek */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Toplam Yemek</p>
          <p className="text-4xl font-bold text-indigo-600 mb-1">{stats.totalMeals}</p>
          <p className="text-sm text-gray-500">Sistemdeki Yemek</p>
        </div>

        {/* Bekleyen Yorumlar */}
        <Link
          href="/admin/yorum-moderasyonu"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer block"
        >
          <p className="text-sm font-medium text-gray-600 mb-2">Bekleyen Yorumlar</p>
          <p className="text-4xl font-bold text-yellow-600 mb-1">{stats.pendingComments}</p>
          <p className="text-sm text-gray-500">Moderasyon Gereken</p>
        </Link>
      </div>

      {/* Alt Bölüm - Oylamalar ve Son Aktiviteler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktif Oylamalar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Aktif Oylamalar</h2>
            <Link
              href="/admin/oylama-yonetimi"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Tümünü Gör →
            </Link>
          </div>
          {stats.activeVotings > 0 ? (
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">Gelecek Hafta Yemek Oylaması</p>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    Aktif
                  </span>
                </div>
                <p className="text-sm text-gray-500">5 aday yemek</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aktif oylama bulunmamaktadır.</p>
          )}
        </div>

        {/* Son Aktiviteler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'comment' ? 'bg-yellow-500' :
                    activity.type === 'meal' ? 'bg-green-500' :
                    activity.type === 'menu' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Henüz aktivite bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </div>
  );
}
