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
    emailVerified: false,
  });

  const [accountInfo, setAccountInfo] = useState({
    email: 'admin@company.com',
    fullName: 'Admin User',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Tüm alanları doldurunuz');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor');
      return;
    }

    // Şifre değiştirme işlemi burada yapılacak (API çağrısı)
    setPasswordError('');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
    // Başarı mesajı gösterilebilir
  };

  const handleSendEmailVerification = () => {
    // E-posta doğrulama maili gönderme işlemi burada yapılacak (API çağrısı)
    setEmailVerificationSent(true);
    setTimeout(() => setEmailVerificationSent(false), 5000);
  };

  const handleAccountInfoChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo(prev => ({
      ...prev,
      [name]: value
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

      {/* Hesap Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Hesap Bilgileri</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">E-posta</label>
            <div className="flex items-center gap-3">
              <input
                type="email"
                name="email"
                value={accountInfo.email}
                onChange={handleAccountInfoChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="E-posta adresinizi giriniz"
              />
              {settings.emailVerified ? (
                <span className="px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg font-medium whitespace-nowrap">
                  Onaylandı
                </span>
              ) : (
                <button
                  onClick={handleSendEmailVerification}
                  className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm rounded-lg font-medium hover:bg-yellow-200 transition-colors whitespace-nowrap"
                >
                  {emailVerificationSent ? 'Mail Gönderildi' : 'E-postayı Onayla'}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {settings.emailVerified 
                ? 'E-posta adresiniz onaylanmıştır' 
                : 'E-posta adresinizi onaylamak için butona tıklayın'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Ad Soyad</label>
            <input
              type="text"
              name="fullName"
              value={accountInfo.fullName}
              onChange={handleAccountInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ad ve soyadınızı giriniz"
            />
          </div>
        </div>
      </div>

      {/* Şifre Değiştirme */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Şifre Değiştirme</h2>
            <p className="text-sm text-gray-500 mt-1">Hesap güvenliğiniz için düzenli olarak şifrenizi güncelleyin</p>
          </div>
          <button
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
              setPasswordError('');
              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            {showPasswordForm ? 'İptal' : 'Şifre Değiştir'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 border-t border-gray-200 pt-6">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{passwordError}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Mevcut Şifre <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Mevcut şifrenizi giriniz"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Yeni Şifre <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Yeni şifrenizi giriniz (min. 6 karakter)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Şifre en az 6 karakter olmalıdır</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Yeni Şifre Tekrar <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Yeni şifrenizi tekrar giriniz"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordError('');
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Şifreyi Güncelle
              </button>
            </div>
          </form>
        )}
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

