// API Service using Axios
// Example configuration for making API requests

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Sadece zaten giriş yapmış kullanıcılar için yönlendirme yap
      // Login sayfasındayken yönlendirme yapma (login sayfası '/' path'inde)
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const isLoginPage = currentPath === '/' || currentPath === '/login';
      
      if (!isLoginPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API Functions
export const authAPI = {
  // POST /api/auth/register - Kayıt ol
  register: async (firstName, lastName, email, password) => {
    const response = await apiClient.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  },

  // POST /api/auth/login - Giriş yap
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // POST /api/auth/forgot-password - Şifre sıfırlama isteği
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  // POST /api/auth/reset-password - Şifre sıfırlama
  resetPassword: async (token, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
};

// Menu API Functions
export const menuAPI = {
  // GET /api/menu/weekly - Haftalık menüleri getir
  getWeekly: async (week = 'current') => {
    const response = await apiClient.get(`/menu/weekly?week=${week}`);
    return response.data;
  },

  // GET /api/menu/today - Bugünün menüsünü getir
  getToday: async () => {
    const response = await apiClient.get('/menu/today');
    return response.data;
  },

  // GET /api/admin/menu/{id} - Belirli bir menüyü getir (Admin)
  getById: async (id) => {
    const response = await apiClient.get(`/admin/menu/${id}`);
    return response.data;
  },

  // GET /api/menu/top-rated - En yüksek puanlı menüleri getir
  getTopRated: async (count = 5) => {
    const response = await apiClient.get(`/top-rated?count=${count}`);
    return response.data;
  },

  // POST /api/admin/menu - Yeni menü oluştur (Admin)
  create: async (menuData) => {
    const response = await apiClient.post('/admin/menu', menuData);
    return response.data;
  },

  // PUT /api/admin/menu/{id} - Menüyü güncelle (Admin)
  update: async (id, menuData) => {
    const response = await apiClient.put(`/admin/menu/${id}`, menuData);
    return response.data;
  },

  // DELETE /api/admin/menu/{id} - Menüyü sil (Admin)
  delete: async (id, force = false) => {
    const response = await apiClient.delete(`/admin/menu/${id}?force=${force}`);
    return response.data;
  },
};

export default apiClient;
