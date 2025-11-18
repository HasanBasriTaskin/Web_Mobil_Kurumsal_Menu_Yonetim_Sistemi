'use client';

import { useState } from 'react';

// Mevcut yemekler (gerçek uygulamada API'den gelecek)
const availableMeals = [
  { id: 1, name: 'Mercimek Çorbası', category: 'Çorba' },
  { id: 2, name: 'Tavuk Döner', category: 'Ana Yemek' },
  { id: 3, name: 'Köfte', category: 'Ana Yemek' },
  { id: 4, name: 'Pilav', category: 'Yan Yemek' },
  { id: 5, name: 'Salata', category: 'Salata' },
  { id: 6, name: 'Makarna', category: 'Ana Yemek' },
  { id: 7, name: 'Baklava', category: 'Tatlı' },
  { id: 8, name: 'Izgara Tavuk', category: 'Ana Yemek' },
  { id: 9, name: 'Mantı', category: 'Ana Yemek' },
  { id: 10, name: 'Lahmacun', category: 'Ana Yemek' },
];

export default function OylamaYonetimiPage() {
  const [candidates, setCandidates] = useState([]);
  const [votingStatus, setVotingStatus] = useState('draft'); // 'draft', 'active', 'closed'
  const [selectedMealId, setSelectedMealId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddCandidate = () => {
    if (!selectedMealId) {
      setErrorMessage('Lütfen bir yemek seçiniz!');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const meal = availableMeals.find(m => m.id === parseInt(selectedMealId));
    if (!meal) return;

    if (candidates.find(c => c.id === meal.id)) {
      setErrorMessage('Bu yemek zaten aday listesinde!');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setErrorMessage('');
    setCandidates([...candidates, meal]);
    setSelectedMealId('');
  };

  const handleRemoveCandidate = (mealId) => {
    setCandidates(candidates.filter(c => c.id !== mealId));
  };

  const handleStartVoting = () => {
    if (candidates.length === 0) {
      setErrorMessage('Lütfen en az bir yemek adayı ekleyiniz!');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setErrorMessage('');
    setVotingStatus('active');
  };

  const handleEndVoting = () => {
    setVotingStatus('closed');
  };

  const handleResetVoting = () => {
    setCandidates([]);
    setVotingStatus('draft');
  };

  // Seçilebilir yemekler (zaten aday olmayanlar)
  const selectableMeals = availableMeals.filter(
    meal => !candidates.find(c => c.id === meal.id)
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oylama Yönetimi</h1>
        <p className="text-gray-600">Gelecek haftanın yemek adaylarını belirleyin ve oylamayı yönetin</p>
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

      {/* Oylama Durumu */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Oylama Durumu</p>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                votingStatus === 'draft' ? 'bg-gray-100 text-gray-700' :
                votingStatus === 'active' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {votingStatus === 'draft' ? 'Taslak' :
                 votingStatus === 'active' ? 'Aktif' :
                 'Kapalı'}
              </span>
              {votingStatus === 'active' && (
                <p className="text-sm text-gray-600">Kullanıcılar şu anda oy verebilir</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {votingStatus === 'draft' && (
              <button
                onClick={handleStartVoting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Oylamayı Başlat
              </button>
            )}
            {votingStatus === 'active' && (
              <button
                onClick={handleEndVoting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Oylamayı Bitir
              </button>
            )}
            {votingStatus === 'closed' && (
              <button
                onClick={handleResetVoting}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Yeni Oylama Oluştur
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Aday Yemek Ekleme */}
      {votingStatus === 'draft' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aday Yemek Ekle</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yemek Seçin
              </label>
              <select
                value={selectedMealId}
                onChange={(e) => setSelectedMealId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Yemek seçiniz...</option>
                {selectableMeals.map(meal => (
                  <option key={meal.id} value={meal.id}>
                    {meal.name} ({meal.category})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddCandidate}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Aday Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aday Yemekler Listesi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Aday Yemekler ({candidates.length})
          </h2>
          {candidates.length > 0 && votingStatus === 'draft' && (
            <p className="text-sm text-gray-500">
              En az 1 yemek ekledikten sonra oylamayı başlatabilirsiniz
            </p>
          )}
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Henüz aday yemek eklenmemiş.</p>
            {votingStatus === 'draft' && (
              <p className="text-sm text-gray-400">
                Yukarıdaki formdan yemek adayları ekleyebilirsiniz.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map((meal, index) => (
              <div
                key={meal.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <p className="font-semibold text-gray-900">{meal.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{meal.category}</p>
                  </div>
                  {votingStatus === 'draft' && (
                    <button
                      onClick={() => handleRemoveCandidate(meal.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
                {votingStatus === 'active' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Oy Sayısı:</span>
                      <span className="font-semibold text-green-600">0</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Oylama Sonuçları (Kapalı oylama için) */}
      {votingStatus === 'closed' && candidates.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Oylama Sonuçları</h2>
          <div className="space-y-4">
            {candidates.map((meal, index) => (
              <div key={meal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">{meal.name}</p>
                      <p className="text-sm text-gray-500">{meal.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-xs text-gray-500">oy</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
