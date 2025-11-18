'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/services/api';

export default function MenulerPage() {
  const [currentWeekMenu, setCurrentWeekMenu] = useState([]);
  const [nextWeekMenu, setNextWeekMenu] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState([]);
  const [reserving, setReserving] = useState('');

  useEffect(() => {
    loadMenus();
    loadReservations();
  }, [selectedWeek]);

  // Rezervasyonları yükle
  const loadReservations = async () => {
    try {
      // API çağrısı yapılacak
      // const response = await apiClient.get('/reservations/me');
      // const dates = response.data.data.map(r => r.date);
      // setReservations(dates);

      // Mock data
      setReservations([]);
    } catch (err) {
      console.error('Rezervasyonlar yüklenemedi:', err);
    }
  };

  // Menüleri yükle
  const loadMenus = async () => {
    try {
      setLoading(true);
      setError('');

      // API çağrıları yapılacak
      // const currentResponse = await apiClient.get('/menu/weekly?week=current');
      // const nextResponse = await apiClient.get('/menu/weekly?week=next');
      // setCurrentWeekMenu(currentResponse.data.data || []);
      // setNextWeekMenu(nextResponse.data.data || []);

      // Mock data (API hazır olduğunda yukarıdaki satırları kullan)
      setTimeout(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Pazartesi'ye git
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);

        const mockCurrentWeek = [];
        const mockNextWeek = [];

        for (let i = 0; i < 7; i++) {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];

          mockCurrentWeek.push({
            date: dateStr,
            soup: ['Ezogelin', 'Mercimek', 'Domates', 'Tarhana', 'Yayla', 'Düğün', 'Lentil'][i],
            mainCourse: ['Hünkar Beğendi', 'Izgara Köfte', 'Tavuk Şinitzel', 'Kuru Fasulye', 'Rosto'][i] || 'Yemek',
            sideDish: ['Pilav', 'Makarna', 'Bulgur', 'Salata', 'Zeytinyağlı'][i] || 'Yan Yemek',
            dessert: ['Kazan Dibi', 'Sütlaç', 'Baklava', 'Tulumba', 'Revani'][i] || 'Tatlı',
            calories: 1000 + Math.floor(Math.random() * 300)
          });

          const nextDate = new Date(date);
          nextDate.setDate(date.getDate() + 7);
          const nextDateStr = nextDate.toISOString().split('T')[0];

          mockNextWeek.push({
            date: nextDateStr,
            soup: ['Domates', 'Yayla', 'Ezogelin', 'Mercimek', 'Tarhana', 'Düğün', 'Lentil'][i],
            mainCourse: ['Tavuk Şinitzel', 'Kuru Fasulye', 'Hünkar Beğendi', 'Izgara Köfte', 'Rosto'][i] || 'Yemek',
            sideDish: ['Bulgur', 'Pilav', 'Makarna', 'Salata', 'Zeytinyağlı'][i] || 'Yan Yemek',
            dessert: ['Baklava', 'Kazan Dibi', 'Sütlaç', 'Tulumba', 'Revani'][i] || 'Tatlı',
            calories: 1000 + Math.floor(Math.random() * 300)
          });
        }

        setCurrentWeekMenu(mockCurrentWeek);
        setNextWeekMenu(mockNextWeek);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Menüler yüklenirken bir hata oluştu.');
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

  // Bugün mü kontrolü
  const isToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const weekDays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const selectedMenu = selectedWeek === 'current' ? currentWeekMenu : nextWeekMenu;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Haftalık Menü</h1>
        <p className="text-gray-600">Bu hafta ve gelecek hafta menülerini görüntüleyebilirsiniz</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Hafta Seçimi */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedWeek('current')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedWeek === 'current'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bu Hafta
          </button>
          <button
            onClick={() => setSelectedWeek('next')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedWeek === 'next'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Gelecek Hafta
          </button>
        </div>
      </div>

      {/* Menü Kartları */}
      {selectedMenu.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedMenu.map((menu) => {
            const isTodayMenu = isToday(menu.date);
            return (
              <div
                key={menu.date}
                className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                  isTodayMenu ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                {isTodayMenu && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Bugün
                    </span>
                  </div>
                )}
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {formatDate(menu.date)}
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Çorba:</span>
                    <span className="text-gray-900 font-medium">{menu.soup}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Ana Yemek:</span>
                    <span className="text-gray-900 font-medium">{menu.mainCourse}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Yan Yemek:</span>
                    <span className="text-gray-900 font-medium">{menu.sideDish}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Tatlı:</span>
                    <span className="text-gray-900 font-medium">{menu.dessert}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500 text-xs">Kalori:</span>
                    <span className="text-gray-700 text-xs font-medium">{menu.calories} kcal</span>
                  </div>
                </div>

                {/* Rezervasyon Butonu */}
                {!isTodayMenu && (() => {
                  const isReserved = reservations.includes(menu.date);
                  const isReserving = reserving === menu.date;
                  
                  const handleReservation = async () => {
                    if (isReserved) {
                      // Rezervasyon iptal et
                      try {
                        setReserving(menu.date);
                        // API çağrısı
                        // await apiClient.delete(`/reservations/${menu.date}`);
                        
                        // Mock - iptal et
                        setReservations(prev => prev.filter(d => d !== menu.date));
                        setReserving('');
                        alert('Rezervasyonunuz iptal edildi.');
                      } catch (err) {
                        alert('Rezervasyon iptal edilirken bir hata oluştu.');
                        setReserving('');
                      }
                    } else {
                      // Rezervasyon yap
                      try {
                        setReserving(menu.date);
                        // API çağrısı
                        // await apiClient.post('/reservations', { date: menu.date });
                        
                        // Mock - rezervasyon yap
                        setReservations(prev => [...prev, menu.date]);
                        setReserving('');
                        alert('Rezervasyonunuz başarıyla oluşturuldu!');
                      } catch (err) {
                        alert('Rezervasyon yapılırken bir hata oluştu.');
                        setReserving('');
                      }
                    }
                  };

                  return (
                    <button
                      onClick={handleReservation}
                      disabled={isReserving}
                      className={`mt-4 w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                        isReserved
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isReserving ? 'İşleniyor...' : isReserved ? 'Rezervasyonu İptal Et' : 'Rezervasyon Yap'}
                    </button>
                  );
                })()}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">Bu hafta için menü bulunmamaktadır.</p>
        </div>
      )}
    </div>
  );
}

