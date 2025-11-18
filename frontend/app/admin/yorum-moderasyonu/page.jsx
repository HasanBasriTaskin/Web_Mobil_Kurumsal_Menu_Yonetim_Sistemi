'use client';

import { useState } from 'react';

export default function YorumModerasyonuPage() {
  const [viewMode, setViewMode] = useState('raw');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('7');

  const [allComments, setAllComments] = useState([
    {
      id: 1,
      employeeId: '12345',
      comment: 'Yeni makarna yemeği harikaydı, ancak porsiyon boyutu fiyatına göre biraz küçük geldi. Daha büyük bir seçenek görmek isterim.',
      date: '26 Eki 2024',
      time: '13:15',
      status: 'pending'
    },
    {
      id: 2,
      employeeId: '54321',
      comment: 'Salata barında daha fazla çeşitlilik gerekiyor. Haftalardır aynı seçenekler var. Ayrıca bugün marul çok taze değildi.',
      date: '26 Eki 2024',
      time: '11:30',
      status: 'pending'
    },
    {
      id: 3,
      employeeId: '67890',
      comment: 'Yeni kahve makinesini seviyorum! Çok daha hızlı ve kahve tadı harika. Yükseltme için teşekkürler.',
      date: '25 Eki 2024',
      time: '16:55',
      status: 'approved'
    },
    {
      id: 4,
      employeeId: '11223',
      comment: 'Lütfen daha fazla vejetaryen seçenek olabilir mi? Özellikle sıcak yemekler için seçenekler çok sınırlı. Izgara istasyonu her zaman dolu ve uzun bekleme süresi sinir bozucu. Öğle yemeği saatlerinde süreci hızlandırmak için başka bir kişi eklenmesini öneriyorum.',
      date: '25 Eki 2024',
      time: '09:02',
      status: 'pending'
    }
  ]);

  const handleApprove = (comment) => {
    setAllComments(allComments.map(c => 
      c.id === comment.id ? { ...c, status: 'approved' } : c
    ));
  };

  const handleReject = (comment) => {
    setAllComments(allComments.map(c => 
      c.id === comment.id ? { ...c, status: 'rejected' } : c
    ));
  };

  const filteredComments = allComments
    .filter(comment => {
      const matchesSearch = comment.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comment.employeeId.includes(searchQuery);
      return matchesSearch;
    })
    .sort((a, b) => {
      // Tarih sırasına göre sıralama (en yeni en üstte)
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateB - dateA; // Ters sıralama (en yeni önce)
    });

  // İstatistikler hesaplama
  const stats = {
    total: allComments.length,
    pending: allComments.filter(c => c.status === 'pending').length,
    approved: allComments.filter(c => c.status === 'approved').length,
    rejected: allComments.filter(c => c.status === 'rejected').length,
    pendingPercentage: allComments.length > 0 
      ? Math.round((allComments.filter(c => c.status === 'pending').length / allComments.length) * 100)
      : 0
  };

  // Raw List View Render
  const renderRawListView = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Tüm Yorumlar</h2>
        <p className="text-sm text-gray-500 mt-1">En yeniden eskiye sıralanmıştır</p>
      </div>
      {filteredComments.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500">Yorum bulunamadı.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-semibold text-gray-900">
                      Çalışan #{comment.employeeId}
                    </p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      comment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      comment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {comment.status === 'approved' ? 'Onaylandı' :
                       comment.status === 'rejected' ? 'Reddedildi' :
                       'Bekliyor'}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">{comment.comment}</p>
                  <p className="text-xs text-gray-500">
                    {comment.date}, {comment.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Card View Render
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredComments.length === 0 ? (
        <div className="col-span-full p-12 text-center bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">Yorum bulunamadı.</p>
        </div>
      ) : (
        filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900">
                  Çalışan #{comment.employeeId}
                </p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  comment.status === 'approved' ? 'bg-green-100 text-green-800' :
                  comment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {comment.status === 'approved' ? 'Onaylandı' :
                   comment.status === 'rejected' ? 'Reddedildi' :
                   'Bekliyor'}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-3 line-clamp-4 leading-relaxed">{comment.comment}</p>
              <p className="text-xs text-gray-500">
                {comment.date}, {comment.time}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              {comment.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(comment)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => handleReject(comment)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Reddet
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Analytics View Render
  const renderAnalyticsView = () => (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Toplam Yorum</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Bekleyen</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500 mt-1">%{stats.pendingPercentage}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Onaylanan</p>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-xs text-gray-500 mt-1">
            %{stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Reddedilen</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-xs text-gray-500 mt-1">
            %{stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}
          </p>
        </div>
      </div>

      {/* Durum Dağılımı */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Durum Dağılımı</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Bekleyen</span>
              <span className="text-gray-900 font-medium">{stats.pending} yorum</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all" 
                style={{ width: `${stats.pendingPercentage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Onaylanan</span>
              <span className="text-gray-900 font-medium">{stats.approved} yorum</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all" 
                style={{ width: `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Reddedilen</span>
              <span className="text-gray-900 font-medium">{stats.rejected} yorum</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all" 
                style={{ width: `${stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
        <div className="space-y-3">
          {allComments.slice(0, 5).map((comment) => (
            <div key={comment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm text-gray-900 font-medium">Çalışan #{comment.employeeId}</p>
                <p className="text-xs text-gray-500">{comment.date}, {comment.time}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                comment.status === 'approved' ? 'bg-green-100 text-green-800' :
                comment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {comment.status === 'approved' ? 'Onaylandı' :
                 comment.status === 'rejected' ? 'Reddedildi' :
                 'Bekliyor'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanıcı Yorumları</h1>
        <p className="text-gray-600">Kullanıcılar tarafından gönderilen tüm yorumları inceleyin, en yeniden eskiye sıralanmıştır.</p>
      </div>

      {/* View Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => setViewMode('raw')}
            className={`pb-4 px-2 font-medium transition-colors border-b-2 text-base ${
              viewMode === 'raw'
                ? 'text-green-600 border-green-600'
                : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            Liste Görünümü
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`pb-4 px-2 font-medium transition-colors border-b-2 text-base ${
              viewMode === 'card'
                ? 'text-green-600 border-green-600'
                : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            Kart Görünümü
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`pb-4 px-2 font-medium transition-colors border-b-2 text-base ${
              viewMode === 'analytics'
                ? 'text-green-600 border-green-600'
                : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            Analitik Görünüm
          </button>
        </div>
      </div>

      {/* Search and Filter Bar - Only for Raw and Card View */}
      {(viewMode === 'raw' || viewMode === 'card') && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Anahtar kelime ile ara"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="relative">
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="7">Son 7 Gün</option>
                <option value="30">Son 30 Gün</option>
                <option value="90">Son 90 Gün</option>
                <option value="all">Tüm Zamanlar</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* View Content */}
      {viewMode === 'raw' && renderRawListView()}
      {viewMode === 'card' && renderCardView()}
      {viewMode === 'analytics' && renderAnalyticsView()}
    </div>
  );
}
