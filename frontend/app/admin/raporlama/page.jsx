'use client';

import { useState, useEffect } from 'react';
import { feedbackAPI, menuAPI, reservationAPI } from '@/services/api';

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
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWeek, setFilterWeek] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' veya 'popularity'
  
  // Rezervasyon state'leri
  const [reservationSummary, setReservationSummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyReservations, setDailyReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  
  // En yüksek puanlı menüler state
  const [topRatedMenus, setTopRatedMenus] = useState([]);
  const [topRatedCount, setTopRatedCount] = useState(5);
  const [topRatedLoading, setTopRatedLoading] = useState(false);

  useEffect(() => {
    loadReportData();
    loadReservationSummary();
    loadTopRatedMenus();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadDailyReservations(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadTopRatedMenus();
  }, [topRatedCount]);

  // Raporlama datasını yükle
  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // Backend'den tüm feedback'leri al
      const feedbackResponse = await feedbackAPI.getAll();
      
      if (feedbackResponse.isSuccessful && feedbackResponse.data) {
        // Feedback'leri menü ID'sine göre gruplayıp aggregate et
        const menuMap = new Map();
        
        feedbackResponse.data.forEach(feedback => {
          const menuId = feedback.menuId;
          const menuDate = feedback.menu?.menuDate;
          
          if (!menuMap.has(menuId)) {
            menuMap.set(menuId, {
              id: menuId,
              date: menuDate,
              ratings: [],
              menu: feedback.menu
            });
          }
          
          const menuData = menuMap.get(menuId);
          if (feedback.rating) {
            menuData.ratings.push(feedback.rating);
          }
        });
        
        // Aggregate edilmiş datayı hazırla
        const aggregatedData = [];
        
        for (const menu of Array.from(menuMap.values())) {
          if (menu.ratings.length === 0 || !menu.date) continue;
          
          const dateObj = new Date(menu.date);
          const isValidDate = !isNaN(dateObj.getTime());
          
          if (isValidDate) {
            aggregatedData.push({
              id: menu.id,
              date: dateObj.toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                weekday: 'long'
              }),
              averageRating: parseFloat((menu.ratings.reduce((a, b) => a + b, 0) / menu.ratings.length).toFixed(1)),
              totalRatings: menu.ratings.length,
              week: getWeekNumber(dateObj),
              items: `${menu.menu?.soup || ''}, ${menu.menu?.mainCourse || ''}, ${menu.menu?.sideDish || ''}, ${menu.menu?.dessert || ''}`.replace(/(^,\s*)|(,\s*$)/g, '').replace(/,\s*,/g, ',')
            });
          }
        }
        
        setMenuData(aggregatedData);
      } else {
        setMenuData([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Raporlama datası yükleme hatası:', err);
      setMenuData([]);
      setLoading(false);
    }
  };

  // Tarihten hafta numarası hesapla
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return `${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}. Hafta`;
  };

  // Rezervasyon özetini yükle (Bugün ve Yarın)
  const loadReservationSummary = async () => {
    try {
      const response = await reservationAPI.getSummary();
      
      if (response.success || response.isSuccessful) {
        setReservationSummary(response.data);
      }
    } catch (err) {
      console.error('Rezervasyon özeti yükleme hatası:', err);
    }
  };

  // Belirli bir günün rezervasyonlarını yükle
  const loadDailyReservations = async (date) => {
    try {
      setReservationsLoading(true);
      const response = await reservationAPI.getDaily(date);
      
      if (response.success || response.isSuccessful) {
        setDailyReservations(response.data || []);
      } else {
        setDailyReservations([]);
      }
    } catch (err) {
      console.error('Günlük rezervasyonlar yükleme hatası:', err);
      setDailyReservations([]);
    } finally {
      setReservationsLoading(false);
    }
  };

  // En yüksek puanlı menüleri yükle
  const loadTopRatedMenus = async () => {
    try {
      setTopRatedLoading(true);
      const response = await menuAPI.getTopRated(topRatedCount);
      
      if (response.success || response.isSuccessful) {
        setTopRatedMenus(response.data || []);
      } else {
        setTopRatedMenus([]);
      }
    } catch (err) {
      console.error('En yüksek puanlı menüler yükleme hatası:', err);
      setTopRatedMenus([]);
    } finally {
      setTopRatedLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

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
  const overallAverage = menuData.length > 0 
    ? menuData.reduce((sum, menu) => sum + (parseFloat(menu.averageRating) || 0), 0) / menuData.length 
    : 0;
  const totalRatings = menuData.reduce((sum, menu) => sum + (menu.totalRatings || 0), 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlama & İstatistikler</h1>
        <p className="text-gray-600">Rezervasyonlar, menü değerlendirmeleri ve puan ortalamalarını görüntüleyin</p>
      </div>

      {/* Rezervasyon Özeti */}
      {reservationSummary && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rezervasyon Özeti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Bugünkü Rezervasyonlar</p>
                  <p className="text-4xl font-bold">{reservationSummary.todayCount || 0}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-blue-100 text-sm">
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Yarınki Rezervasyonlar</p>
                  <p className="text-4xl font-bold">{reservationSummary.tomorrowCount || 0}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-purple-100 text-sm">
                {new Date(Date.now() + 86400000).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Günlük Rezervasyon Detayları */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Günlük Rezervasyon Detayları</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          
          {reservationsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Yükleniyor...</p>
            </div>
          ) : dailyReservations.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 font-medium">Bu tarih için rezervasyon bulunmuyor</p>
              <p className="text-gray-500 text-sm mt-1">Farklı bir tarih seçerek kontrol edebilirsiniz</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-900 font-semibold">
                  Toplam {dailyReservations.length} rezervasyon bulundu
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dailyReservations.map((reservation, index) => (
                  <div key={reservation.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{reservation.userFirstName} {reservation.userLastName}</p>
                        {reservation.mainCourse && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Menü:</span> {reservation.mainCourse}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            reservation.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            reservation.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {reservation.status === 'Confirmed' ? 'Onaylandı' :
                             reservation.status === 'Pending' ? 'Beklemede' : 
                             reservation.status || 'Aktif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Değerlendirmeler */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Değerlendirmeler</h2>
            <select
              value={topRatedCount}
              onChange={(e) => setTopRatedCount(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            >
              <option value="3">İlk 3</option>
              <option value="5">İlk 5</option>
              <option value="10">İlk 10</option>
              <option value="20">İlk 20</option>
            </select>
          </div>
          
          {topRatedLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Yükleniyor...</p>
            </div>
          ) : topRatedMenus.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p className="text-gray-600 font-medium">Henüz puanlanmış menü bulunmuyor</p>
              <p className="text-gray-500 text-sm mt-1">Kullanıcılar menüleri değerlendirdikçe burada görünecektir</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çorba</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ana Yemek</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Garnitür</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tatlı</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Puan</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topRatedMenus.map((menu, index) => (
                    <tr key={menu.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(menu.menuDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(menu.menuDate).toLocaleDateString('tr-TR', { weekday: 'long' })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{menu.soup || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{menu.mainCourse || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{menu.sideDish || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{menu.dessert || '-'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="text-lg font-bold text-green-600">{(menu.averageRating || 0).toFixed(1)}</div>
                        <div className="text-xs text-gray-500">{menu.totalFeedbacks || 0} oy</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

