'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/services/api';

export default function GecmisMenulerPage() {
  const [pastMenus, setPastMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(null); // Seçili hafta (1, 2, 3, 4)

  useEffect(() => {
    loadPastMenus();
  }, [selectedMonth]);

  // Menüler yüklendikten sonra ilk haftayı varsayılan olarak seç
  useEffect(() => {
    if (pastMenus.length > 0 && selectedWeek === null) {
      setSelectedWeek(1);
    }
  }, [pastMenus]);

  // Geçmiş menüleri yükle
  const loadPastMenus = async () => {
    try {
      setLoading(true);
      setError('');

      // API çağrısı yapılacak
      // const response = await apiClient.get(`/menu/past?month=${selectedMonth}`);
      // setPastMenus(response.data.data || []);

      // Mock data (API hazır olduğunda yukarıdaki satırları kullan)
      setTimeout(() => {
        const today = new Date();
        const mockMenus = [];

        // Son 4 haftanın menülerini oluştur (Hafta 1 = en eski, Hafta 4 = en yeni)
        for (let week = 1; week <= 4; week++) {
          const weekStart = new Date(today);
          // Ters sıralama: Hafta 1 en eski olacak şekilde
          const weeksAgo = (5 - week); // week=1 → 4 hafta önce, week=4 → 1 hafta önce
          weekStart.setDate(today.getDate() - (weeksAgo * 7));
          const dayOfWeek = weekStart.getDay();
          const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
          const monday = new Date(weekStart);
          monday.setDate(weekStart.getDate() + diff);

          const weekMenus = [];
          // Sadece Pazartesi - Cumartesi (6 gün)
          for (let i = 0; i < 6; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            weekMenus.push({
              date: dateStr,
              soup: ['Ezogelin', 'Mercimek', 'Domates', 'Tarhana', 'Yayla', 'Düğün'][i],
              mainCourse: ['Hünkar Beğendi', 'Izgara Köfte', 'Tavuk Şinitzel', 'Kuru Fasulye', 'Rosto', 'Yemek'][i],
              sideDish: ['Pilav', 'Makarna', 'Bulgur', 'Salata', 'Zeytinyağlı', 'Yan Yemek'][i],
              dessert: ['Kazan Dibi', 'Sütlaç', 'Baklava', 'Tulumba', 'Revani', 'Tatlı'][i],
              calories: 1000 + Math.floor(Math.random() * 300),
              averageRating: (3 + Math.random() * 2).toFixed(1),
              totalReviews: Math.floor(Math.random() * 50) + 10
            });
          }

          mockMenus.push({
            week: `Hafta ${week}`,
            weekStart: monday.toISOString().split('T')[0],
            menus: weekMenus
          });
        }

        setPastMenus(mockMenus);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Geçmiş menüler yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  // Tarihi Türkçe formatında göster
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Hafta aralığını göster
  const getWeekRange = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}-${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`;
    } else {
      return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${start.getFullYear()}`;
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Geçmiş Menüler</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Hafta Butonları */}
      {pastMenus.length > 0 && (
        <div className="mb-4 sm:mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {pastMenus.map((weekMenu, index) => {
              const weekNumber = index + 1;
              const isSelected = selectedWeek === weekNumber;
              return (
                <button
                  key={weekNumber}
                  onClick={() => setSelectedWeek(weekNumber)}
                  className={`px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {weekMenu.week} {getWeekRange(weekMenu.weekStart)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Geçmiş Haftalar */}
      {pastMenus.length > 0 ? (
        <div className="space-y-6">
          {pastMenus
            .filter((weekMenu, index) => selectedWeek === index + 1)
            .map((weekMenu, weekIndex) => (
            <div key={weekIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{weekMenu.week}</h2>
                <p className="text-xs sm:text-sm text-gray-500">{getWeekRange(weekMenu.weekStart)}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {weekMenu.menus.map((menu) => (
                  <div
                    key={menu.date}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {formatDate(menu.date)}
                    </h3>

                    <div className="space-y-1 text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Çorba:</span>
                        <span className="text-gray-900 font-medium">{menu.soup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ana:</span>
                        <span className="text-gray-900 font-medium truncate ml-2">{menu.mainCourse}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Yan:</span>
                        <span className="text-gray-900 font-medium truncate ml-2">{menu.sideDish}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tatlı:</span>
                        <span className="text-gray-900 font-medium truncate ml-2">{menu.dessert}</span>
                      </div>
                    </div>

                    {/* Puan ve Yorum Sayısı */}
                    {menu.averageRating && (
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-700">{menu.averageRating}</span>
                          </div>
                          <span className="text-xs text-gray-500">({menu.totalReviews} değerlendirme)</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">Geçmiş menü bulunmamaktadır.</p>
        </div>
      )}
    </div>
  );
}

