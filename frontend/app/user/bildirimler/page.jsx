'use client';

import { useState, useEffect } from 'react';
import { notificationAPI } from '@/services/api';

export default function BildirimlerPage() {
  const [allNotifications, setAllNotifications] = useState([]); // Tüm bildirimler (state'te tutulacak)
  const [notifications, setNotifications] = useState([]); // Gösterilen bildirimler (filtrelenmiş + sayfalanmış)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAsRead, setMarkingAsRead] = useState('');

  // İlk yükleme
  useEffect(() => {
    if (allNotifications.length === 0) {
      loadNotifications();
    }
  }, []);

  // Gösterilen bildirimleri güncelle (filtre + sayfalama)
  const updateDisplayedNotifications = () => {
    console.log('Bildirimleri güncelleme:', {
      filter,
      currentPage,
      allNotificationsCount: allNotifications.length,
      allNotifications
    });
    
    // Filtreleme
    let filtered = allNotifications;
    if (filter === 'unread') {
      filtered = allNotifications.filter(n => !n.isRead);
    } else if (filter === 'read') {
      filtered = allNotifications.filter(n => n.isRead);
    }

    console.log('Filtrelenmis bildirimler:', {
      filterType: filter,
      filteredCount: filtered.length,
      filtered
    });

    // Sayfalama
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNotifications = filtered.slice(startIndex, endIndex);
    
    console.log('Sayfalanmis bildirimler:', {
      page: currentPage,
      pageSize,
      startIndex,
      endIndex,
      paginatedCount: paginatedNotifications.length
    });
    
    setNotifications(paginatedNotifications);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setUnreadCount(allNotifications.filter(n => !n.isRead).length);
  };

  // Filtre veya sayfa değiştiğinde gösterilen bildirimleri güncelle
  useEffect(() => {
    if (allNotifications.length > 0) {
      updateDisplayedNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, currentPage, allNotifications]);

  // Bildirimleri yükle (sadece ilk yüklemede)
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Bildirimler yukleniyor...');
      const response = await notificationAPI.getAll();
      console.log('API Response:', response);
      
      if (response.isSuccessful && response.data) {
        console.log('Gelen bildirimler:', response.data);
        // Backend'den gelen bildirimleri formatlayalım
        const formattedNotifications = response.data.map(n => ({
          id: n.id,
          message: n.title || n.description || n.message,
          isRead: n.isRead || false,
          createdAt: n.createdAt,
          type: n.type || 'general'
        }));
        console.log('Formatlanmis bildirimler:', formattedNotifications);
        setAllNotifications(formattedNotifications);
      } else {
        console.warn('Bildirim response basarisiz veya data yok:', response);
        setAllNotifications([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Bildirimler yükleme hatası:', err);
      setError('Bildirimler yüklenirken bir hata oluştu.');
      setAllNotifications([]);
      setLoading(false);
    }
  };

  // Tüm bildirimleri okundu olarak işaretle
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAsRead(null); // null = tümünü işaretle
      // Local state'i güncelle
      setAllNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Bildirimler okundu işaretlenirken hata oluştu:', err);
    }
  };

  // Tek bir bildirimi okundu olarak işaretle
  const handleMarkAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(notificationId);
      await notificationAPI.markAsRead([notificationId]);
      // Local state'i güncelle
      setAllNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setMarkingAsRead('');
    } catch (err) {
      console.error('Bildirim okundu işaretlenirken hata oluştu:', err);
      setMarkingAsRead('');
    }
  };

  // ESKİ MOCK DATA - SİLİNECEK
  const OLD_loadNotifications_MOCK = async () => {
    try {
      setLoading(true);
      setError('');
      setTimeout(() => {
        const mockNotifications_OLD = [
          {
            id: 'n_001',
            message: 'Yeni hafta (4-8 Kasım) menüsü yayınlandı.',
            isRead: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 saat önce
            type: 'menu'
          },
          {
            id: 'n_002',
            message: 'Bugün rezervasyon yapmak için son 1 saatiniz.',
            isRead: true,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 saat önce
            type: 'reservation'
          },
          {
            id: 'n_003',
            message: 'Dünkü yemeği değerlendirmeyi unutmayın.',
            isRead: false,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 gün önce
            type: 'feedback'
          },
          {
            id: 'n_004',
            message: 'Gelecek hafta için yemek oylaması başladı. Oyunuzu kullanmayı unutmayın!',
            isRead: false,
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 gün önce
            type: 'voting'
          },
          {
            id: 'n_005',
            message: 'Rezervasyonunuz onaylandı. Yarın yemekhane sizi bekliyor!',
            isRead: true,
            createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 gün önce
            type: 'reservation'
          },
          {
            id: 'n_006',
            message: 'Yeni menü planı hazır. Haftalık menüyü görüntüleyebilirsiniz.',
            isRead: true,
            createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), // 4 gün önce
            type: 'menu'
          },
          {
            id: 'n_007',
            message: 'Rezervasyon yapmak için son 30 dakikanız!',
            isRead: false,
            createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(), // 30 dakika önce
            type: 'reservation'
          },
          {
            id: 'n_008',
            message: 'Geribildiriminiz için teşekkür ederiz. Yorumunuz incelendi.',
            isRead: true,
            createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(), // 5 gün önce
            type: 'feedback'
          }
        ];

        setAllNotifications(mockNotifications);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Bildirimler yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  // Zamanı formatla
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Az önce';
    } else if (diffMins < 60) {
      return `${diffMins} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else {
      const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
  };

  // Bildirim türü ikonu
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'menu':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'reservation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'feedback':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
      case 'voting':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Bildirimler</h1>
            <p className="text-gray-600">Tüm bildirimlerinizi burada görüntüleyebilirsiniz</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAsRead === 'all'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {markingAsRead === 'all' ? 'İşaretleniyor...' : 'Tümünü Okundu İşaretle'}
            </button>
          )}
        </div>
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
            onClick={() => {
              setFilter('all');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => {
              setFilter('unread');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Okunmamış {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={() => {
              setFilter('read');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filter === 'read'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Okunmuş
          </button>
        </div>
      </div>

      {/* Bildirim Listesi */}
      {notifications.length > 0 ? (
        <div className="space-y-4 mb-6">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-colors ${
                notification.isRead 
                  ? 'border-gray-200 opacity-75' 
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* İkon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  notification.isRead 
                    ? 'bg-gray-100 text-gray-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* İçerik */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className={`text-sm font-medium ${
                      notification.isRead ? 'text-gray-700' : 'text-gray-900'
                    }`}>
                      {notification.message}
                    </p>
                    {!notification.isRead && (
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {formatTime(notification.createdAt)}
                    </span>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markingAsRead === notification.id}
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {markingAsRead === notification.id ? 'İşaretleniyor...' : 'Okundu İşaretle'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-gray-500 text-lg">
            {filter === 'unread' ? 'Okunmamış bildirim bulunmamaktadır.' :
             filter === 'read' ? 'Okunmuş bildirim bulunmamaktadır.' :
             'Henüz bildirim bulunmamaktadır.'}
          </p>
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-700">
            Sayfa {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}

