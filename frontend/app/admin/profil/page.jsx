'use client';

import { useState } from 'react';

export default function ProfilPage() {
  const [profileInfo, setProfileInfo] = useState({
    fullName: 'Administrator',
    email: 'admin@taskinnovation.com',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Profil güncelleme işlemi burada yapılacak (API çağrısı)
    setSuccessMessage('Profil bilgileri başarıyla güncellendi');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil</h1>
        <p className="text-gray-600">Profil bilgilerinizi yönetin</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Profil Bilgileri */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profil Bilgileri</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={profileInfo.fullName}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="Ad ve soyadınızı giriniz"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              E-posta <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={profileInfo.email}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              placeholder="E-posta adresinizi giriniz"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Bilgileri Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

