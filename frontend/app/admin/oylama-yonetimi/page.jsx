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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [votingType, setVotingType] = useState('meal'); // 'meal' veya 'yesno'
  const [votingTitle, setVotingTitle] = useState('');
  const [votingDescription, setVotingDescription] = useState('');
  const [maxSelections, setMaxSelections] = useState(3);
  const [candidates, setCandidates] = useState([]);
  const [selectedMealId, setSelectedMealId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Mevcut anketler listesi
  const [votings, setVotings] = useState([
    {
      id: 1,
      type: 'meal',
      title: 'Gelecek ay görmek istediğiniz 3 yemek',
      description: 'Aşağıdaki yemeklerden 3 tanesini seçiniz',
      status: 'active',
      candidates: [],
      maxSelections: 3,
      createdAt: '2024-11-15'
    },
    {
      id: 2,
      type: 'yesno',
      title: 'Mevcut salata barından memnun musunuz?',
      description: 'Salata bar hizmeti hakkında görüşlerinizi paylaşın',
      status: 'draft',
      yesCount: 0,
      noCount: 0,
      createdAt: '2024-11-16'
    }
  ]);

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

  const handleCreateVoting = () => {
    if (!votingTitle.trim()) {
      setErrorMessage('Lütfen anket başlığı giriniz!');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (votingType === 'meal' && candidates.length === 0) {
      setErrorMessage('Lütfen en az bir yemek adayı ekleyiniz!');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const newVoting = {
      id: votings.length + 1,
      type: votingType,
      title: votingTitle,
      description: votingDescription,
      status: 'draft',
      maxSelections: votingType === 'meal' ? maxSelections : null,
      candidates: votingType === 'meal' ? candidates : [],
      yesCount: 0,
      noCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setVotings([...votings, newVoting]);
    setSuccessMessage('Anket başarıyla oluşturuldu!');
    setTimeout(() => setSuccessMessage(''), 5000);
    
    // Formu sıfırla
    setShowCreateForm(false);
    setVotingTitle('');
    setVotingDescription('');
    setCandidates([]);
    setSelectedMealId('');
    setVotingType('meal');
    setMaxSelections(3);
  };

  const handleStartVoting = (votingId) => {
    setVotings(votings.map(v => 
      v.id === votingId ? { ...v, status: 'active' } : v
    ));
  };

  const handleEndVoting = (votingId) => {
    setVotings(votings.map(v => 
      v.id === votingId ? { ...v, status: 'closed' } : v
    ));
  };

  const handleDeleteVoting = (votingId) => {
    if (confirm('Bu anketi silmek istediğinizden emin misiniz?')) {
      setVotings(votings.filter(v => v.id !== votingId));
    }
  };

  // Seçilebilir yemekler (zaten aday olmayanlar)
  const selectableMeals = availableMeals.filter(
    meal => !candidates.find(c => c.id === meal.id)
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Anket</h1>
          <p className="text-gray-600">Anket oluşturun ve yönetin</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setErrorMessage('');
            setSuccessMessage('');
          }}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          {showCreateForm ? 'İptal' : '+ Yeni Anket Oluştur'}
        </button>
      </div>

      {/* Başarı Mesajı */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

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

      {/* Yeni Anket Oluşturma Formu */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Yeni Anket Oluştur</h2>
          
          <div className="space-y-6">
            {/* Anket Türü */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Anket Türü <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setVotingType('meal');
                    setCandidates([]);
                  }}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    votingType === 'meal'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">Yemek Seçimi</div>
                  <div className="text-sm text-gray-500">Kullanıcılar yemek seçebilir (örn: Gelecek ay görmek istediğiniz 3 yemek)</div>
                </button>
                <button
                  onClick={() => {
                    setVotingType('yesno');
                    setCandidates([]);
                  }}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    votingType === 'yesno'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">Evet / Hayır</div>
                  <div className="text-sm text-gray-500">Kullanıcılar evet veya hayır seçebilir (örn: Salata barından memnun musunuz?)</div>
                </button>
              </div>
            </div>

            {/* Anket Başlığı */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Anket Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={votingTitle}
                onChange={(e) => setVotingTitle(e.target.value)}
                placeholder={votingType === 'meal' ? 'Örn: Gelecek ay görmek istediğiniz 3 yemek' : 'Örn: Mevcut salata barından memnun musunuz?'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Anket Açıklaması */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Açıklama
              </label>
              <textarea
                value={votingDescription}
                onChange={(e) => setVotingDescription(e.target.value)}
                placeholder="Anket hakkında açıklama (isteğe bağlı)"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Yemek Seçimi için özel alanlar */}
            {votingType === 'meal' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Maksimum Seçim Sayısı
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxSelections}
                    onChange={(e) => setMaxSelections(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Kullanıcıların kaç yemek seçebileceğini belirleyin</p>
                </div>

                {/* Aday Yemek Ekleme */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Aday Yemekler</h3>
                  <div className="flex gap-4 mb-4">
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
                        Ekle
                      </button>
                    </div>
                  </div>

                  {/* Aday Yemekler Listesi */}
                  {candidates.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {candidates.map((meal, index) => (
                        <div
                          key={meal.id}
                          className="border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="font-medium text-gray-900">{meal.name}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveCandidate(meal.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Form Butonları */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setVotingTitle('');
                  setVotingDescription('');
                  setCandidates([]);
                  setSelectedMealId('');
                  setVotingType('meal');
                  setMaxSelections(3);
                  setErrorMessage('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreateVoting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Anket Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mevcut Anketler Listesi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Mevcut Anketler</h2>
        
        {votings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Henüz anket oluşturulmamış.</p>
            <p className="text-sm text-gray-400">Yukarıdaki "Yeni Anket Oluştur" butonuna tıklayarak anket oluşturabilirsiniz.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {votings.map((voting) => (
              <div key={voting.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        voting.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        voting.status === 'active' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {voting.status === 'draft' ? 'Taslak' :
                         voting.status === 'active' ? 'Aktif' :
                         'Kapalı'}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {voting.type === 'meal' ? 'Yemek Seçimi' : 'Evet/Hayır'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{voting.title}</h3>
                    {voting.description && (
                      <p className="text-sm text-gray-600 mb-2">{voting.description}</p>
                    )}
                    {voting.type === 'meal' && (
                      <p className="text-xs text-gray-500">
                        Maksimum {voting.maxSelections} seçim • {voting.candidates.length} aday yemek
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Oluşturulma: {voting.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    {voting.status === 'draft' && (
                      <button
                        onClick={() => handleStartVoting(voting.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Başlat
                      </button>
                    )}
                    {voting.status === 'active' && (
                      <button
                        onClick={() => handleEndVoting(voting.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Bitir
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteVoting(voting.id)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                {/* Yemek Seçimi Anketi için Aday Listesi */}
                {voting.type === 'meal' && voting.candidates.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Aday Yemekler:</p>
                    <div className="flex flex-wrap gap-2">
                      {voting.candidates.map((meal, index) => (
                        <span
                          key={meal.id}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                        >
                          {index + 1}. {meal.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evet/Hayır Anketi için Sonuçlar */}
                {voting.type === 'yesno' && voting.status !== 'draft' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Sonuçlar:</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Evet</p>
                        <p className="text-2xl font-bold text-green-600">{voting.yesCount || 0}</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Hayır</p>
                        <p className="text-2xl font-bold text-red-600">{voting.noCount || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
