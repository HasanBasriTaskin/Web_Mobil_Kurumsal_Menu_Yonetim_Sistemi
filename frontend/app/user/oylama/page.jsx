'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/services/api';

export default function OylamaPage() {
  const [activeVotings, setActiveVotings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voting, setVoting] = useState('');

  useEffect(() => {
    loadVotings();
  }, []);

  // Oylamaları yükle - localStorage'dan admin'in oluşturduğu anketleri al
  const loadVotings = async () => {
    try {
      setLoading(true);
      setError('');

      // API çağrısı yapılacak
      // const activeResponse = await apiClient.get('/voting/active');
      // setActiveVotings(activeResponse.data.data || []);

      // localStorage'dan admin'in oluşturduğu anketleri al
      if (typeof window !== 'undefined') {
        const savedVotings = localStorage.getItem('votings');
        if (savedVotings) {
          try {
            const allVotings = JSON.parse(savedVotings);
            
            // Aktif anketleri formatla (status: 'active')
            const active = allVotings
              .filter(v => v.status === 'active' && v.type === 'yesno')
              .map(v => {
                // Evet/Hayır anketi
                return {
                  id: `vote_${v.id}`,
                  type: 'yesno',
                  title: v.title,
                  description: v.description || '',
                  startDate: v.createdAt || new Date().toISOString().split('T')[0],
                  endDate: v.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  yesCount: v.yesCount || 0,
                  noCount: v.noCount || 0,
                  userVoted: v.userVote || null,
                  userCanVote: true
                };
              });
            
            setActiveVotings(active);
            setLoading(false);
            return;
          } catch (e) {
            console.error('Error parsing votings from localStorage:', e);
          }
        }
      }

      // Eğer localStorage'da anket yoksa, boş liste göster
      setActiveVotings([]);
      setLoading(false);
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

      // Oylama yap ve localStorage'ı güncelle
      setActiveVotings(prev => {
        const updated = prev.map(voting => {
          if (voting.id === votingId) {
            // Evet/Hayır anketi
            if (voting.type === 'yesno') {
              const newVote = optionId === 'yes' ? 'yes' : 'no';
              const previousVote = voting.userVoted;
              
              // Eğer aynı seçeneğe tekrar tıklanırsa oyu geri al
              if (previousVote === newVote) {
                return {
                  ...voting,
                  yesCount: newVote === 'yes' ? Math.max(0, voting.yesCount - 1) : voting.yesCount,
                  noCount: newVote === 'no' ? Math.max(0, voting.noCount - 1) : voting.noCount,
                  userVoted: null
                };
              }
              
              // Önceki oyu geri al
              let newYesCount = voting.yesCount;
              let newNoCount = voting.noCount;
              
              if (previousVote === 'yes') {
                newYesCount = Math.max(0, newYesCount - 1);
              } else if (previousVote === 'no') {
                newNoCount = Math.max(0, newNoCount - 1);
              }
              
              // Yeni oyu ekle
              if (newVote === 'yes') {
                newYesCount += 1;
              } else {
                newNoCount += 1;
              }
              
              return {
                ...voting,
                yesCount: newYesCount,
                noCount: newNoCount,
                userVoted: newVote
              };
            }
          }
          return voting;
        });
        
        // localStorage'daki anketleri güncelle
        if (typeof window !== 'undefined') {
          const savedVotings = localStorage.getItem('votings');
          if (savedVotings) {
            try {
              const allVotings = JSON.parse(savedVotings);
              // User'ın oy verdiği anketi güncelle
              const votingIdNum = parseInt(votingId.replace('vote_', ''));
              const updatedAllVotings = allVotings.map(v => {
                if (v.id === votingIdNum) {
                  const updatedVoting = updated.find(uv => uv.id === votingId);
                  if (updatedVoting && updatedVoting.type === 'yesno') {
                    return {
                      ...v,
                      userVote: updatedVoting.userVoted,
                      yesCount: updatedVoting.yesCount,
                      noCount: updatedVoting.noCount
                    };
                  }
                }
                return v;
              });
              localStorage.setItem('votings', JSON.stringify(updatedAllVotings));
            } catch (e) {
              console.error('Error updating votings in localStorage:', e);
            }
          }
        }
        
        return updated;
      });

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

                  {/* Evet/Hayır Anketi */}
                  {votingItem.type === 'yesno' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleVote(votingItem.id, 'yes')}
                          disabled={isVoting}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            votingItem.userVoted === 'yes'
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {votingItem.userVoted === 'yes' && (
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className="text-base font-semibold text-gray-900">Evet</span>
                          </div>
                          {votingItem.userVoted === 'yes' && (
                            <p className="text-xs text-green-600 mt-1 text-center">Seçtiniz</p>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleVote(votingItem.id, 'no')}
                          disabled={isVoting}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            votingItem.userVoted === 'no'
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-red-300'
                          } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {votingItem.userVoted === 'no' && (
                              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className="text-base font-semibold text-gray-900">Hayır</span>
                          </div>
                          {votingItem.userVoted === 'no' && (
                            <p className="text-xs text-red-600 mt-1 text-center">Seçtiniz</p>
                          )}
                        </button>
                      </div>
                      {votingItem.userVoted === null && (
                        <p className="text-sm text-gray-500 text-center py-2">Lütfen bir seçenek belirleyiniz.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Oylama Yok */}
      {activeVotings.length === 0 && (
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

