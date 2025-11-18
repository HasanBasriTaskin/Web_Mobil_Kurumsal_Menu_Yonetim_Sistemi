'use client';

import { useState } from 'react';

const weekDays = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar'
];

const menuCategories = [
  'Çorba',
  'Ana Yemek',
  'Salata',
  'Tatlı',
  'İçecek'
];

export default function MenuYonetimiPage() {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [menus, setMenus] = useState({});
  const [publishedMenus, setPublishedMenus] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleMenuChange = (day, category, value) => {
    setMenus(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [category]: value
      }
    }));
  };

  const handlePublish = () => {
    if (!selectedWeek) {
      setErrorMessage('Lütfen hafta seçiniz!');
      setTimeout(() => setErrorMessage(''), 5000); // 5 saniye sonra otomatik kapanır
      return;
    }

    setErrorMessage(''); // Hata mesajını temizle

    const weekMenus = weekDays.map(day => ({
      day,
      items: menuCategories.map(category => ({
        category,
        name: menus[day]?.[category] || ''
      }))
    }));

    const newPublishedMenu = {
      id: Date.now(),
      week: selectedWeek,
      menus: weekMenus,
      publishedAt: new Date().toLocaleDateString('tr-TR')
    };

    setPublishedMenus([newPublishedMenu, ...publishedMenus]);
    setMenus({});
    setSelectedWeek('');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Menü Yönetimi</h1>
        <p className="text-gray-600">Gelecek hafta için günlük menüleri oluşturun ve yayınlayın</p>
      </div>

      {/* Hata Mesajı */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-medium">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="text-red-600 hover:text-red-800"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Hafta Seçimi ve Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Menü Oluştur</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hafta Seçiniz
          </label>
          <input
            type="week"
            value={selectedWeek}
            onChange={(e) => {
              setSelectedWeek(e.target.value);
              setErrorMessage(''); // Hafta seçildiğinde hata mesajını temizle
            }}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Günlük Menü Formları */}
        <div className="space-y-6">
          {weekDays.map((day) => (
            <div key={day} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{day}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuCategories.map((category) => (
                  <div key={category}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {category}
                    </label>
                    <input
                      type="text"
                      value={menus[day]?.[category] || ''}
                      onChange={(e) => handleMenuChange(day, category, e.target.value)}
                      placeholder={`${category} giriniz`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handlePublish}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Menüyü Yayınla
          </button>
        </div>
      </div>

      {/* Yayınlanmış Menüler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Yayınlanmış Menüler</h2>
        
        {publishedMenus.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Henüz yayınlanmış menü bulunmamaktadır.</p>
        ) : (
          <div className="space-y-4">
            {publishedMenus.map((menu) => (
              <div key={menu.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{menu.week} Haftası</h3>
                    <p className="text-sm text-gray-500">Yayınlanma: {menu.publishedAt}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Yayında
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menu.menus.map((dayMenu) => (
                    <div key={dayMenu.day} className="border border-gray-100 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 mb-2">{dayMenu.day}</h4>
                      <div className="space-y-1 text-sm">
                        {dayMenu.items.map((item, idx) => (
                          item.name && (
                            <div key={idx} className="flex justify-between">
                              <span className="text-gray-600">{item.category}:</span>
                              <span className="text-gray-900 font-medium">{item.name}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
