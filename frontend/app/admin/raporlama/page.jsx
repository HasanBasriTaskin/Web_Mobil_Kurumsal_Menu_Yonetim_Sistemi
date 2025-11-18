'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Örnek yemek verileri (gerçek uygulamada API'den gelecek)
const mealData = [
  { id: 1, name: 'Mercimek Çorbası', averageRating: 4.8, totalRatings: 125, category: 'Çorba' },
  { id: 2, name: 'Tavuk Döner', averageRating: 4.5, totalRatings: 98, category: 'Ana Yemek' },
  { id: 3, name: 'Köfte', averageRating: 4.2, totalRatings: 87, category: 'Ana Yemek' },
  { id: 4, name: 'Pilav', averageRating: 3.9, totalRatings: 112, category: 'Yan Yemek' },
  { id: 5, name: 'Salata', averageRating: 3.5, totalRatings: 76, category: 'Salata' },
  { id: 6, name: 'Makarna', averageRating: 4.6, totalRatings: 94, category: 'Ana Yemek' },
  { id: 7, name: 'Baklava', averageRating: 4.9, totalRatings: 68, category: 'Tatlı' },
  { id: 8, name: 'Izgara Tavuk', averageRating: 4.3, totalRatings: 82, category: 'Ana Yemek' },
];

export default function RaporlamaPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' veya 'popularity'

  // Kategorilere göre filtreleme
  const categories = ['all', ...new Set(mealData.map(meal => meal.category))];
  
  const filteredMeals = mealData.filter(meal => 
    filterCategory === 'all' || meal.category === filterCategory
  );

  // Sıralama
  const sortedMeals = [...filteredMeals].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.averageRating - a.averageRating;
    } else {
      return b.totalRatings - a.totalRatings;
    }
  });

  // En sevilen ve sevilmeyen yemekler
  const topMeals = sortedMeals.slice(0, 5);
  const bottomMeals = [...sortedMeals].reverse().slice(0, 5);

  // Genel istatistikler
  const overallAverage = mealData.reduce((sum, meal) => sum + meal.averageRating, 0) / mealData.length;
  const totalRatings = mealData.reduce((sum, meal) => sum + meal.totalRatings, 0);

  // Grafik verileri
  const chartData = sortedMeals.map(meal => ({
    name: meal.name.length > 15 ? meal.name.substring(0, 15) + '...' : meal.name,
    fullName: meal.name,
    puan: meal.averageRating,
    degerlendirme: meal.totalRatings
  }));

  // Kategori dağılımı
  const categoryData = categories.filter(cat => cat !== 'all').map(cat => {
    const mealsInCategory = mealData.filter(meal => meal.category === cat);
    return {
      name: cat,
      value: mealsInCategory.length,
      totalRatings: mealsInCategory.reduce((sum, meal) => sum + meal.totalRatings, 0)
    };
  });

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlama</h1>
        <p className="text-gray-600">Yemeklerin puan ortalamalarını ve popülerliklerini görüntüleyin</p>
      </div>

      {/* Genel İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Genel Ortalama Puan</p>
          <p className="text-4xl font-bold text-green-600">{overallAverage.toFixed(1)}</p>
          <p className="text-xs text-gray-500 mt-1">5 üzerinden</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Toplam Değerlendirme</p>
          <p className="text-4xl font-bold text-blue-600">{totalRatings}</p>
          <p className="text-xs text-gray-500 mt-1">Yorum sayısı</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Toplam Yemek</p>
          <p className="text-4xl font-bold text-purple-600">{mealData.length}</p>
          <p className="text-xs text-gray-500 mt-1">Farklı yemek</p>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Filtresi
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Tüm Kategoriler' : cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sıralama
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="rating">Puana Göre</option>
              <option value="popularity">Popülerliğe Göre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Yemek Puanları Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Yemek Puanları</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis domain={[0, 5]} />
              <Tooltip 
                formatter={(value) => value.toFixed(1)}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
              />
              <Legend />
              <Bar dataKey="puan" fill="#10b981" name="Puan (5 üzerinden)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Kategori Dağılımı Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Kategori Dağılımı</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* En Sevilen Yemekler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">En Sevilen Yemekler</h2>
          <div className="space-y-4">
            {topMeals.map((meal, index) => (
              <div key={meal.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{meal.name}</p>
                      <p className="text-xs text-gray-500">{meal.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{meal.averageRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">{meal.totalRatings} değerlendirme</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(meal.averageRating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* En Sevilmeyen Yemekler */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">En Sevilmeyen Yemekler</h2>
          <div className="space-y-4">
            {bottomMeals.map((meal, index) => (
              <div key={meal.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{meal.name}</p>
                      <p className="text-xs text-gray-500">{meal.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{meal.averageRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">{meal.totalRatings} değerlendirme</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${(meal.averageRating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detaylı Yemek Listesi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Tüm Yemekler - Puan Ortalamaları</h2>
        <div className="space-y-4">
          {sortedMeals.map((meal) => (
            <div key={meal.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-base font-semibold text-gray-900">{meal.name}</p>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {meal.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{meal.totalRatings} değerlendirme</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-gray-900">{meal.averageRating.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">/ 5.0</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    meal.averageRating >= 4.5 ? 'bg-green-600' :
                    meal.averageRating >= 4.0 ? 'bg-blue-600' :
                    meal.averageRating >= 3.5 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${(meal.averageRating / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
