'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/services/api';

export default function RezervasyonlarimPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [cancelling, setCancelling] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  // Rezervasyonları yükle
  const loadReservations = async () => {
    try {
      setLoading(true);
      setError('');

      // API çağrısı yapılacak
      // const response = await apiClient.get('/reservations/me');
      // const reservationsData = response.data.data || [];
      // setReservations(reservationsData);

      // Mock data (API hazır olduğunda yukarıdaki satırları kullan)
      setTimeout(() => {
        const today = new Date();
        const mockReservations = [];

        // Gelecek rezervasyonlar (bugünden sonraki 7 gün)
        for (let i = 1; i <= 5; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];

          mockReservations.push({
            reservationId: `r_${i}`,
            userId: 'u_12345',
            date: dateStr,
            status: 'CONFIRMED',
            reservedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            menu: {
              soup: ['Ezogelin', 'Mercimek', 'Domates', 'Tarhana', 'Yayla'][i % 5],
              mainCourse: ['Hünkar Beğendi', 'Izgara Köfte', 'Tavuk Şinitzel', 'Kuru Fasulye', 'Rosto'][i % 5],
              sideDish: ['Pilav', 'Makarna', 'Bulgur', 'Salata', 'Zeytinyağlı'][i % 5],
              dessert: ['Kazan Dibi', 'Sütlaç', 'Baklava', 'Tulumba', 'Revani'][i % 5],
              calories: 1000 + Math.floor(Math.random() * 300)
            }
          });
        }

        // Geçmiş rezervasyonlar (bugünden önceki 7 gün)
        for (let i = 1; i <= 3; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];

          mockReservations.push({
            reservationId: `r_past_${i}`,
            userId: 'u_12345',
            date: dateStr,
            status: 'COMPLETED',
            reservedAt: new Date(Date.now() - (i + 7) * 24 * 60 * 60 * 1000).toISOString(),
            menu: {
              soup: ['Ezogelin', 'Mercimek', 'Domates'][i % 3],
              mainCourse: ['Hünkar Beğendi', 'Izgara Köfte', 'Tavuk Şinitzel'][i % 3],
              sideDish: ['Pilav', 'Makarna', 'Bulgur'][i % 3],
              dessert: ['Kazan Dibi', 'Sütlaç', 'Baklava'][i % 3],
              calories: 1000 + Math.floor(Math.random() * 300)
            }
          });
        }

        // Tarihe göre sırala (gelecek önce, sonra geçmiş)
        mockReservations.sort((a, b) => new Date(a.date) - new Date(b.date));
        setReservations(mockReservations);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Rezervasyonlar yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  // Rezervasyon iptal et
  const handleCancelReservation = async (date) => {
    // Önce saat kontrolü yap
    if (!canCancel(date)) {
      alert('Üzgünüz, bu rezervasyonu iptal etmek için son saat geçti. İptal edilemez.');
      return;
    }

    if (!confirm('Bu rezervasyonu iptal etmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      setCancelling(date);
      
      // API çağrısı yapılacak
      // await apiClient.delete(`/reservations/${date}`);

      // Mock - rezervasyonu listeden kaldır
      setReservations(prev => prev.filter(r => r.date !== date));
      setCancelling('');
      alert('Rezervasyonunuz başarıyla iptal edildi.');
    } catch (err) {
      // Backend'den hata gelirse (örn: saat geçmişse) göster
      const errorMessage = err.response?.data?.message || 'Rezervasyon iptal edilirken bir hata oluştu.';
      alert(errorMessage);
      setCancelling('');
    }
  };

  // Tarihi Türkçe formatında göster
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Rezervasyon zamanını formatla
  const formatReservedAt = (dateString) => {
    const date = new Date(dateString);
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
    <div className="p-8">
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

                    {/* Rezervasyon Zamanı */}
                    <div className="ml-12 mt-3">
                      <p className="text-xs text-gray-500">
                        Rezervasyon Tarihi: {formatReservedAt(reservation.reservedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Sağ Taraf - İptal Butonu */}
                  {upcoming && (
                    <div className="flex-shrink-0">
                      {cancelable ? (
                        <button
                          onClick={() => handleCancelReservation(reservation.date)}
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

