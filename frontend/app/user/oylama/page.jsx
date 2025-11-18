'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/services/api';

export default function OylamaPage() {
  const [activeVotings, setActiveVotings] = useState([]);
  const [pastVotings, setPastVotings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voting, setVoting] = useState('');

  useEffect(() => {
    loadVotings();
  }, []);

  // Oylamaları yükle
  const loadVotings = async () => {
    try {
      setLoading(true);
      setError('');

      // API çağrıları yapılacak
      // const activeResponse = await apiClient.get('/voting/active');
      // const pastResponse = await apiClient.get('/voting/past');
      // setActiveVotings(activeResponse.data.data || []);
      // setPastVotings(pastResponse.data.data || []);

      // Mock data (API hazır olduğunda yukarıdaki satırları kullan)
      setTimeout(() => {
        setActiveVotings([
          {
            id: 'vote_001',
            title: 'Gelecek Hafta (4-8 Kasım) Yemek Oylaması',
            description: 'Gelecek haftanın menüsünde hangi yemekleri görmek istersiniz?',
            startDate: '2025-11-03',
            endDate: '2025-11-05',
            options: [
              { id: 'opt_1', name: 'Hünkar Beğendi', votes: 45, userVoted: false },
              { id: 'opt_2', name: 'Izgara Köfte', votes: 38, userVoted: false },
              { id: 'opt_3', name: 'Tavuk Şinitzel', votes: 52, userVoted: false },
              { id: 'opt_4', name: 'Kuru Fasulye', votes: 28, userVoted: true },
              { id: 'opt_5', name: 'Rosto', votes: 31, userVoted: false }
            ],
            totalVotes: 194,
            userCanVote: true
          }
        ]);

        setPastVotings([
          {
            id: 'vote_002',
            title: 'Bu Hafta (28 Ekim - 1 Kasım) Yemek Oylaması',
            description: 'Haftalık menü seçimi',
            startDate: '2025-10-25',
            endDate: '2025-10-27',
            options: [
              { id: 'opt_6', name: 'Mantı', votes: 65, userVoted: true },
              { id: 'opt_7', name: 'Lahmacun', votes: 58, userVoted: false },
              { id: 'opt_8', name: 'İskender', votes: 42, userVoted: false }
            ],
            totalVotes: 165,
            userCanVote: false,
            winner: 'Mantı'
          }
        ]);

        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Oylamalar yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  // Oylama yap
  const handleVote = async (votingId, optionId) => {
    try {
      setVoting(`${votingId}_${optionId}`);
      
      // API çağrısı yapılacak
      // await apiClient.post('/voting/vote', {
      //   votingId: votingId,
      //   optionId: optionId
      // });

      // Mock - oylama yap (çoklu seçim: birden fazla yemeğe oy verilebilir)
      setActiveVotings(prev => 
        prev.map(voting => {
          if (voting.id === votingId) {
            const newOptions = voting.options.map(opt => {
              if (opt.id === optionId) {
                // Aynı seçeneğe tıklandığında: eğer zaten oy verilmişse geri al, yoksa oy ver
                if (opt.userVoted) {
                  return {
                    ...opt,
                    votes: Math.max(0, opt.votes - 1),
                    userVoted: false
                  };
                } else {
                  return {
                    ...opt,
                    votes: opt.votes + 1,
                    userVoted: true
                  };
                }
              }
              // Diğer seçenekler değişmez (çoklu seçim)
              return opt;
            });
            return {
              ...voting,
              options: newOptions,
              totalVotes: newOptions.reduce((sum, opt) => sum + opt.votes, 0),
              userCanVote: true // Kullanıcı istediği zaman oyunu değiştirebilir
            };
          }
          return voting;
        })
      );

      setVoting('');
    } catch (err) {
      console.error('Oylama yapılırken bir hata oluştu:', err);
      setVoting('');
    }
  };

  // Tarihi Türkçe formatında göster
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Yüzde hesapla
  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oylama</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Aktif Oylamalar */}
      {activeVotings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aktif Oylamalar</h2>
          
          <div className="space-y-6">
            {activeVotings.map((votingItem) => {
              const isVoting = voting.startsWith(votingItem.id);
              
              return (
                <div key={votingItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{votingItem.title}</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Aktif
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{votingItem.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Başlangıç: {formatDate(votingItem.startDate)}</span>
                      <span>Bitiş: {formatDate(votingItem.endDate)}</span>
                    </div>
                  </div>

                  {/* Oylama Seçenekleri - Tüm yemekler gösterilir ama sadece oy verdiğiniz yemekler görünür */}
                  <div className="space-y-3 mb-4">
                    {votingItem.options.map((option) => {
                      const isVotingThisOption = isVoting && voting.endsWith(option.id);
                      
                      // Sadece oy verilen yemekleri göster
                      if (!option.userVoted) {
                        return null;
                      }
                      
                      return (
                        <div key={option.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                onClick={() => handleVote(votingItem.id, option.id)}
                                disabled={isVoting}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  option.userVoted
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300 hover:border-blue-500'
                                } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {option.userVoted && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                              <span className="font-medium text-gray-900">{option.name}</span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                Seçtiniz
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {votingItem.options.filter(option => option.userVoted).length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">Henüz oy vermediniz.</p>
                    )}
                  </div>
                  
                  {/* Yeni Oy Vermek İçin Tüm Yemekler (Sadece Oylama İçin) */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Yeni Oy Vermek İçin:</h4>
                    <div className="space-y-2">
                      {votingItem.options
                        .filter(option => !option.userVoted) // Oy verilmeyen yemekleri göster
                        .map((option) => {
                          return (
                            <div key={option.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleVote(votingItem.id, option.id)}
                                  disabled={isVoting}
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors border-gray-300 hover:border-blue-500 ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                </button>
                                <span className="font-medium text-gray-900">{option.name}</span>
                              </div>
                            </div>
                          );
                        })}
                      {votingItem.options.filter(option => !option.userVoted).length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">Tüm seçeneklere oy verdiniz.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Geçmiş Oylamalar */}
      {pastVotings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Geçmiş Oylamalar</h2>
          
          <div className="space-y-6">
            {pastVotings.map((votingItem) => (
              <div key={votingItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-75">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{votingItem.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        Tamamlandı
                      </span>
                      {votingItem.winner && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          Kazanan: {votingItem.winner}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{votingItem.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Başlangıç: {formatDate(votingItem.startDate)}</span>
                    <span>Bitiş: {formatDate(votingItem.endDate)}</span>
                  </div>
                </div>

                {/* Sonuçlar - Sadece oy verdiğiniz yemekler gösterilir */}
                <div className="space-y-3">
                  {votingItem.options
                    .filter(option => option.userVoted) // Sadece oy verilen yemekleri göster
                    .map((option) => {
                      return (
                        <div key={option.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{option.name}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              Seçtiniz
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  {votingItem.options.filter(option => option.userVoted).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Bu oylamada oy vermediniz.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Oylama Yok */}
      {activeVotings.length === 0 && pastVotings.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">Henüz oylama bulunmamaktadır.</p>
        </div>
      )}
    </div>
  );
}

