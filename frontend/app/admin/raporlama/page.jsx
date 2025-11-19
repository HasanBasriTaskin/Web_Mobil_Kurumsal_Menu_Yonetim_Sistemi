'use client';

import { useState } from 'react';

// Örnek günlük menü değerlendirmeleri (gerçek uygulamada API'den gelecek)
const menuData = [
  { 
    id: 1, 
    date: '20 Ocak 2025 - Pazartesi', 
    averageRating: 4.8, 
    totalRatings: 125, 
    week: '3. Hafta',
    items: 'Mercimek Çorbası, Tavuk Döner, Pilav, Salata, Ayran'
  },
  { 
    id: 2, 
    date: '18 Ocak 2025 - Cumartesi', 
    averageRating: 4.2, 
    totalRatings: 87, 
    week: '3. Hafta',
    items: 'Yayla Çorbası, Tavuk Şinitzel, Patates Kızartması, Turşu, Meyve'
  },
  { 
    id: 3, 
    date: '17 Ocak 2025 - Cuma', 
    averageRating: 3.9, 
    totalRatings: 112, 
    week: '3. Hafta',
    items: 'Tarhana Çorbası, Sebze Güveç, Bulgur Pilavı, Yoğurt, Kek'
  },
  { 
    id: 4, 
    date: '16 Ocak 2025 - Perşembe', 
    averageRating: 3.5, 
    totalRatings: 76, 
    week: '3. Hafta',
    items: 'Domates Çorbası, Balık, Patates Püresi, Coleslaw Salata, Su'
  },
  { 
    id: 5, 
    date: '15 Ocak 2025 - Çarşamba', 
    averageRating: 4.6, 
    totalRatings: 94, 
    week: '3. Hafta',
    items: 'Sebze Çorbası, Karnıyarık, Pilav, Haydari, Baklava'
  },
  { 
    id: 6, 
    date: '14 Ocak 2025 - Salı', 
    averageRating: 4.9, 
    totalRatings: 68, 
    week: '2. Hafta',
    items: 'Mercimek Çorbası, Izgara Tavuk, Makarna, Yeşil Salata, Ayran'
  },
  { 
    id: 7, 
    date: '13 Ocak 2025 - Pazartesi', 
    averageRating: 4.3, 
    totalRatings: 82, 
    week: '2. Hafta',
    items: 'Düğün Çorbası, Etli Kuru Fasulye, Pilav, Turşu, Komposto'
  },
];

export default function RaporlamaPage() {
  const [filterWeek, setFilterWeek] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' veya 'popularity'

  // Haftalara göre filtreleme
  const weeks = ['all', ...new Set(menuData.map(menu => menu.week))];
  
  const filteredMenus = menuData.filter(menu => 
    filterWeek === 'all' || menu.week === filterWeek
  );

  // Sıralama
  const sortedMenus = [...filteredMenus].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.averageRating - a.averageRating;
    } else {
      return b.totalRatings - a.totalRatings;
    }
  });

  // En sevilen ve sevilmeyen menüler
  const topMenus = sortedMenus.slice(0, 5);
  const bottomMenus = [...sortedMenus].reverse().slice(0, 5);

  // Genel istatistikler
  const overallAverage = menuData.reduce((sum, menu) => sum + menu.averageRating, 0) / menuData.length;
  const totalRatings = menuData.reduce((sum, menu) => sum + menu.totalRatings, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlama</h1>
        <p className="text-gray-600">Günün menüsüne göre değerlendirmeleri ve puan ortalamalarını görüntüleyin</p>
      </div>

      {/* Genel İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Genel Ortalama Puan</p>
          <p className="text-4xl font-bold text-green-600">{overallAverage.toFixed(1)}</p>
          <p className="text-xs text-gray-500 mt-1">Günün menüsü değerlendirmeleri</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Toplam Değerlendirme</p>
          <p className="text-4xl font-bold text-blue-600">{totalRatings}</p>
          <p className="text-xs text-gray-500 mt-1">Günün menüsü yorumları</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Toplam Günlük Menü</p>
          <p className="text-4xl font-bold text-purple-600">{menuData.length}</p>
          <p className="text-xs text-gray-500 mt-1">Değerlendirilen gün</p>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hafta Filtresi
            </label>
            <select
              value={filterWeek}
              onChange={(e) => setFilterWeek(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            >
              {weeks.map(week => (
                <option key={week} value={week}>
                  {week === 'all' ? 'Tüm Haftalar' : week}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sıralama
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            >
              <option value="rating">Puana Göre</option>
              <option value="popularity">Popülerliğe Göre</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* En Sevilen Menüler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">En Sevilen Günün Menüleri</h2>
          <div className="space-y-4">
            {topMenus.map((menu, index) => (
              <div key={menu.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-1">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{menu.date}</p>
                      <p className="text-xs text-gray-500 mb-2">{menu.week}</p>
                      <div className="bg-gray-50 rounded-lg p-2 mb-2">
                        <p className="text-xs text-gray-700">
                          <span className="font-medium">Menü: </span>{menu.items}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-lg font-bold text-green-600">{menu.averageRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">{menu.totalRatings} oy</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(menu.averageRating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* En Sevilmeyen Menüler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">En Sevilmeyen Günün Menüleri</h2>
          <div className="space-y-4">
            {bottomMenus.map((menu, index) => (
              <div key={menu.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold mt-1">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{menu.date}</p>
                      <p className="text-xs text-gray-500 mb-2">{menu.week}</p>
                      <div className="bg-gray-50 rounded-lg p-2 mb-2">
                        <p className="text-xs text-gray-700">
                          <span className="font-medium">Menü: </span>{menu.items}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-lg font-bold text-red-600">{menu.averageRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">{menu.totalRatings} oy</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${(menu.averageRating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detaylı Menü Listesi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Tüm Günün Menüleri - Değerlendirme Puanları</h2>
        <div className="space-y-4">
          {sortedMenus.map((menu) => (
            <div key={menu.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-base font-semibold text-gray-900">{menu.date}</p>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {menu.week}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 mb-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-blue-900">Menü İçeriği: </span>
                      {menu.items}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">{menu.totalRatings} kullanıcı değerlendirmesi</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-gray-900">{menu.averageRating.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">/ 5.0</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    menu.averageRating >= 4.5 ? 'bg-green-600' :
                    menu.averageRating >= 4.0 ? 'bg-blue-600' :
                    menu.averageRating >= 3.5 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${(menu.averageRating / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
