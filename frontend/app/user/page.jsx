'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { menuAPI, reservationAPI, feedbackAPI } from '@/services/api';

export default function UserPage() {
  const [todayMenu, setTodayMenu] = useState(null);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [reservationId, setReservationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Puanlama ve yorum için state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [myFeedback, setMyFeedback] = useState(null); // Kullanıcının mevcut yorumu
  const [isEditMode, setIsEditMode] = useState(false); // Düzenleme modu
  
  // Diğer çalışanların yorumları için state
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  
  // Rezervasyon iptal onay mesajı için state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  useEffect(() => {
    loadTodayMenu();
    loadReservationStatus();
    
    // Rezervasyon durumunu periyodik olarak kontrol et
    const interval = setInterval(() => {
      loadReservationStatus();
    }, 30000); // Her 30 saniyede kontrol et (API yükünü azaltmak için)
    
    // Sayfa focus olduğunda da kontrol et
    const handleFocus = () => {
      loadReservationStatus();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // todayMenu yüklendiğinde yorumları ve kendi yorumumu yükle
  useEffect(() => {
    if (todayMenu) {
      loadMyFeedback();
      loadComments();
    }
  }, [todayMenu]);

  // Bugünün menüsünü yükle
  const loadTodayMenu = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getToday();
      
      if (response.success && response.data) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        
        // Pazar günü (0) menü yok
        if (dayOfWeek === 0) {
          setTodayMenu(null);
          setLoading(false);
          return;
        }
        
        setTodayMenu(response.data);
        setLoading(false);
      } else {
        // Menü yoksa null set et
        setTodayMenu(null);
        setLoading(false);
      }
    } catch (err) {
      setTodayMenu(null);
      setLoading(false);
    }
  };

  // Rezervasyon durumunu kontrol et
  const loadReservationStatus = async () => {
    try {
      const response = await reservationAPI.getMyReservations();
      if (response.success && response.data) {
        const today = new Date().toISOString().split('T')[0];
        const todayReservation = response.data.find(r => r.menuDate?.split('T')[0] === today || r.date === today);
        if (todayReservation) {
          setReservationStatus('reserved');
          setReservationId(todayReservation.id);
        } else {
          setReservationStatus('not_reserved');
          setReservationId(null);
        }
      } else {
        setReservationStatus('not_reserved');
        setReservationId(null);
      }
    } catch (err) {
      setReservationStatus('not_reserved');
      setReservationId(null);
    }
  };

  // Bugün için rezervasyon yapılabilir mi kontrolü
  // Yemek saatinden 1 saat öncesine kadar rezervasyon yapılabilir
  const canMakeReservationToday = () => {
    const now = new Date();
    const reservationDeadline = new Date();
    reservationDeadline.setHours(10, 30, 0, 0); // Sabah 10:30 (yemek 11:30'da başlıyor, 1 saat öncesi)
    
    // Eğer şu an saat 10:30'u geçmediyse rezervasyon yapılabilir
    return now < reservationDeadline;
  };

  // Rezervasyon yap
  const handleReservation = async () => {
    // Bugün için rezervasyon yapılamaz kontrolü
    if (!canMakeReservationToday()) {
      return;
    }

    try {
      if (!todayMenu?.id) return;
      
      const response = await reservationAPI.create(todayMenu.id);
      
      if (response.success) {
        setReservationStatus('reserved');
        await loadReservationStatus();
      }
    } catch (err) {
      setError('Rezervasyon yapılırken bir hata oluştu.');
    }
  };

  // İptal edilebilir mi kontrol et (bugün için belirli saate kadar)
  // Öğlen yemeği 11:30 - 14:00 arası, iptal için son saat: 10:30 (11:30'dan 1 saat önce)
  const canCancelToday = () => {
    if (reservationStatus !== 'reserved') return false;
    
    const now = new Date();
    const cancelDeadline = new Date();
    cancelDeadline.setHours(10, 30, 0, 0); // Sabah 10:30 - bu saat backend'den config olarak alınabilir
    
    // Eğer şu an saat 10:30'u geçtiyse iptal edilemez
    return now < cancelDeadline;
  };

  // Rezervasyon iptal onayını göster
  const handleCancelClick = () => {
    // Önce saat kontrolü yap
    if (!canCancelToday()) {
      setCancelMessage('Üzgünüz, bugünkü rezervasyonu iptal etmek için son saat geçti. İptal edilemez.');
      setShowCancelConfirm(true);
      return;
    }
    setCancelMessage('');
    setShowCancelConfirm(true);
  };

  // Rezervasyon iptal et
  const handleCancelReservation = async () => {
    setShowCancelConfirm(false);

    try {
      if (!reservationId) return;
      
      const response = await reservationAPI.cancel(reservationId);
      
      if (response.success) {
        setReservationStatus('not_reserved');
        setReservationId(null);
        await loadReservationStatus();
        setCancelMessage('Rezervasyonunuz iptal edildi.');
        setShowCancelConfirm(true);
        setTimeout(() => {
          setShowCancelConfirm(false);
          setCancelMessage('');
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Rezervasyon iptal edilirken bir hata oluştu.';
      setError(errorMessage);
      setCancelMessage(errorMessage);
      setShowCancelConfirm(true);
    }
  };

  // Puanlama gönderebilir mi kontrol et (yemek yedikten sonra - 11:30'dan sonra)
  const canSubmitFeedback = () => {
    if (!todayMenu) return false;
    
    const now = new Date();
    const mealStartTime = new Date();
    mealStartTime.setHours(11, 30, 0, 0); // Öğlen yemeği 11:30'da başlıyor
    
    // Yemek saati başladıysa puanlama yapılabilir
    return now >= mealStartTime;
  };

  // Yorumları yükle
  const loadComments = async () => {
    try {
      setLoadingComments(true);
      
      if (!todayMenu || !todayMenu.id) {
        setComments([]);
        setLoadingComments(false);
        return;
      }
      
      const response = await feedbackAPI.getDaily(todayMenu.id);
      
      if (response.success && response.data) {
        const formattedComments = response.data.comments?.map((c, index) => ({
          id: index,
          rating: c.rating,
          comment: c.comment,
          time: c.time
        })) || [];
        setComments(formattedComments);
        setLoadingComments(false);
      } else {
        setComments([]);
        setLoadingComments(false);
      }
    } catch (err) {
      setLoadingComments(false);
    }
  };

  // Kullanıcının kendi yorumunu yükle
  const loadMyFeedback = async () => {
    try {
      if (!todayMenu || !todayMenu.id) {
        setMyFeedback(null);
        setIsEditMode(false);
        return;
      }
      
      const response = await feedbackAPI.getMyFeedback(todayMenu.id);
      
      if (response.success && response.data) {
        setMyFeedback(response.data);
        setRating(response.data.rating);
        setComment(response.data.comment || '');
        setIsEditMode(true);
      } else {
        setMyFeedback(null);
        setIsEditMode(false);
        setRating(0);
        setComment('');
      }
    } catch (err) {
      setMyFeedback(null);
      setIsEditMode(false);
      setRating(0);
      setComment('');
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!isEditMode && !canSubmitFeedback()) {
      return;
    }

    if (rating === 0) {
      return;
    }

    try {
      setSubmittingFeedback(true);
      
      if (!todayMenu?.id) {
        setSubmittingFeedback(false);
        return;
      }
      
      const response = isEditMode && myFeedback
        ? await feedbackAPI.update(myFeedback.id, rating, comment)
        : await feedbackAPI.submit(todayMenu.id, rating, comment);
      
      if (response.success) {
        await loadMyFeedback();
        await loadComments();
        setError('');
        toast.success(isEditMode ? 'Yorumunuz başarıyla güncellendi!' : 'Yorumunuz başarıyla gönderildi!');
      } else {
        const errorMsg = response.message || 'Bir hata oluştu.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
      
      setSubmittingFeedback(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Yorum güncellenirken bir hata oluştu.';
      setError(errorMessage);
      toast.error(errorMessage);
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
                  }}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    cancelMessage.includes('iptal edildi')
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  Tamam
                </button>
              </div>
            ) : (
              // Onay mesajı
              <div className="text-center">
                <div className="mb-4 text-yellow-600">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rezervasyonu İptal Et</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Bu rezervasyonu iptal etmek istediğinize emin misiniz?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setShowCancelConfirm(false);
                      setCancelMessage('');
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hayır
                  </button>
                  <button
                    onClick={handleCancelReservation}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 underline">Günün Menüsü</h2>
          
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
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">
                {new Date().getDay() === 0 
                  ? 'Pazar günleri yemek servisi bulunmamaktadır.' 
                  : 'Bugün için menü bulunmamaktadır.'}
              </p>
            </div>
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
                {!canCancelToday() && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-yellow-700 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      İptal için son saat geçti (10:30)
                    </p>
                  </div>
                )}
              </div>
              {canCancelToday() ? (
                <button
                  onClick={handleCancelClick}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Rezervasyonu İptal Et
                </button>
              ) : (
                <button
                  onClick={handleCancelClick}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                  disabled
                >
                  İptal Edilemez
                </button>
              )}
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
              {canMakeReservationToday() ? (
                <button
                  onClick={handleReservation}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Rezervasyon Yap
                </button>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 text-center">
                    Bugünün menüsü için rezervasyon yapma süresi doldu. Rezervasyonlar yemek saatinden 1 saat öncesine kadar (10:30) yapılabilir.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {todayMenu && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isEditMode ? 'Yorumunuzu Güncelleyin' : 'Menüyü Değerlendirin'}
            </h2>
            {isEditMode && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  ✓ Bu menü için daha önce yorum yaptınız. Yorumunuzu güncelleyebilirsiniz.
                </p>
              </div>
            )}
            
            {!canSubmitFeedback() && !isEditMode ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-yellow-700">
                    Puanlama yapabilmek için yemek saatini beklemeniz gerekmektedir (11:30).
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                {/* Hızlı Puanlama - 1-5 Yıldız */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Puanınız (1-5 yıldız)
                  </label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                        title={`${star} yıldız`}
                      >
                        <svg
                          className={`w-10 h-10 transition-colors ${
                            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Seçilen puan: {rating} yıldız
                    </p>
                  )}
                </div>

                {/* Yorum Kutusu (Opsiyonel) */}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
                  />
                </div>

                {/* Gönder Butonu */}
                <button
                  type="submit"
                  disabled={submittingFeedback || rating === 0}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingFeedback 
                    ? (isEditMode ? 'Güncelleniyor...' : 'Gönderiliyor...') 
                    : (isEditMode ? 'Yorumu Güncelle' : 'Puanlamayı Gönder')
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {todayMenu && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Diğer Çalışanların Yorumları</h2>
            
            {loadingComments ? (
              <p className="text-center text-gray-500 py-4">Yorumlar yükleniyor...</p>
            ) : comments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Henüz yorum yapılmamış.</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">Anonim</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{comment.time}</span>
                        </div>
                        {comment.comment && (
                          <p className="text-gray-700">{comment.comment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
