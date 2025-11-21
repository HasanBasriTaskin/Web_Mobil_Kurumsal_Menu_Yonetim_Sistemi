'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminDashboardAPI } from '@/services/api';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalMeals: 0,
    activeMenus: 0,
    pendingComments: 0,
    activeVotings: 0,
    todayReservations: 0,
    tomorrowReservations: 0,
    thisWeekReservations: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await adminDashboardAPI.getSummary();
      console.log('Dashboard API Response:', response);

      if (response.success && response.data) {
        const data = response.data;
        
        setStats({
          totalMeals: data.menus?.total || 0,
          activeMenus: data.menus?.active || 0,
          pendingComments: data.feedback?.total || 0,
          activeVotings: data.surveys?.activeCount || 0,
          todayReservations: data.reservations?.today || 0,
          tomorrowReservations: data.reservations?.tomorrow || 0,
          thisWeekReservations: data.reservations?.thisWeek || 0,
          averageRating: data.feedback?.averageRating || 0,
        });
      } else {
        setError('Dashboard verileri yüklenemedi.');
      }
    } catch (error) {
      console.error('Dashboard istatistikleri yüklenemedi:', error);
      setError('Dashboard verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ana Sayfa</h1>
        <p className="text-gray-600">Yemekhane menü yönetim sistemi yönetici paneli</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Toplam Yemek */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Toplam Yemek</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalMeals}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        {/* Aktif Menüler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Aktif Menüler</p>
              <p className="text-4xl font-bold text-gray-900">{stats.activeMenus}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        </div>
        </div>

        {/* Bekleyen Yorumlar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Bekleyen Yorumlar</p>
              <p className="text-4xl font-bold text-gray-900">{stats.pendingComments}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
      </div>

        {/* Aktif Oylama */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Aktif Oylama</p>
              <p className="text-4xl font-bold text-gray-900">{stats.activeVotings}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Rezervasyon Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Bugün Rezervasyonlar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Bugünün Rezervasyonları</p>
              <p className="text-4xl font-bold text-green-600">{stats.todayReservations}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Yarın Rezervasyonlar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Yarının Rezervasyonları</p>
              <p className="text-4xl font-bold text-blue-600">{stats.tomorrowReservations}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bu Hafta Toplam */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Bu Hafta Toplam</p>
              <p className="text-4xl font-bold text-purple-600">{stats.thisWeekReservations}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hızlı İşlemler ve Son Aktiviteler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hızlı İşlemler */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Yeni Yemek Ekle */}
            <Link
              href="/admin/yemek-yonetimi"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Yeni Yemek Ekle</h3>
                <p className="text-xs text-gray-500">Yemek kaydı oluştur</p>
              </div>
            </Link>

            {/* Menü Oluştur */}
            <Link
              href="/admin/menu-yonetimi"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Menü Oluştur</h3>
                <p className="text-xs text-gray-500">Haftalık menü planla</p>
              </div>
            </Link>

            {/* Oylama Başlat */}
            <Link
              href="/admin/oylama-yonetimi"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Oylama Başlat</h3>
                <p className="text-xs text-gray-500">Yeni oylama başlat</p>
              </div>
            </Link>
            </div>
        </div>

        {/* Son Aktiviteler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-center mb-2">Henüz aktivite yok</p>
            <p className="text-sm text-gray-400 text-center">Yeni işlemler burada görünecek</p>
            </div>
        </div>
      </div>
    </div>
  );
}
