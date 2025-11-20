'use client';

import { useState, useEffect } from 'react';
import { surveyAPI } from '@/services/api';
import { toast } from 'sonner';

export default function AnketPage() {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    loadActiveSurvey();
  }, []);

  const loadActiveSurvey = async () => {
    try {
      setLoading(true);
      const response = await surveyAPI.getActive();
      
      if (response.isSuccessful && response.data) {
        setSurvey(response.data);
      } else {
        setSurvey(null);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Anket yükleme hatası:', error);
        toast.error('Anket yüklenirken bir hata oluştu');
      }
      setSurvey(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitVote = async () => {
    if (selectedAnswer === null) {
      toast.error('Lütfen bir seçenek işaretleyin');
      return;
    }

    try {
      setSubmitting(true);
      const response = await surveyAPI.respond(survey.id, selectedAnswer);
      
      if (response.isSuccessful || response.success) {
        toast.success('Oyunuz başarıyla kaydedildi!');
        // Anketi yeniden yükle (hasUserResponded güncellenecek)
        await loadActiveSurvey();
        setSelectedAnswer(null);
      } else {
        toast.error(response.message || 'Oy kaydedilemedi');
      }
    } catch (error) {
      console.error('Oy gönderme hatası:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.Message || 'Oy gönderilirken bir hata oluştu';
      
      if (error.response?.status === 409) {
        toast.info('Bu ankete zaten oy kullandınız');
        await loadActiveSurvey();
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Anket yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Şu Anda Aktif Anket Bulunmuyor</h2>
            <p className="text-gray-600">Yeni bir anket yayınlandığında burada görünecektir.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Anket</h1>
          <p className="text-gray-600">Görüşlerinizi paylaşarak hizmet kalitemizi artırmamıza yardımcı olun</p>
        </div>

        {/* Anket Kartı */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Anket Durumu */}
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              ✓ Aktif Anket
            </span>
            {survey.endDate && (
              <span className="text-sm text-gray-500">
                ⏰ Bitiş: {formatDate(survey.endDate)}
              </span>
            )}
          </div>

          {/* Anket Başlık ve Soru */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{survey.title}</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-lg text-gray-800">{survey.question}</p>
            </div>
          </div>

          {/* Kullanıcı Zaten Oy Verdiyse */}
          {survey.hasUserResponded ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Teşekkür Ederiz!</h3>
              <p className="text-green-800">Bu ankete daha önce oy kullandınız.</p>
            </div>
          ) : (
            <>
              {/* Oy Seçenekleri */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => setSelectedAnswer(true)}
                  disabled={submitting}
                  className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                    selectedAnswer === true
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-white hover:border-green-300 hover:bg-gray-50'
                  } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === true ? 'border-green-500 bg-green-500' : 'border-gray-400'
                    }`}>
                      {selectedAnswer === true && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-xl font-semibold text-gray-900">Evet</span>
                      <p className="text-sm text-gray-600 mt-1">Olumlu görüş bildiriyorum</p>
                    </div>
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedAnswer(false)}
                  disabled={submitting}
                  className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                    selectedAnswer === false
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-red-300 hover:bg-gray-50'
                  } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === false ? 'border-red-500 bg-red-500' : 'border-gray-400'
                    }`}>
                      {selectedAnswer === false && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-xl font-semibold text-gray-900">Hayır</span>
                      <p className="text-sm text-gray-600 mt-1">Olumsuz görüş bildiriyorum</p>
                    </div>
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 9.586 8.707 8.707z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Gönder Butonu */}
              <button
                onClick={handleSubmitVote}
                disabled={submitting || selectedAnswer === null}
                className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    Oyu Gönder
                  </>
                )}
              </button>
            </>
          )}

          {/* Bilgilendirme */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              🔒 Oyunuz gizli tutulacak ve sadece istatistiksel amaçlarla kullanılacaktır
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

