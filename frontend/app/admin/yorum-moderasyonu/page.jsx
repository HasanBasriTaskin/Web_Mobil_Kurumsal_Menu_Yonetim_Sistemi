'use client';

import { useState, useEffect } from 'react';
import { feedbackAPI } from '@/services/api';
import { toast } from 'sonner';

export default function YorumModerasyonuPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAll();
      
      if (response.isSuccessful && response.data) {
        setFeedbacks(response.data);
      } else {
        setFeedbacks([]);
        toast.error('Yorumlar yüklenemedi');
      }
    } catch (error) {
      console.error('Yorumlar yükleme hatası:', error);
      setFeedbacks([]);
      toast.error('Yorumlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Filtreleme
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = searchTerm === '' || 
      feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 'all' || feedback.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  });

  // Basit istatistikler
  const totalComments = feedbacks.length;
  const averageRating = totalComments > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalComments).toFixed(1)
    : 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 bg-green-100';
    if (rating === 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanıcı Yorumları</h1>
        <p className="text-gray-600">Menü değerlendirmelerini görüntüleyin</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : totalComments === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Yorum Bulunmuyor</h3>
          <p className="text-gray-600">Kullanıcılar menüleri değerlendirdikçe yorumlar burada görünecektir.</p>
        </div>
      ) : (
        <>
          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Toplam Yorum</p>
              <p className="text-4xl font-bold text-blue-600">{totalComments}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Ortalama Puan</p>
              <p className="text-4xl font-bold text-green-600">{averageRating}/5</p>
            </div>
          </div>

          {/* Basit Filtreler */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Kullanıcı adı veya yorum ara..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="all">Tüm Puanlar</option>
                <option value="5">5 Yıldız</option>
                <option value="4">4 Yıldız</option>
                <option value="3">3 Yıldız</option>
                <option value="2">2 Yıldız</option>
                <option value="1">1 Yıldız</option>
              </select>
            </div>
          </div>

          {/* Yorumlar Listesi */}
          {filteredFeedbacks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">Filtreye uygun yorum bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {feedback.user?.firstName} {feedback.user?.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(feedback.createdAt)}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(feedback.rating)}`}>
                      {'⭐'.repeat(feedback.rating)}
                    </div>
                  </div>
                  
                  {feedback.comment && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-gray-700">{feedback.comment}</p>
                    </div>
                  )}
                  
                  {feedback.menu && (
                    <p className="text-sm text-gray-500">
                      Menü: {new Date(feedback.menu.menuDate).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
