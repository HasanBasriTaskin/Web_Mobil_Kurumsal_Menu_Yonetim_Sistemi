'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/services/api';

export default function UserPage() {
  const [todayMenu, setTodayMenu] = useState(null);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Yıldız puanlama için state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    loadTodayMenu();
    loadReservationStatus();
  }, []);

  // Bugünün menüsünü yükle
  const loadTodayMenu = async () => {
    try {
      setLoading(true);
      // API çağrısı yapılacak - şimdilik mock data
      // const response = await apiClient.get('/menu/today');
      // setTodayMenu(response.data.data);

      // Mock data (API hazır olduğunda yukarıdaki satırları kullan)
      setTimeout(() => {
        setTodayMenu({
          date: new Date().toISOString().split('T')[0],
          soup: 'Ezogelin Çorbası',
          mainCourse: 'Hünkar Beğendi',
          sideDish: 'Zeytinyağlı Enginar',
          dessert: 'Kazan Dibi',
          calories: 1100,
          allergens: ['Gluten', 'Süt']
        });
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Menü yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  // Rezervasyon durumunu kontrol et
  const loadReservationStatus = async () => {
    try {
      // API çağrısı yapılacak
      // const response = await apiClient.get('/reservations/me');
      // const today = new Date().toISOString().split('T')[0];
      // const todayReservation = response.data.data.find(r => r.date === today);
      // setReservationStatus(todayReservation ? 'reserved' : 'not_reserved');

      // Mock data
      setTimeout(() => {
        setReservationStatus('not_reserved');
      }, 500);
    } catch (err) {
      console.error('Rezervasyon durumu yüklenemedi:', err);
    }
  };

  // Rezervasyon yap
  const handleReservation = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      // API çağrısı
      // await apiClient.post('/reservations', { date: today });
      
      // Mock - başarılı olarak işaretle
      setReservationStatus('reserved');
      alert('Rezervasyonunuz başarıyla oluşturuldu!');
    } catch (err) {
      alert('Rezervasyon yapılırken bir hata oluştu.');
    }
  };

  // Rezervasyon iptal et
  const handleCancelReservation = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      // API çağrısı
      // await apiClient.delete(`/reservations/${today}`);
      
      // Mock - iptal et
      setReservationStatus('not_reserved');
      alert('Rezervasyonunuz iptal edildi.');
    } catch (err) {
      alert('Rezervasyon iptal edilirken bir hata oluştu.');
    }
  };

  // Geri bildirim gönder
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Lütfen bir puan seçiniz.');
      return;
    }

    try {
      setSubmittingFeedback(true);
      const today = new Date().toISOString().split('T')[0];
      // API çağrısı
      // await apiClient.post('/feedback', {
      //   date: today,
      //   rating: rating,
      //   comment: comment
      // });

      // Mock - başarılı
      alert('Geri bildiriminiz için teşekkür ederiz!');
      setRating(0);
      setComment('');
      setSubmittingFeedback(false);
    } catch (err) {
      alert('Geri bildirim gönderilirken bir hata oluştu.');
      setSubmittingFeedback(false);
    }
  };

  // Bugünün tarihini Türkçe formatında göster
  const getTodayDate = () => {
    const today = new Date();
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ana Sayfa</h1>
        <p className="text-gray-600">{getTodayDate()}</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Günün Menüsü */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Günün Menüsü</h2>
          
          {todayMenu ? (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Çorba:</span>
                  <span className="text-gray-900 font-semibold">{todayMenu.soup}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Ana Yemek:</span>
                  <span className="text-gray-900 font-semibold">{todayMenu.mainCourse}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Yan Yemek:</span>
                  <span className="text-gray-900 font-semibold">{todayMenu.sideDish}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">Tatlı:</span>
                  <span className="text-gray-900 font-semibold">{todayMenu.dessert}</span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Kalori:</span>
                  <span className="text-gray-700 font-medium">{todayMenu.calories} kcal</span>
                </div>
                {todayMenu.allergens && todayMenu.allergens.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Alerjenler: </span>
                    <span className="text-xs text-red-600">{todayMenu.allergens.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Bugün için menü bulunmamaktadır.</p>
          )}
        </div>

        {/* Rezervasyon Durumu */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rezervasyon Durumu</h2>
          
          {reservationStatus === 'reserved' ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-green-800">Rezervasyonunuz Yapıldı</span>
                </div>
                <p className="text-sm text-green-700">Bugünkü menü için rezervasyonunuz bulunmaktadır.</p>
              </div>
              <button
                onClick={handleCancelReservation}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Rezervasyonu İptal Et
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-semibold text-yellow-800">Rezervasyon Yapılmadı</span>
                </div>
                <p className="text-sm text-yellow-700">Bugünkü menü için henüz rezervasyon yapılmamıştır.</p>
              </div>
              <button
                onClick={handleReservation}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Rezervasyon Yap
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Geri Bildirim Formu */}
      {todayMenu && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Geri Bildirim</h2>
          
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            {/* Puanlama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menüyü Değerlendirin (1-5 yıldız)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Yorum */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Yorumunuz (Opsiyonel)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                placeholder="Menü hakkında düşüncelerinizi paylaşın..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Gönder Butonu */}
            <button
              type="submit"
              disabled={submittingFeedback}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingFeedback ? 'Gönderiliyor...' : 'Geri Bildirim Gönder'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
