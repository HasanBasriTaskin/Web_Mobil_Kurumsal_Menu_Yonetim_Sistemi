'use client';

import { useState, useEffect } from 'react';
import { surveyAPI } from '@/services/api';
import { toast } from 'sonner';

export default function OylamaYonetimiPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [votingTitle, setVotingTitle] = useState('');
  const [votingDescription, setVotingDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [surveyResults, setSurveyResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    loadActiveSurvey();
  }, []);

  const loadActiveSurvey = async () => {
    try {
      setLoading(true);
      const response = await surveyAPI.getActive();
      
      if ((response.isSuccessful || response.success) && response.data) {
        setActiveSurvey(response.data);
        // Anket varsa sonuçları da yükle
        if (response.data.id) {
          loadSurveyResults(response.data.id);
        }
      } else {
        setActiveSurvey(null);
        setSurveyResults(null);
      }
    } catch (error) {
      // 404 hatası normaldir - aktif anket olmayabilir veya durdurulmuş olabilir
      if (error.response?.status !== 404) {
        console.error('Anket yükleme hatası:', error);
      }
      setActiveSurvey(null);
      setSurveyResults(null);
    } finally {
      setLoading(false);
    }
  };

  const loadSurveyResults = async (surveyId) => {
    try {
      setLoadingResults(true);
      const response = await surveyAPI.getResults(surveyId);
      
      if ((response.isSuccessful || response.success) && response.data) {
        setSurveyResults(response.data);
      }
    } catch (error) {
      console.error('Anket sonuçları yükleme hatası:', error);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleCreateVoting = async () => {
    if (!votingTitle.trim()) {
      toast.error('Lütfen anket başlığı giriniz!');
      return;
    }

    if (!votingDescription.trim()) {
      toast.error('Lütfen anket sorusu giriniz!');
      return;
    }

    try {
      setLoading(true);
      const surveyData = {
        title: votingTitle,
        question: votingDescription,
        endDate: endDate || null
      };

      const response = await surveyAPI.create(surveyData);
      
      if (response.isSuccessful || response.success) {
        toast.success('Anket başarıyla oluşturuldu ve aktif edildi!');
        
        // Response'dan gelen anket bilgisini direkt kullan
        if (response.data) {
          setActiveSurvey(response.data);
          // Sonuçları yükle (yeni oluşturuldu, 0 oy var)
          if (response.data.id) {
            loadSurveyResults(response.data.id);
          }
        }
        
        setShowCreateForm(false);
        setVotingTitle('');
        setVotingDescription('');
        setEndDate('');
      } else {
        toast.error(response.message || 'Anket oluşturulamadı');
      }
    } catch (error) {
      console.error('Anket oluşturma hatası:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.Message || 'Anket oluşturulurken bir hata oluştu';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!activeSurvey) return;

    try {
      setLoading(true);
      const newStatus = !activeSurvey.isActive;
      const response = await surveyAPI.updateStatus(activeSurvey.id, newStatus);
      
      if (response.isSuccessful || response.success) {
        toast.success(`Anket ${newStatus ? 'aktif edildi' : 'durduruldu'}`);
        
        // State'i direkt güncelle, API'den tekrar çekme
        // Çünkü getActive sadece aktif anketleri döndürür
        setActiveSurvey(prev => ({
          ...prev,
          isActive: newStatus
        }));
      } else {
        toast.error(response.message || 'Durum güncellenemedi');
      }
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.Message || 'Durum güncellenirken bir hata oluştu';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSurvey = async () => {
    if (!activeSurvey) return;

    if (!confirm('Bu anketi silmek üzeresiniz. Devam etmek istiyor musunuz?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await surveyAPI.deleteSurvey(activeSurvey.id);

      if (response.isSuccessful || response.success) {
        toast.success('Anket başarıyla silindi');
        setActiveSurvey(null);
        setSurveyResults(null);
        setShowCreateForm(true);
      } else {
        toast.error(response.message || 'Anket silinemedi');
      }
    } catch (error) {
      console.error('Anket silme hatası:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.Message || 'Anket silinirken bir hata oluştu';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirsiz';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Anket Yönetimi</h1>
          <p className="text-gray-600">Evet/Hayır anketi oluşturun ve yönetin</p>
        </div>
        {!activeSurvey && (
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
            }}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {showCreateForm ? 'İptal' : '+ Yeni Anket Oluştur'}
          </button>
        )}
      </div>

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
                placeholder="Örn: Kafeterya Memnuniyet Anketi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{votingTitle.length}/200 karakter</p>
            </div>

            {/* Anket Sorusu */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Anket Sorusu (Evet/Hayır) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={votingDescription}
                onChange={(e) => setVotingDescription(e.target.value)}
                placeholder="Örn: Mevcut salata barından memnun musunuz?"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{votingDescription.length}/500 karakter</p>
            </div>

            {/* Bitiş Tarihi */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Bitiş Tarihi (İsteğe Bağlı)
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Boş bırakırsanız anket süresiz olacaktır</p>
            </div>

            {/* Form Butonları */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setVotingTitle('');
                  setVotingDescription('');
                  setEndDate('');
                }}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleCreateVoting}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Oluşturuluyor...
                  </>
                ) : (
                  'Anket Oluştur ve Yayınla'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mevcut Anket */}
      {loading && !activeSurvey ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : activeSurvey ? (
        <div className="space-y-6">
          {/* Anket Bilgileri */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activeSurvey.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {activeSurvey.isActive ? '✓ Aktif' : 'Durduruldu'}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Evet/Hayır Anketi
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{activeSurvey.title}</h3>
                <p className="text-gray-700 mb-3">{activeSurvey.question}</p>
                {activeSurvey.endDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>⏰ Bitiş: {formatDate(activeSurvey.endDate)}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleToggleStatus}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    activeSurvey.isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {activeSurvey.isActive ? 'Durdur' : 'Yeniden Başlat'}
                </button>
                <button
                  onClick={handleDeleteSurvey}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>

          {/* Anket Sonuçları */}
          {loadingResults ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Sonuçlar yükleniyor...</p>
            </div>
          ) : surveyResults ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Anket Sonuçları</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Toplam Katılımcı</p>
                  <p className="text-3xl font-bold text-blue-600">{surveyResults.totalResponses}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Evet</p>
                  <p className="text-3xl font-bold text-green-600">{surveyResults.yesCount}</p>
                  <p className="text-xs text-gray-500 mt-1">%{surveyResults.yesPercentage}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Hayır</p>
                  <p className="text-3xl font-bold text-red-600">{surveyResults.noCount}</p>
                  <p className="text-xs text-gray-500 mt-1">%{surveyResults.noPercentage}</p>
                </div>
              </div>

              {/* Görsel Grafik */}
              {surveyResults.totalResponses > 0 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">Evet</span>
                      <span className="text-sm text-gray-600">{surveyResults.yesCount} oy (%{surveyResults.yesPercentage})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${surveyResults.yesPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-red-700">Hayır</span>
                      <span className="text-sm text-gray-600">{surveyResults.noCount} oy (%{surveyResults.noPercentage})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-red-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${surveyResults.noPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Aktif Anket Bulunmuyor</h3>
          <p className="text-gray-600 mb-4">Kullanıcıların katılabileceği yeni bir anket oluşturun</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            + Yeni Anket Oluştur
          </button>
        </div>
      )}
    </div>
  );
}
