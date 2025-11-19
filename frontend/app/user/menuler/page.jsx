'use client';

import { useState, useEffect } from 'react';
import { menuAPI, reservationAPI } from '@/services/api';

export default function MenulerPage() {
  const [currentWeekMenu, setCurrentWeekMenu] = useState([]);
  const [nextWeekMenu, setNextWeekMenu] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [viewMode, setViewMode] = useState('week');
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservationsMap, setReservationsMap] = useState(new Map());
  const [reserving, setReserving] = useState('');
  const [showReservationConfirm, setShowReservationConfirm] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(null);

  useEffect(() => {
    loadMenus();
    loadReservations();
  }, [selectedWeek]);

  const loadReservations = async () => {
    try {
      const response = await reservationAPI.getMyReservations();
      
      if (response.success && response.data) {
        const map = new Map();
        response.data.forEach(r => {
          if (r.menuId) {
            map.set(r.menuId, {
              id: r.id,
              menuId: r.menuId,
              menuDate: r.menuDate,
              reservationStatus: r.reservationStatus
            });
          }
        });
        setReservationsMap(map);
      } else {
        setReservationsMap(new Map());
      }
    } catch (err) {
      setReservationsMap(new Map());
    }
  };

  const normalizeMenus = (menus) => {
    return menus
      .map(menu => {
        const dateValue = menu.menuDate || menu.date;
        return { ...menu, date: dateValue, menuDate: dateValue };
      })
      .filter(menu => {
        const menuDate = new Date(menu.date);
        return !isNaN(menuDate.getTime()) && menuDate.getDay() !== 0;
      });
  };

  const loadMenus = async () => {
    try {
      setLoading(true);
      setError('');

      const currentResponse = await menuAPI.getWeekly('current');
      const nextResponse = await menuAPI.getWeekly('next');
      
      if (currentResponse.success && currentResponse.data) {
        setCurrentWeekMenu(normalizeMenus(currentResponse.data));
      } else {
        setCurrentWeekMenu([]);
      }
      
      if (nextResponse.success && nextResponse.data) {
        setNextWeekMenu(normalizeMenus(nextResponse.data));
      } else {
        setNextWeekMenu([]);
      }

      setLoading(false);
    } catch (err) {
      setError('Menüler yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tarih Belirtilmemiş';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Geçersiz Tarih';
      
      const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
    } catch {
      return 'Tarih Hatası';
    }
  };

  const isToday = (dateStr) => {
    return new Date().toISOString().split('T')[0] === dateStr;
  };

  const hasReservation = (menuId) => {
    return reservationsMap.has(menuId);
  };

  const getReservation = (menuId) => {
    return reservationsMap.get(menuId);
  };

  const getDeadline = (menuDateStr) => {
    const menuDate = new Date(menuDateStr);
    menuDate.setHours(11, 30, 0, 0);
    const deadline = new Date(menuDate);
    deadline.setHours(deadline.getHours() - 1);
    return deadline;
  };

  const canCancelReservation = (menuDateStr) => {
    if (!menuDateStr) return false;
    return new Date() < getDeadline(menuDateStr);
  };

  const canMakeReservationForMenu = (menuDateStr) => {
    if (!menuDateStr) return false;
    return new Date() < getDeadline(menuDateStr);
  };

  const isPastMenu = (menuDateStr) => {
    if (!menuDateStr) return false;
    const menuDate = new Date(menuDateStr);
    menuDate.setHours(11, 30, 0, 0);
    return new Date() > menuDate;
  };

  const getReservationStatusMessage = (menu) => {
    if (!menu?.id) return '';
    
    const reservation = getReservation(menu.id);
    const isPast = isPastMenu(menu.menuDate);
    const canCancel = menu.menuDate ? canCancelReservation(menu.menuDate) : false;
    const canMake = menu.menuDate ? canMakeReservationForMenu(menu.menuDate) : false;
    
    if (reservation) {
      return isPast ? 'Geçmiş - Yapılan Rezervasyon' : 'Rezervasyon yapıldı';
    } else {
      if (isPast) return 'Geçmiş - Rezervasyon yapılmadı';
      if (!canMake) return 'Rezervasyon yapılmadı';
      return '';
    }
  };

  const handleReservationClick = (menuId, action) => {
    setPendingReservation({ menuId, action });
    setShowReservationConfirm(true);
  };

  const handleConfirmReservation = async () => {
    if (!pendingReservation) return;

    const { menuId, action } = pendingReservation;
    setShowReservationConfirm(false);
    setReserving(menuId.toString());

    try {
      const menus = [...currentWeekMenu, ...nextWeekMenu];
      const menu = menus.find(m => m.id === menuId);
      
      if (!menu) {
        setReserving('');
        return;
      }

      if (action === 'cancel') {
        const reservation = getReservation(menuId);
        if (!reservation?.id || (menu.menuDate && !canCancelReservation(menu.menuDate))) {
          setReserving('');
          return;
        }
        await reservationAPI.cancel(reservation.id);
      } else {
        if (menu.menuDate && !canMakeReservationForMenu(menu.menuDate)) {
          setReserving('');
          return;
        }
        await reservationAPI.create(menu.id);
      }
      
      await loadReservations();
      setReserving('');
    } catch (err) {
      if (err.response?.status === 409) {
        await loadReservations();
      }
      setReserving('');
    }
    
    setPendingReservation(null);
  };

  const selectedMenu = selectedWeek === 'current' ? currentWeekMenu : nextWeekMenu;
  
  useEffect(() => {
    if (viewMode === 'daily' && selectedMenu.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayMenu = selectedMenu.find(m => m.date === today);
      if (!selectedDate || !selectedMenu.find(m => m.date === selectedDate)) {
        setSelectedDate(todayMenu ? todayMenu.date : selectedMenu[0].date);
      }
    }
  }, [viewMode, selectedWeek]);

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
                  : `Bu menü için rezervasyon yapmak istediğinize emin misiniz?`}
              </p>
              {(() => {
                const menus = [...currentWeekMenu, ...nextWeekMenu];
                const menu = menus.find(m => m.id === pendingReservation.menuId);
                if (menu) {
                  return (
                    <div className="text-xs text-gray-500 mb-6 space-y-1">
                      <p>{formatDate(menu.date || menu.menuDate)}</p>
                      <p className="font-medium">{menu.mainCourse}</p>
                    </div>
                  );
                }
                return null;
              })()}
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

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Haftalık Menü</h1>
        <p className="text-gray-600">Bu hafta ve gelecek hafta menülerini görüntüleyebilirsiniz</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

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

      {selectedMenu.length > 0 ? (
        <>
          {viewMode === 'week' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedMenu.map((menu, index) => {
            const isTodayMenu = isToday(menu.date);
            return (
              <div
                key={menu.id || menu.date || `menu-week-${index}`}
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

                {/* Rezervasyon Durumu ve Butonu */}
                {viewMode === 'week' && (() => {
                  const isReserved = hasReservation(menu.id);
                  const isReserving = reserving === menu.id.toString();
                  const canCancel = menu.menuDate ? canCancelReservation(menu.menuDate) : false;
                  const canMake = menu.menuDate ? canMakeReservationForMenu(menu.menuDate) : false;
                  const statusMessage = getReservationStatusMessage(menu);
                  const showButton = canMake || (isReserved && canCancel);
                  
                  const handleReservation = () => {
                    if (isReserved) {
                      if (!canCancel) return;
                      handleReservationClick(menu.id, 'cancel');
                    } else {
                      if (!canMake) return;
                      handleReservationClick(menu.id, 'create');
                    }
                  };

                  return (
                    <div className="mt-4 space-y-2">
                      {statusMessage && (
                        <p className={`text-xs text-center ${
                          isReserved 
                            ? (!canCancel ? 'text-gray-500' : 'text-green-600')
                            : (!canMake ? 'text-gray-500' : 'text-gray-600')
                        }`}>
                          {statusMessage}
                        </p>
                      )}
                      
                      {showButton && (
                        <button
                          onClick={handleReservation}
                          disabled={isReserving || (isReserved && !canCancel) || (!isReserved && !canMake)}
                          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                            isReserved
                              ? canCancel
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : canMake
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isReserving ? 'İşleniyor...' : 
                           isReserved ? (canCancel ? 'Rezervasyonu İptal Et' : 'İptal Edilemez') : 
                           'Rezervasyon Yap'}
                        </button>
                      )}
                      
                      {isReserved && !canCancel && (
                        <p className="text-xs text-gray-500 text-center">
                          İptal için son saat geçti
                        </p>
                      )}
                      {!isReserved && !canMake && menu.menuDate && !isPastMenu(menu.menuDate) && (
                        <p className="text-xs text-gray-500 text-center">
                          Rezervasyon için son saat geçti
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

          {viewMode === 'list' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {selectedMenu.map((menu, index) => {
                const isTodayMenu = isToday(menu.date);
                const isReserved = hasReservation(menu.id);
                const canCancel = menu.menuDate ? canCancelReservation(menu.menuDate) : false;
                const canMake = menu.menuDate ? canMakeReservationForMenu(menu.menuDate) : false;
                const statusMessage = getReservationStatusMessage(menu);
                const showButton = canMake || (isReserved && canCancel);

                return (
                  <div
                    key={menu.id || menu.date || `menu-list-${index}`}
                    className={`p-6 ${isTodayMenu ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-6">
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
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-gray-500 text-xs">Kalori:</span>
                            <span className="text-gray-700 text-xs font-medium">{menu.calories} kcal</span>
                          </div>
                          {statusMessage && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className={`text-xs ${
                                isReserved 
                                  ? (!canCancel ? 'text-gray-500' : 'text-green-600')
                                  : (!canMake ? 'text-gray-500' : 'text-gray-600')
                              }`}>
                                {statusMessage}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {showButton && (
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => {
                              if (isReserved) {
                                if (!canCancel) return;
                                handleReservationClick(menu.id, 'cancel');
                              } else {
                                if (!canMake) return;
                                handleReservationClick(menu.id, 'create');
                              }
                            }}
                            disabled={reserving === menu.id.toString() || (isReserved && !canCancel) || (!isReserved && !canMake)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
                              isReserved
                                ? canCancel
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : canMake
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {reserving === menu.id.toString() ? 'İşleniyor...' : 
                             isReserved ? (canCancel ? 'İptal Et' : 'İptal Edilemez') : 
                             'Rezervasyon Yap'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'daily' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedMenu.map((menu, index) => {
                    const isTodayMenu = isToday(menu.date);
                    const isSelected = selectedDate === menu.date;
                    return (
                      <button
                        key={menu.id || menu.date || `menu-daily-${index}`}
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

              {selectedDate && (() => {
                const menu = selectedMenu.find(m => m.date === selectedDate);
                if (!menu) return null;
                const isTodayMenu = isToday(menu.date);
                const isReserved = hasReservation(menu.id);
                const canCancel = menu.menuDate ? canCancelReservation(menu.menuDate) : false;
                const canMake = menu.menuDate ? canMakeReservationForMenu(menu.menuDate) : false;
                const statusMessage = getReservationStatusMessage(menu);
                const showButton = canMake || (isReserved && canCancel);

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

                      {viewMode === 'week' && (
                        <div className="pt-4 border-t border-gray-200 space-y-3">
                          {statusMessage && (
                            <p className={`text-sm text-center ${
                              isReserved 
                                ? (!canCancel ? 'text-gray-500' : 'text-green-600')
                                : (!canMake ? 'text-gray-500' : 'text-gray-600')
                            }`}>
                              {statusMessage}
                            </p>
                          )}
                          
                          {showButton && (
                            <button
                              onClick={() => {
                                if (isReserved) {
                                  if (!canCancel) return;
                                  handleReservationClick(menu.id, 'cancel');
                                } else {
                                  if (!canMake) return;
                                  handleReservationClick(menu.id, 'create');
                                }
                              }}
                              disabled={reserving === menu.id.toString() || (isReserved && !canCancel) || (!isReserved && !canMake)}
                              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                                isReserved
                                  ? canCancel
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : canMake
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {reserving === menu.id.toString() ? 'İşleniyor...' : 
                               isReserved ? (canCancel ? 'Rezervasyonu İptal Et' : 'İptal Edilemez') : 
                               'Rezervasyon Yap'}
                            </button>
                          )}
                          
                          {isReserved && !canCancel && (
                            <p className="text-sm text-gray-500 text-center">
                              İptal için son saat geçti
                            </p>
                          )}
                          {!isReserved && !canMake && menu.menuDate && !isPastMenu(menu.menuDate) && (
                            <p className="text-sm text-gray-500 text-center">
                              Rezervasyon için son saat geçti
                            </p>
                          )}
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

