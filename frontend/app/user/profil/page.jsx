'use client';

import { useState, useEffect } from 'react';
import { profileAPI } from '@/services/api';

export default function ProfilPage() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() => {
    // Önce localStorage'dan user bilgisini al
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('Stored user from localStorage:', user);
        if (user.email) {
          setUserInfo({
            name: user.userName || user.email.split('@')[0] || '',
            email: user.email || ''
          });
        }
      } catch (e) {
        console.error('localStorage parse error:', e);
      }
    }
    
    loadUserProfile();
  }, []);

  // Kullanıcı profilini yükle
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await profileAPI.getMe();
      console.log('Profile API Response:', response);
      
      // API response'u normalize et
      const profileData = response?.data?.data || response?.data || response;
      console.log('Profile Data:', profileData);
      
      if (profileData) {
        const firstName = profileData.firstName || '';
        const lastName = profileData.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        setUserInfo({
          name: fullName || profileData.userName || profileData.email || '',
          email: profileData.email || ''
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Profil yükleme hatası:', err);
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

      // İsmi ayır (firstName ve lastName)
      const nameParts = userInfo.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await profileAPI.update({
        firstName,
        lastName
      });
      
      console.log('Update Profile Response:', response);
      
      // Response başarılı mı kontrol et
      const isSuccess = response?.success || response?.isSuccessful || response?.data?.success;
      
      if (isSuccess) {
        setSuccess('Profiliniz başarıyla güncellendi!');
        
        // Profili yeniden yükle
        await loadUserProfile();
        
        // Başarı mesajını 3 saniye sonra temizle
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response?.message || response?.data?.message || 'Profil güncellenirken bir hata oluştu.');
      }
      
      setSaving(false);
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
      setError(err.response?.data?.message || 'Profil güncellenirken bir hata oluştu.');
      setSaving(false);
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
                placeholder="Ad Soyad"
              />
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
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end gap-4 pt-6">
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

