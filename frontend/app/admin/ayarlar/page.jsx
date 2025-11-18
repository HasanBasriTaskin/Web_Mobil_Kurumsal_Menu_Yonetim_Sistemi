'use client';

import { useState } from 'react';

export default function AyarlarPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    reservationReminders: true,
    commentModeration: true,
    weeklyReports: false,
    language: 'tr',
    timezone: 'Europe/Istanbul',
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayarlar</h1>
        <p className="text-gray-600">Sistem ayarlarınızı yönetin</p>
      </div>

      {/* Bildirim Ayarları */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Bildirim Ayarları</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">E-posta Bildirimleri</p>
              <p className="text-xs text-gray-500 mt-1">Önemli olaylar için e-posta bildirimleri alın</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Rezervasyon Hatırlatıcıları</p>
              <p className="text-xs text-gray-500 mt-1">Günlük rezervasyon özetleri için bildirim alın</p>
            </div>
            <button
              onClick={() => handleToggle('reservationReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.reservationReminders ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.reservationReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Yorum Moderatörlüğü Bildirimleri</p>
              <p className="text-xs text-gray-500 mt-1">Yeni yorumlar için anında bildirim alın</p>
            </div>
            <button
              onClick={() => handleToggle('commentModeration')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.commentModeration ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.commentModeration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Haftalık Raporlar</p>
              <p className="text-xs text-gray-500 mt-1">Haftalık sistem özet raporları alın</p>
            </div>
            <button
              onClick={() => handleToggle('weeklyReports')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.weeklyReports ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Genel Ayarlar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Genel Ayarlar</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-900 mb-1">Dil</label>
              <p className="text-xs text-gray-500">Arayüz dili</p>
            </div>
            <div className="w-48">
              <select
                value={settings.language}
                onChange={(e) => handleSelectChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-900 mb-1">Saat Dilimi</label>
              <p className="text-xs text-gray-500">Tarih ve saat gösterimi için saat dilimi</p>
            </div>
            <div className="w-48">
              <select
                value={settings.timezone}
                onChange={(e) => handleSelectChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
                <option value="Europe/London">Londra (GMT+0)</option>
                <option value="America/New_York">New York (GMT-5)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Kaydet Butonu */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
}

