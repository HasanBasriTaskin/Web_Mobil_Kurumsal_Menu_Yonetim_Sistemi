'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/services/api';

export default function MenulerPage() {
  const [currentWeekMenu, setCurrentWeekMenu] = useState([]);
  const [nextWeekMenu, setNextWeekMenu] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [viewMode, setViewMode] = useState('week'); // 'week', 'list', 'daily'
  const [selectedDate, setSelectedDate] = useState(null); // Günlük görünüm için
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState([]);
  const [reserving, setReserving] = useState('');
  const [showReservationConfirm, setShowReservationConfirm] = useState(false); // Onay kutusu için state
  const [pendingReservation, setPendingReservation] = useState(null); // Bekleyen rezervasyon işlemi {date, action: 'create' | 'cancel'}

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

      // Mock data - localStorage'dan yükle
      const savedReservations = localStorage.getItem('user_reservations');
      if (savedReservations) {
        setReservations(JSON.parse(savedReservations));
      } else {
        setReservations([]);
      }
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

        // Pazartesi'den Cumartesi'ye kadar (Pazar hariç - 6 gün)
        for (let i = 0; i < 6; i++) {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          
          // 23 Kasım kontrolü
          let soup = ['Ezogelin', 'Mercimek', 'Domates', 'Tarhana', 'Yayla', 'Düğün'][i];
          if (date.getDate() === 23 && date.getMonth() === 10) { // Kasım = 10 (0-indexed)
            soup = 'Yayla Çorbası'; // 23 Kasım için özel çorba
          }

          mockCurrentWeek.push({
            date: dateStr,
            soup: soup,
            mainCourse: ['Hünkar Beğendi', 'Izgara Köfte', 'Tavuk Şinitzel', 'Kuru Fasulye', 'Rosto', 'Tavuk Sote'][i] || 'Yemek',
            sideDish: ['Pilav', 'Makarna', 'Bulgur', 'Salata', 'Zeytinyağlı', 'Patates'][i] || 'Yan Yemek',
            dessert: ['Kazan Dibi', 'Sütlaç', 'Baklava', 'Tulumba', 'Revani', 'Keşkül'][i] || 'Tatlı',
            beverage: ['Ayran', 'Meyve Suyu', 'Su', 'Komposto', 'Şalgam', 'Ayran'][i] || 'İçecek',
            calories: 1000 + Math.floor(Math.random() * 300)
          });

          const nextDate = new Date(date);
          nextDate.setDate(date.getDate() + 7);
          const nextDateStr = nextDate.toISOString().split('T')[0];

          mockNextWeek.push({
            date: nextDateStr,
            soup: ['Domates', 'Yayla', 'Ezogelin', 'Mercimek', 'Tarhana', 'Düğün'][i],
            mainCourse: ['Tavuk Şinitzel', 'Kuru Fasulye', 'Hünkar Beğendi', 'Izgara Köfte', 'Rosto', 'Sebze Güveç'][i] || 'Yemek',
            sideDish: ['Bulgur', 'Pilav', 'Makarna', 'Salata', 'Zeytinyağlı', 'Patates'][i] || 'Yan Yemek',
            dessert: ['Baklava', 'Kazan Dibi', 'Sütlaç', 'Tulumba', 'Revani', 'Muhallebi'][i] || 'Tatlı',
            beverage: ['Komposto', 'Ayran', 'Meyve Suyu', 'Su', 'Şalgam', 'Ayran'][i] || 'İçecek',
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

  // Gelecek gün mü kontrolü (bugün ve geçmiş günler için false)
  const isFutureDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const menuDate = new Date(dateStr);
    menuDate.setHours(0, 0, 0, 0);
    return menuDate > today;
  };

  // Rezervasyon yapılabilir mi kontrolü
  // Bugün için yemek saatinden 1 saat öncesine kadar, gelecek tarihler için her zaman yapılabilir
  const canMakeReservation = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Gelecek tarihler için rezervasyon yapılabilir
    if (isFutureDate(dateStr)) {
      return true;
    }
    
    // Bugün için yemek saatinden 1 saat öncesine kadar rezervasyon yapılabilir
    if (dateStr === today) {
      const now = new Date();
      const reservationDeadline = new Date();
      reservationDeadline.setHours(10, 30, 0, 0); // Sabah 10:30 (yemek 11:30'da başlıyor, 1 saat öncesi)
      
      return now < reservationDeadline;
    }
    
    // Geçmiş tarihler için rezervasyon yapılamaz
    return false;
  };

  // İptal edilebilir mi kontrol et (bugün için belirli saate kadar)
  // Öğlen yemeği 11:30 - 14:00 arası, iptal için son saat: 10:30 (11:30'dan 1 saat önce)
  const canCancel = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Bugün değilse her zaman iptal edilebilir
    if (dateStr !== today) return true;
    
    // Bugün ise saat 10:30'u geçtiyse iptal edilemez
    const now = new Date();
    const cancelDeadline = new Date();
    cancelDeadline.setHours(10, 30, 0, 0); // Sabah 10:30 (yemek 11:30'da başlıyor)
    
    return now < cancelDeadline;
  };

  // Rezervasyon onayını göster
  const handleReservationClick = (date, action) => {
    setPendingReservation({ date, action });
    setShowReservationConfirm(true);
  };

  // Rezervasyon işlemini onayla ve yap
  const handleConfirmReservation = async () => {
    if (!pendingReservation) return;

    const { date, action } = pendingReservation;
    setShowReservationConfirm(false);
    setReserving(date);

    try {
      if (action === 'cancel') {
        // Önce saat kontrolü yap
        if (!canCancel(date)) {
          setReserving('');
          return;
        }
        
        // API çağrısı
        // await apiClient.delete(`/reservations/${date}`);
        
        // Mock - iptal et
        setReservations(prev => {
          const updated = prev.filter(d => d !== date);
          localStorage.setItem('user_reservations', JSON.stringify(updated));
          // Custom event dispatch (aynı sayfa içi güncellemeler için)
          window.dispatchEvent(new Event('reservationUpdated'));
          return updated;
        });
        setReserving('');
      } else {
        // API çağrısı
        // await apiClient.post('/reservations', { date });
        
        // Mock - rezervasyon yap
        setReservations(prev => {
          const updated = [...prev, date];
          localStorage.setItem('user_reservations', JSON.stringify(updated));
          // Custom event dispatch (aynı sayfa içi güncellemeler için)
          window.dispatchEvent(new Event('reservationUpdated'));
          return updated;
        });
        setReserving('');
      }
    } catch (err) {
      console.error('Rezervasyon işlemi sırasında bir hata oluştu:', err);
      setReserving('');
    }
    
    setPendingReservation(null);
  };

  const weekDays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const selectedMenu = selectedWeek === 'current' ? currentWeekMenu : nextWeekMenu;
  
  // Günlük görünüm için menü seç
  useEffect(() => {
    if (viewMode === 'daily' && selectedMenu.length > 0 && !selectedDate) {
      // Bugünün menüsünü varsayılan olarak seç
      const today = new Date().toISOString().split('T')[0];
      const todayMenu = selectedMenu.find(m => m.date === today);
      setSelectedDate(todayMenu ? todayMenu.date : selectedMenu[0].date);
    }
    // selectedMenu değiştiğinde ve günlük görünüm aktifse güncelle
    if (viewMode === 'daily' && selectedMenu.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayMenu = selectedMenu.find(m => m.date === today);
      if (!selectedDate || !selectedMenu.find(m => m.date === selectedDate)) {
        setSelectedDate(todayMenu ? todayMenu.date : selectedMenu[0].date);
      }
    }
  }, [viewMode, selectedWeek]); // selectedWeek değiştiğinde tetiklenir

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
    <div className="p-8 relative">
      {/* Onay Mesajı Modal */}
      {showReservationConfirm && pendingReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mb-4 text-yellow-600">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {pendingReservation.action === 'cancel' ? 'Rezervasyonu İptal Et' : 'Rezervasyon Yap'}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {pendingReservation.action === 'cancel' 
                  ? `Bu rezervasyonu iptal etmek istediğinize emin misiniz?`
                  : `Bu tarih için rezervasyon yapmak istediğinize emin misiniz?`}
              </p>
              <p className="text-xs text-gray-500 mb-6">
                {formatDate(pendingReservation.date)}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowReservationConfirm(false);
                    setPendingReservation(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hayır
                </button>
                <button
                  onClick={handleConfirmReservation}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    pendingReservation.action === 'cancel'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {pendingReservation.action === 'cancel' ? 'Evet, İptal Et' : 'Evet, Rezervasyon Yap'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Haftalık Menü</h1>
        <p className="text-gray-600">Bu hafta ve gelecek hafta menülerini görüntüleyebilirsiniz</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Görünüm Modları */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setViewMode('week')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Haftalık Görünüm
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Liste Görünümü
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Günlük Görünüm
          </button>
        </div>

        {/* Hafta Seçimi */}
        <div className="flex gap-4 border-t border-gray-200 pt-4">
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

      {/* Menü Görünümleri */}
      {selectedMenu.length > 0 ? (
        <>
          {/* Haftalık Görünüm */}
          {viewMode === 'week' && (
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
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">İçecek:</span>
                    <span className="text-gray-900 font-medium">{menu.beverage}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500 text-xs">Kalori:</span>
                    <span className="text-gray-700 text-xs font-medium">{menu.calories} kcal</span>
                  </div>
                </div>

                {/* Rezervasyon Butonu - Sadece haftalık görünümde */}
                {viewMode === 'week' && canMakeReservation(menu.date) && (() => {
                  const isReserved = reservations.includes(menu.date);
                  const isReserving = reserving === menu.date;
                  const cancelable = isReserved ? canCancel(menu.date) : true;
                  
                  const handleReservation = () => {
                    if (isReserved) {
                      // Önce saat kontrolü yap
                      if (!canCancel(menu.date)) {
                        return;
                      }
                      handleReservationClick(menu.date, 'cancel');
                    } else {
                      handleReservationClick(menu.date, 'create');
                    }
                  };

                  return (
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={handleReservation}
                        disabled={isReserving || (isReserved && !cancelable)}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                          isReserved
                            ? cancelable
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isReserving ? 'İşleniyor...' : 
                         isReserved ? (cancelable ? 'Rezervasyonu İptal Et' : 'İptal Edilemez') : 
                         'Rezervasyon Yap'}
                      </button>
                      {isReserved && !cancelable && (
                        <p className="text-xs text-gray-500 text-center">
                          İptal için son saat geçti (10:30)
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}
            </div>
          )}

          {/* Liste Görünümü */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {selectedMenu.map((menu) => {
                const isTodayMenu = isToday(menu.date);
                const isReserved = reservations.includes(menu.date);
                const cancelable = isReserved ? canCancel(menu.date) : true;

                return (
                  <div
                    key={menu.date}
                    className={`p-6 ${isTodayMenu ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      {/* Sol Taraf - Tarih ve Menü */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formatDate(menu.date)}
                          </h3>
                          {isTodayMenu && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              Bugün
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 w-24">Çorba:</span>
                            <span className="text-gray-900 font-medium">{menu.soup}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 w-24">Ana Yemek:</span>
                            <span className="text-gray-900 font-medium">{menu.mainCourse}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 w-24">Yan Yemek:</span>
                            <span className="text-gray-900 font-medium">{menu.sideDish}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 w-24">Tatlı:</span>
                            <span className="text-gray-900 font-medium">{menu.dessert}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 w-24">İçecek:</span>
                            <span className="text-gray-900 font-medium">{menu.beverage}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-gray-500 text-xs">Kalori:</span>
                            <span className="text-gray-700 text-xs font-medium">{menu.calories} kcal</span>
                          </div>
                        </div>
                      </div>

                      {/* Sağ Taraf - Rezervasyon Butonu - Sadece haftalık görünümde */}
                      {viewMode === 'week' && canMakeReservation(menu.date) && (
                        <div className="flex-shrink-0">
                          {(() => {
                            const handleReservation = async () => {
                              if (isReserved) {
                                if (!canCancel(menu.date)) {
                                  return;
                                }
                                try {
                                  setReserving(menu.date);
                                  setReservations(prev => prev.filter(d => d !== menu.date));
                                  setReserving('');
                                } catch (err) {
                                  console.error('Rezervasyon iptal edilirken bir hata oluştu:', err);
                                  setReserving('');
                                }
                              } else {
                                try {
                                  setReserving(menu.date);
                                  setReservations(prev => [...prev, menu.date]);
                                  setReserving('');
                                } catch (err) {
                                  console.error('Rezervasyon yapılırken bir hata oluştu:', err);
                                  setReserving('');
                                }
                              }
                            };

                            return (
                              <button
                                onClick={handleReservation}
                                disabled={reserving === menu.date || (isReserved && !cancelable)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
                                  isReserved
                                    ? cancelable
                                      ? 'bg-red-600 text-white hover:bg-red-700'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {reserving === menu.date ? 'İşleniyor...' : 
                                 isReserved ? (cancelable ? 'İptal Et' : 'İptal Edilemez') : 
                                 'Rezervasyon Yap'}
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Günlük Görünüm */}
          {viewMode === 'daily' && (
            <div className="space-y-6">
              {/* Gün Seçici */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedMenu.map((menu) => {
                    const isTodayMenu = isToday(menu.date);
                    const isSelected = selectedDate === menu.date;
                    return (
                      <button
                        key={menu.date}
                        onClick={() => setSelectedDate(menu.date)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : isTodayMenu
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {formatDate(menu.date)}
                        {isTodayMenu && ' (Bugün)'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seçili Günün Menüsü */}
              {selectedDate && (() => {
                const menu = selectedMenu.find(m => m.date === selectedDate);
                if (!menu) return null;
                const isTodayMenu = isToday(menu.date);
                const isReserved = reservations.includes(menu.date);
                const cancelable = isReserved ? canCancel(menu.date) : true;

                return (
                  <div className="bg-white rounded-lg shadow-sm border-2 border-blue-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {formatDate(menu.date)}
                      </h2>
                      {isTodayMenu && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          Bugün
                        </span>
                      )}
                    </div>

                    <div className="space-y-6">
                      {/* Menü Detayları */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">🍲</span>
                              <span className="text-sm font-medium text-gray-600">Çorba</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{menu.soup}</p>
                          </div>

                          <div className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">🍽️</span>
                              <span className="text-sm font-medium text-gray-600">Ana Yemek</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{menu.mainCourse}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">🥗</span>
                              <span className="text-sm font-medium text-gray-600">Yan Yemek</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{menu.sideDish}</p>
                          </div>

                          <div className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">🍰</span>
                              <span className="text-sm font-medium text-gray-600">Tatlı</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{menu.dessert}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Toplam Kalori:</span>
                          <span className="text-lg font-semibold text-gray-900">{menu.calories} kcal</span>
                        </div>
                      </div>

                      {/* Rezervasyon Butonu - Sadece haftalık görünümde */}
                      {viewMode === 'week' && canMakeReservation(menu.date) && (
                        <div className="pt-4 border-t border-gray-200">
                          {(() => {
                            const handleReservation = async () => {
                              if (isReserved) {
                                if (!canCancel(menu.date)) {
                                  return;
                                }
                                try {
                                  setReserving(menu.date);
                                  setReservations(prev => prev.filter(d => d !== menu.date));
                                  setReserving('');
                                } catch (err) {
                                  console.error('Rezervasyon iptal edilirken bir hata oluştu:', err);
                                  setReserving('');
                                }
                              } else {
                                try {
                                  setReserving(menu.date);
                                  setReservations(prev => [...prev, menu.date]);
                                  setReserving('');
                                } catch (err) {
                                  console.error('Rezervasyon yapılırken bir hata oluştu:', err);
                                  setReserving('');
                                }
                              }
                            };

                            return (
                              <button
                                onClick={handleReservation}
                                disabled={reserving === menu.date || (isReserved && !cancelable)}
                                className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                                  isReserved
                                    ? cancelable
                                      ? 'bg-red-600 text-white hover:bg-red-700'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {reserving === menu.date ? 'İşleniyor...' : 
                                 isReserved ? (cancelable ? 'Rezervasyonu İptal Et' : 'İptal Edilemez') : 
                                 'Rezervasyon Yap'}
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">Bu hafta için menü bulunmamaktadır.</p>
        </div>
      )}
    </div>
  );
}

