'use client';

import { useState, useEffect } from 'react';
import { reservationAPI, menuAPI } from '@/services/api';

export default function RezervasyonlarimPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [cancelling, setCancelling] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [pendingCancel, setPendingCancel] = useState(null);
  const [cancelMessage, setCancelMessage] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  // Rezervasyonları yükle
  const loadReservations = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await reservationAPI.getMyReservations();
      console.log('Backend rezervasyon response:', response);
      
      if (response.isSuccessful && response.data) {
        console.log('Backend rezervasyon data:', response.data);
        
        // Haftalık menüleri çek
        const currentWeekResponse = await menuAPI.getWeekly('current');
        const nextWeekResponse = await menuAPI.getWeekly('next');
        
        // Tüm menüleri birleştir ve tarihe göre map oluştur
        const allMenus = [
          ...(currentWeekResponse.isSuccessful && currentWeekResponse.data ? currentWeekResponse.data : []),
          ...(nextWeekResponse.isSuccessful && nextWeekResponse.data ? nextWeekResponse.data : [])
        ];
        
        const menuByDate = {};
        allMenus.forEach(m => {
          const menuDate = (m.menuDate || m.date)?.split('T')[0];
          if (menuDate) {
            menuByDate[menuDate] = m;
          }
        });
        
        console.log('Menu by date:', menuByDate);
        
        const formattedReservations = response.data.map(r => {
          console.log('Ham rezervasyon verisi:', r);
          
          // Tüm olası field'ları kontrol et
          const resDate = r.date?.split?.('T')?.[0] || 
                         r.menuDate?.split?.('T')?.[0] ||
                         null;
                         
          const reservedTime = r.reservedAt || 
                              r.createdAt || 
                              r.created_at ||
                              r.reservationDate ||
                              null;
          
          console.log('Tarih bilgileri:', { 
            'r.date': r.date,
            'r.menuDate': r.menuDate,
            'resDate': resDate,
            'r.reservedAt': r.reservedAt,
            'r.createdAt': r.createdAt,
            'reservedTime': reservedTime
          });
          
          const menu = menuByDate[resDate];
          
          return {
            reservationId: r.reservationId || r.id,
            userId: r.userId,
            date: resDate,
            status: r.status || 'CONFIRMED',
            reservedAt: reservedTime,
            menu: menu ? {
              soup: menu.soup,
              mainCourse: menu.mainCourse,
              sideDish: menu.sideDish,
              dessert: menu.dessert,
              calories: menu.calories || 0
            } : null
          };
        });
        
        // Tarihe göre sırala (yeni önce)
        formattedReservations.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReservations(formattedReservations);
      } else {
        setReservations([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Rezervasyonlar yuklenirken hata:', err);
      setError('Rezervasyonlar yüklenirken bir hata oluştu.');
      setLoading(false);
      setReservations([]);
    }
  };

  // Rezervasyon iptal onayını göster
  const handleCancelClick = (date) => {
    setCancelMessage(''); // Önce mesajı temizle
    setPendingCancel(date);
    setShowCancelConfirm(true);
  };

  // Rezervasyon iptal et
  const handleCancelReservation = async () => {
    if (!pendingCancel) {
      setShowCancelConfirm(false);
      return;
    }

    // Önce saat kontrolü yap
    if (!canCancel(pendingCancel)) {
      setCancelMessage('Üzgünüz, bu rezervasyonu iptal etmek için son saat geçti. İptal edilemez.');
      setShowCancelConfirm(true);
      return;
    }

    const dateToCancel = pendingCancel;
    setCancelling(dateToCancel);
    setShowCancelConfirm(false);

    try {
      // Rezervasyon ID'sini bul
      const reservation = reservations.find(r => r.date === dateToCancel);
      
      if (reservation && reservation.reservationId) {
        await reservationAPI.cancel(reservation.reservationId);
        
        // Custom event dispatch (diğer sayfalardan güncelleme için)
        window.dispatchEvent(new Event('reservationUpdated'));
        
        // Rezervasyonları yeniden yükle
        await loadReservations();
        
        setCancelling('');
        setPendingCancel(null);
        setCancelMessage('Rezervasyonunuz iptal edildi.');
        setShowCancelConfirm(true);
        
        // 2 saniye sonra mesajı kapat
        setTimeout(() => {
          setShowCancelConfirm(false);
          setCancelMessage('');
        }, 2000);
      } else {
        throw new Error('Rezervasyon bulunamadi');
      }
    } catch (err) {
      // Backend'den hata gelirse (örn: saat geçmişse) göster
      const errorMessage = err.response?.data?.message || 'Rezervasyon iptal edilirken bir hata oluştu.';
      setCancelMessage(errorMessage);
      setShowCancelConfirm(true);
      setCancelling('');
      setPendingCancel(null);
    }
  };

  // Tarihi Türkçe formatında göster
  const formatDate = (dateStr) => {
    if (!dateStr) {
      console.error('formatDate: dateStr bos!', dateStr);
      return 'Tarih Belirtilmemis';
    }
    
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      console.error('formatDate: Gecersiz tarih!', dateStr, date);
      return 'Gecersiz Tarih';
    }
    
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Rezervasyon zamanını formatla
  const formatReservedAt = (dateString) => {
    if (!dateString) {
      console.error('formatReservedAt: dateString bos!', dateString);
      return 'Tarih Belirtilmemis';
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.error('formatReservedAt: Gecersiz tarih!', dateString, date);
      return 'Gecersiz Tarih';
    }
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}.${month}.${date.getFullYear()} ${hours}:${minutes}`;
  };

  // Rezervasyonun gelecekte mi geçmişte mi olduğunu kontrol et
  const isUpcoming = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservationDate = new Date(dateStr);
    reservationDate.setHours(0, 0, 0, 0);
    return reservationDate >= today;
  };

  // İptal edilebilir mi kontrol et (bugün için son saat geçtiyse iptal edilemez)
  // Öğlen yemeği 11:30 - 14:00 arası, iptal için son saat: 10:30 (11:30'dan 1 saat önce)
  const canCancel = (dateStr) => {
    if (!isUpcoming(dateStr)) return false;
    
    const today = new Date();
    const reservationDate = new Date(dateStr);
    reservationDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // Bugün ise ve saat 10:30'u geçtiyse iptal edilemez
    if (reservationDate.getTime() === today.getTime()) {
      const now = new Date();
      const cancelDeadline = new Date();
      cancelDeadline.setHours(10, 30, 0, 0); // Sabah 10:30 (yemek 11:30'da başlıyor)
      return now < cancelDeadline;
    }
    
    // Gelecek günler için her zaman iptal edilebilir
    return true;
  };

  // Filtrelenmiş rezervasyonlar
  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'upcoming') {
      return isUpcoming(reservation.date);
    } else if (filter === 'past') {
      return !isUpcoming(reservation.date);
    }
    return true; // 'all'
  });

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
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            {cancelMessage ? (
              // Hata veya başarı mesajı
              <div className="text-center">
                <div className={`mb-4 ${cancelMessage.includes('iptal edildi') ? 'text-green-600' : 'text-red-600'}`}>
                  {cancelMessage.includes('iptal edildi') ? (
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${cancelMessage.includes('iptal edildi') ? 'text-green-800' : 'text-red-800'}`}>
                  {cancelMessage.includes('iptal edildi') ? 'Başarılı' : 'Hata'}
                </h3>
                <p className={`text-sm mb-4 ${cancelMessage.includes('iptal edildi') ? 'text-green-700' : 'text-red-700'}`}>
                  {cancelMessage}
                </p>
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancelMessage('');
                    setPendingCancel(null);
                  }}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Tamam
                </button>
              </div>
            ) : (
              // Onay sorusu
              <div className="text-center">
                <div className="mb-4 text-yellow-600">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Rezervasyonu İptal Et
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Bu rezervasyonu iptal etmek istediğinize emin misiniz?
                  {pendingCancel && (
                    <span className="block mt-2 font-medium text-gray-900">
                      {formatDate(pendingCancel)}
                    </span>
                  )}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCancelConfirm(false);
                      setPendingCancel(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleCancelReservation}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Evet, İptal Et
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rezervasyonlarım</h1>
        <p className="text-gray-600">Tüm rezervasyonlarınızı görüntüleyebilir ve yönetebilirsiniz</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filtreler */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Gelecek Rezervasyonlar
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filter === 'past'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Geçmiş Rezervasyonlar
          </button>
        </div>
      </div>

      {/* Rezervasyon Listesi */}
      {filteredReservations.length > 0 ? (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => {
            const upcoming = isUpcoming(reservation.date);
            const cancelable = canCancel(reservation.date);
            
            return (
              <div
                key={reservation.reservationId}
                className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                  upcoming 
                    ? 'border-blue-200' 
                    : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Sol Taraf - Tarih ve Durum */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        upcoming 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {formatDate(reservation.date)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reservation.status === 'CONFIRMED' || reservation.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {reservation.status === 'CONFIRMED' ? 'Onaylandı' :
                             reservation.status === 'COMPLETED' ? 'Tamamlandı' :
                             reservation.status}
                          </span>
                          {upcoming && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              Gelecek
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menü Bilgisi */}
                    {reservation.menu ? (
                      <div className="ml-12 mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Çorba:</span>
                            <p className="font-medium text-gray-900">{reservation.menu.soup}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Ana Yemek:</span>
                            <p className="font-medium text-gray-900">{reservation.menu.mainCourse}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Yan Yemek:</span>
                            <p className="font-medium text-gray-900">{reservation.menu.sideDish}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Tatlı:</span>
                            <p className="font-medium text-gray-900">{reservation.menu.dessert}</p>
                          </div>
                        </div>
                        {reservation.menu.calories && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-500">Kalori: </span>
                            <span className="text-xs font-medium text-gray-700">{reservation.menu.calories} kcal</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="ml-12 mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-700">Menü bilgisi bulunamadı</p>
                      </div>
                    )}
                  </div>

                  {/* Sağ Taraf - İptal Butonu */}
                  {upcoming && (
                    <div className="flex-shrink-0">
                      {cancelable ? (
                        <button
                          onClick={() => handleCancelClick(reservation.date)}
                          disabled={cancelling === reservation.date}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {cancelling === reservation.date ? 'İptal Ediliyor...' : 'İptal Et'}
                        </button>
                      ) : (
                        <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium text-sm text-center">
                          İptal Edilemez
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg">
            {filter === 'upcoming' ? 'Gelecek rezervasyon bulunmamaktadır.' :
             filter === 'past' ? 'Geçmiş rezervasyon bulunmamaktadır.' :
             'Henüz rezervasyon bulunmamaktadır.'}
          </p>
        </div>
      )}
    </div>
  );
}

