'use client';

import { useState, useEffect } from 'react';
import { menuAPI } from '@/services/api';
import { toast } from 'sonner';

export default function MenuYonetimiPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  const [formData, setFormData] = useState({
    date: '',
    soup: '',
    mainCourse: '',
    sideDish: '',
    dessert: '',
    calories: 0
  });

  // Menüleri yükle
  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const allMenus = [];
      
      // Her haftayı ayrı ayrı dene, hata olsa bile devam et
      try {
        const currentWeek = await menuAPI.getWeekly('current');
        if (currentWeek.data) {
          allMenus.push(...currentWeek.data);
        }
      } catch (err) {
        // Suppress 404 - Bu hafta menü yoksa normal
      }
      
      try {
        const nextWeek = await menuAPI.getWeekly('next');
        if (nextWeek.data) {
          allMenus.push(...nextWeek.data);
        }
      } catch (err) {
        // Suppress 404 - Gelecek hafta menü yoksa normal
      }
      
      // Tarihe göre sırala (en yeni en üstte)
      allMenus.sort((a, b) => new Date(b.menuDate) - new Date(a.menuDate));
      
      setMenus(allMenus);
    } catch (error) {
      console.error('Menüler yüklenemedi:', error);
      toast.error('Menüler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Form alanlarını güncelle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Yeni menü oluştur
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.soup || !formData.mainCourse) {
      toast.error('Lütfen tarih, çorba ve ana yemek alanlarını doldurunuz');
      return;
    }

    // Pazar günü kontrolü
    const selectedDate = new Date(formData.date + 'T00:00:00');
    if (selectedDate.getDay() === 0) { // 0 = Pazar
      toast.error('Pazar günü için menü oluşturulamaz!');
      return;
    }

    try {
      const response = await menuAPI.create({
        MenuDate: formData.date,
        Soup: formData.soup,
        MainCourse: formData.mainCourse,
        SideDish: formData.sideDish || '',
        Dessert: formData.dessert || '',
        Calories: parseInt(formData.calories) || 0
      });

      if (response.success || response.isSuccessful) {
        toast.success('Menü başarıyla oluşturuldu');
        setShowCreateModal(false);
        resetForm();
        loadMenus();
      }
    } catch (error) {
      console.error('Menü oluşturma hatası:', error);
      
      const errorData = error.response?.data;
      let errorMessage = '';
      
      if (errorData) {
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors.map(e => 
            typeof e === 'string' ? e : (e.description || e.message || e.Message || JSON.stringify(e))
          ).join(', ');
        } else if (errorData.message || errorData.Message) {
          errorMessage = errorData.message || errorData.Message;
        }
      }
      
      // 409 Conflict - Aynı tarihte menü var
      if (error.response?.status === 409) {
        toast.error(errorMessage || 'Bu tarih için zaten bir menü mevcut. Lütfen farklı bir tarih seçin.');
      } else if (error.response?.status === 400) {
        toast.error(errorMessage || 'Geçersiz veri. Lütfen tüm alanları kontrol edin.');
      } else {
        toast.error(errorMessage || 'Menü oluşturulurken bir hata oluştu');
      }
    }
  };

  // Menü düzenle
  const handleEdit = async (e) => {
    e.preventDefault();
    
    if (!selectedMenu) return;

    // Pazar günü kontrolü
    const selectedDate = new Date(formData.date + 'T00:00:00');
    if (selectedDate.getDay() === 0) { // 0 = Pazar
      toast.error('Pazar günü için menü oluşturulamaz!');
      return;
    }

    try {
      const response = await menuAPI.update(selectedMenu.id, {
        MenuDate: formData.date,
        Soup: formData.soup,
        MainCourse: formData.mainCourse,
        SideDish: formData.sideDish || '',
        Dessert: formData.dessert || '',
        Calories: parseInt(formData.calories) || 0
      });

      if (response.success || response.isSuccessful) {
        toast.success('Menü başarıyla güncellendi');
        setShowEditModal(false);
        setSelectedMenu(null);
        resetForm();
        loadMenus();
      }
    } catch (error) {
      console.error('Menü güncelleme hatası:', error);
      // Error response details are parsed below
      
      const errorData = error.response?.data;
      let errorMessage = '';
      
      if (errorData) {
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors.map(e => 
            typeof e === 'string' ? e : (e.description || e.message || e.Message || JSON.stringify(e))
          ).join(', ');
        } else if (errorData.message || errorData.Message) {
          errorMessage = errorData.message || errorData.Message;
        }
      }
      
      // 409 Conflict - Aynı tarihte başka menü var
      if (error.response?.status === 409) {
        toast.error(errorMessage || 'Bu tarih için zaten başka bir menü mevcut. Lütfen farklı bir tarih seçin.');
      } else if (error.response?.status === 400) {
        toast.error(errorMessage || 'Geçersiz veri. Lütfen tüm alanları kontrol edin.');
      } else {
        toast.error(errorMessage || 'Menü güncellenirken bir hata oluştu');
      }
    }
  };

  // Menü sil
  const handleDelete = async (menuId, force = false) => {
    // Zaten silme işlemi devam ediyorsa işlemi engelle
    if (deletingId === menuId) return;

    setDeletingId(menuId); // Silme işlemi başladı

    try {
      const response = await menuAPI.delete(menuId, force);
      
      if (response.success || response.isSuccessful) {
        toast.success('Menü başarıyla silindi');
        await loadMenus();
      }
    } catch (error) {
      console.error('Menü silme hatası:', error);
      
      // 404 hatası - Menü zaten silinmiş
      if (error.response?.status === 404) {
        toast.info('Menü zaten silinmiş');
        await loadMenus(); // Listeyi yenile
        return;
      }
      
      // Backend'den gelen hata mesajı
      const errorMessage = error.response?.data?.message || error.response?.data?.Message || '';
      const errorData = error.response?.data;
      
      // Rezervasyonlar varsa kullanıcıya sor
      if (error.response?.status === 400 || error.response?.status === 409) {
        // Rezervasyon veya ilişkili veri kontrolü
        const hasReservationError = 
          errorMessage.toLowerCase().includes('reservation') || 
          errorMessage.toLowerCase().includes('rezervasyon') ||
          (errorData?.errors && Array.isArray(errorData.errors) && 
           errorData.errors.some(e => {
             const errStr = typeof e === 'string' ? e : (e?.message || e?.Message || JSON.stringify(e));
             return errStr.toLowerCase().includes('reservation') || errStr.toLowerCase().includes('rezervasyon');
           }));
        
        if (hasReservationError && !force) {
          // Rezervasyonlar varsa force delete ile tekrar dene
          setDeletingId(null);
          await handleDelete(menuId, true);
          return;
        } else {
          toast.error(errorMessage || 'Menü silinirken bir hata oluştu');
        }
      } else {
        toast.error(errorMessage || 'Menü silinirken bir hata oluştu');
      }
    } finally {
      setDeletingId(null); // Silme işlemi bitti
    }
  };

  // Düzenleme için menü yükle
  const openEditModal = (menu) => {
    setSelectedMenu(menu);
    setFormData({
      date: menu.menuDate.split('T')[0],
      soup: menu.soup || '',
      mainCourse: menu.mainCourse || '',
      sideDish: menu.sideDish || '',
      dessert: menu.dessert || '',
      calories: menu.calories || 0
    });
    setShowEditModal(true);
  };

  // Formu sıfırla
  const resetForm = () => {
    setFormData({
      date: '',
      soup: '',
      mainCourse: '',
      sideDish: '',
      dessert: '',
      calories: 0
    });
  };

  // Tarihi formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Menü Yönetimi</h1>
          <p className="text-sm sm:text-base text-gray-600">Günlük menüleri oluşturun, düzenleyin ve silin</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Menü Ekle
        </button>
      </div>

      {/* Menüler Listesi */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : menus.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz menü bulunmuyor</h3>
          <p className="text-gray-600 mb-6">Yeni bir menü ekleyerek başlayın</p>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            İlk Menüyü Ekle
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Çorba
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ana Yemek
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Garnitür
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tatlı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kalori
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menus.map((menu) => (
                <tr key={menu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(menu.menuDate).toLocaleDateString('tr-TR', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(menu.menuDate).toLocaleDateString('tr-TR', { weekday: 'long' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{menu.soup || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{menu.mainCourse || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{menu.sideDish || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{menu.dessert || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{menu.calories} kcal</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(menu)}
                        disabled={deletingId === menu.id}
                        className="text-blue-600 hover:text-blue-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Düzenle"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(menu.id)}
                        disabled={deletingId === menu.id}
                        className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={deletingId === menu.id ? 'Siliniyor...' : 'Sil'}
                      >
                        {deletingId === menu.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Yeni Menü Oluşturma Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Yeni Menü Ekle</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çorba <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="soup"
                  value={formData.soup}
                  onChange={handleInputChange}
                  required
                  placeholder="Örn: Mercimek Çorbası"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana Yemek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mainCourse"
                  value={formData.mainCourse}
                  onChange={handleInputChange}
                  required
                  placeholder="Örn: Tavuk Sote"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Garnitür
                </label>
                <input
                  type="text"
                  name="sideDish"
                  value={formData.sideDish}
                  onChange={handleInputChange}
                  placeholder="Örn: Pilav"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tatlı
                </label>
                <input
                  type="text"
                  name="dessert"
                  value={formData.dessert}
                  onChange={handleInputChange}
                  placeholder="Örn: Sütlaç"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kalori
                </label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Menü Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menü Düzenleme Modal */}
      {showEditModal && selectedMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Menü Düzenle</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedMenu(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEdit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çorba <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="soup"
                  value={formData.soup}
                  onChange={handleInputChange}
                  required
                  placeholder="Örn: Mercimek Çorbası"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana Yemek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mainCourse"
                  value={formData.mainCourse}
                  onChange={handleInputChange}
                  required
                  placeholder="Örn: Tavuk Sote"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Garnitür
                </label>
                <input
                  type="text"
                  name="sideDish"
                  value={formData.sideDish}
                  onChange={handleInputChange}
                  placeholder="Örn: Pilav"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tatlı
                </label>
                <input
                  type="text"
                  name="dessert"
                  value={formData.dessert}
                  onChange={handleInputChange}
                  placeholder="Örn: Sütlaç"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kalori
                </label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMenu(null);
                  }}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
