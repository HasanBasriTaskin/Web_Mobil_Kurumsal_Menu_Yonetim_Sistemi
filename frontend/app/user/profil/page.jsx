'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/services/api';

export default function ProfilPage() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    department: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Şifre değiştirme için state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');


  useEffect(() => {
    loadUserProfile();
  }, []);

  // Kullanıcı profilini yükle
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError('');

      // API çağrısı yapılacak
      // const response = await apiClient.get('/profile/me');
      // setUserInfo(response.data.data);

      // Mock data (API hazır olduğunda yukarıdaki satırları kullan)
      setTimeout(() => {
        const storedUser = localStorage.getItem('user');
        let mockUser = {
          name: 'Kullanıcı',
          email: 'user@company.com',
          department: 'Yazılım Geliştirme'
        };

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            mockUser = {
              ...mockUser,
              name: user.name || user.email?.split('@')[0] || 'Kullanıcı',
              email: user.email || 'user@company.com'
            };
          } catch (err) {
            console.error('Kullanıcı bilgisi okunamadı:', err);
          }
        }

        setUserInfo(mockUser);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Profil bilgileri yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };


  // Profili kaydet
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // API çağrısı yapılacak
      // await apiClient.put('/profile/me', {
      //   department: userInfo.department
      // });

      // Mock - başarılı
      setTimeout(() => {
        setSuccess('Profiliniz başarıyla güncellendi!');
        setSaving(false);
        
        // Başarı mesajını 3 saniye sonra temizle
        setTimeout(() => setSuccess(''), 3000);
      }, 500);
    } catch (err) {
      setError('Profil güncellenirken bir hata oluştu.');
      setSaving(false);
    }
  };

  // Şifre değiştir
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Şifreler eşleşmiyor.');
      return;
    }

    try {
      setChangingPassword(true);

      // API çağrısı yapılacak
      // await apiClient.put('/profile/change-password', {
      //   oldPassword: passwordData.oldPassword,
      //   newPassword: passwordData.newPassword
      // });

      // Mock - başarılı
      setTimeout(() => {
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setChangingPassword(false);
      }, 500);
    } catch (err) {
      setPasswordError('Şifre değiştirilemedi.');
      setChangingPassword(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil</h1>
        <p className="text-gray-600">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
      </div>

      {/* Başarı/Hata Mesajları */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-800 font-medium">{success}</p>
          </div>
          <button
            onClick={() => setSuccess('')}
            className="text-green-600 hover:text-green-800"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Şifre Değiştirme Formu */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Şifre Değiştir</h2>
        
        {passwordError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{passwordError}</p>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Eski Şifre
            </label>
            <input
              id="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifre
            </label>
            <input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifre Tekrar
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changingPassword ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
            </button>
          </div>
        </form>
      </div>

      {/* Profil Formu */}
      <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Temel Bilgiler */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Bu bilgi sistem yöneticisi tarafından yönetilmektedir.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={userInfo.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none cursor-not-allowed text-gray-900"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departman
              </label>
              <input
                type="text"
                value={userInfo.department || ''}
                onChange={(e) => setUserInfo({ ...userInfo, department: e.target.value })}
                placeholder="Departmanınızı giriniz"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => loadUserProfile()}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

