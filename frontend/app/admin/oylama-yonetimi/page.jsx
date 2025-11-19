'use client';

import { useState, useEffect } from 'react';

export default function OylamaYonetimiPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [votingTitle, setVotingTitle] = useState('');
  const [votingDescription, setVotingDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Mevcut anketler listesi - localStorage'dan yükle
  const [votings, setVotings] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedVotings = localStorage.getItem('votings');
      if (savedVotings) {
        try {
          return JSON.parse(savedVotings);
        } catch (e) {
          console.error('Error parsing votings from localStorage:', e);
        }
      }
    }
    // Varsayılan anketler
    return [
      {
        id: 1,
        type: 'yesno',
        title: 'Mevcut salata barından memnun musunuz?',
        description: 'Salata bar hizmeti hakkında görüşlerinizi paylaşın',
        status: 'draft',
        yesCount: 0,
        noCount: 0,
        createdAt: '2024-11-16'
      }
    ];
  });

  // localStorage'dan anketleri yükle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVotings = localStorage.getItem('votings');
      if (savedVotings) {
        try {
          const parsed = JSON.parse(savedVotings);
          setVotings(parsed);
        } catch (e) {
          console.error('Error parsing votings from localStorage:', e);
        }
      }
    }
  }, []);

  const handleCreateVoting = () => {
    if (!votingTitle.trim()) {
      setErrorMessage('Lütfen anket başlığı giriniz!');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const newVoting = {
      id: votings.length + 1,
      type: 'yesno',
      title: votingTitle,
      description: votingDescription,
      status: 'draft',
      yesCount: 0,
      noCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedVotings = [...votings, newVoting];
    setVotings(updatedVotings);
    
    // localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('votings', JSON.stringify(updatedVotings));
    }
    
    setSuccessMessage('Anket başarıyla oluşturuldu!');
    setTimeout(() => setSuccessMessage(''), 5000);
    
    // Formu sıfırla
    setShowCreateForm(false);
    setVotingTitle('');
    setVotingDescription('');
  };

  const handleStartVoting = (votingId) => {
    const updatedVotings = votings.map(v => 
      v.id === votingId ? { ...v, status: 'active' } : v
    );
    setVotings(updatedVotings);
    
    // localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('votings', JSON.stringify(updatedVotings));
    }
  };

  const handleEndVoting = (votingId) => {
    const updatedVotings = votings.map(v => 
      v.id === votingId ? { ...v, status: 'closed' } : v
    );
    setVotings(updatedVotings);
    
    // localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('votings', JSON.stringify(updatedVotings));
    }
  };

  const handleDeleteVoting = (votingId) => {
    const updatedVotings = votings.filter(v => v.id !== votingId);
    setVotings(updatedVotings);
    
    // localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('votings', JSON.stringify(updatedVotings));
    }
  };

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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Yeni Evet/Hayır Anketi Oluştur</h2>
          
          <div className="space-y-6">
            {/* Anket Başlığı */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Anket Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={votingTitle}
                onChange={(e) => setVotingTitle(e.target.value)}
                placeholder="Örn: Mevcut salata barından memnun musunuz?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              />
            </div>

            {/* Form Butonları */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setVotingTitle('');
                  setVotingDescription('');
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
                        Evet/Hayır
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{voting.title}</h3>
                    {voting.description && (
                      <p className="text-sm text-gray-600 mb-2">{voting.description}</p>
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

                {/* Evet/Hayır Anketi için Sonuçlar */}
                {voting.status !== 'draft' && (
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
