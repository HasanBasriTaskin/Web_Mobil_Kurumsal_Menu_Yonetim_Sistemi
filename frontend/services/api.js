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
      // Debug: Token'ın varlığını kontrol et
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
      });
    } else {
      console.warn('API Request without token:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and format normalization
apiClient.interceptors.response.use(
  (response) => {
    // Backend response formatını normalize et
    // Backend: { isSuccessful, statusCode, data, errors }
    // Frontend beklentisi: { success, data, message }
    if (response.data && typeof response.data === 'object') {
      const backendResponse = response.data;
      
      // Backend formatını frontend formatına dönüştür
      const normalizedResponse = {
        success: backendResponse.isSuccessful ?? backendResponse.success ?? true,
        data: backendResponse.data,
        message: backendResponse.message || '',
        errors: backendResponse.errors || null,
        statusCode: backendResponse.statusCode || response.status
      };
      
      // Auth response için özel dönüşüm
      if (normalizedResponse.data?.accessToken) {
        // JWT token'ı decode et
        const token = normalizedResponse.data.accessToken;
        
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const decoded = JSON.parse(jsonPayload);
          
          // User bilgisini token'dan çıkar
          const userEmail = decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';
          const userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || 'User';
          const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.sub || '';
          const userName = decoded.sub || userEmail.split('@')[0];
          
          // Normalized format
          normalizedResponse.data = {
            token: token,
            user: {
              id: userId,
              email: userEmail,
              role: userRole,
              userName: userName
            }
          };
          
          console.log('✅ Auth response normalized:', {
            hasToken: !!token,
            userEmail,
            userRole
          });
        } catch (err) {
          console.error('Token decode error:', err);
        }
      }
      
      response.data = normalizedResponse;
    }
    
    return response;
  },
  (error) => {
    // Error response'u logla (debug için)
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // 401 hatası için detaylı bilgi
      if (error.response.status === 401) {
        const token = localStorage.getItem('token');
        console.error('401 Unauthorized - Token Info:', {
          hasToken: !!token,
          tokenPreview: token ? token.substring(0, 30) + '...' : 'No token',
          currentPath: typeof window !== 'undefined' ? window.location.pathname : 'N/A'
        });
      }
    } else if (error.request) {
      console.error('API Request Error (No Response):', {
        url: error.config?.url,
        message: error.message
      });
    } else {
      console.error('API Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Sadece zaten giriş yapmış kullanıcılar için yönlendirme yap
      // Login sayfasındayken yönlendirme yapma (login sayfası '/' path'inde)
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const isLoginPage = currentPath === '/' || currentPath === '/login';
      
      if (!isLoginPage) {
        console.warn('401 Unauthorized - Redirecting to login page');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    
    // Error'u olduğu gibi döndür (frontend'de handle edilecek)
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
  resetPassword: async (email, token, newPassword, confirmNewPassword) => {
    const response = await apiClient.post('/auth/reset-password', {
      email,
      token,
      newPassword,
      confirmNewPassword,
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

// Reservation API Functions
export const reservationAPI = {
  // GET /api/reservations/me - Kullanıcının rezervasyonlarını getir
  getMyReservations: async () => {
    const response = await apiClient.get('/reservations/me');
    return response.data;
  },

  // POST /api/reservations - Rezervasyon yap
  create: async (menuId) => {
    const response = await apiClient.post('/reservations', {
      menuId,
    });
    return response.data;
  },

  // DELETE /api/reservations/{id} - Rezervasyon iptal et
  cancel: async (id) => {
    const response = await apiClient.delete(`/reservations/${id}`);
    return response.data;
  },

  // GET /api/admin/reservations/summary - Rezervasyon özeti (Admin)
  getSummary: async () => {
    const response = await apiClient.get('/admin/reservations/summary');
    return response.data;
  },

  // GET /api/admin/reservations/daily - Günlük rezervasyonlar (Admin)
  getDaily: async (date) => {
    const response = await apiClient.get(`/admin/reservations/daily?date=${date}`);
    return response.data;
  },
};

// Feedback API Functions
export const feedbackAPI = {
  // POST /api/feedback - Geri bildirim gönder
  submit: async (menuId, rating, comment = '') => {
    const response = await apiClient.post('/feedback', {
      menuId,
      rating,
      comment,
    });
    return response.data;
  },

  // PUT /api/feedback/{id} - Geri bildirimi güncelle
  update: async (feedbackId, rating, comment = '') => {
    const response = await apiClient.put(`/feedback/${feedbackId}`, {
      rating,
      comment,
    });
    return response.data;
  },

  // GET /api/feedback/daily/{menuId} - Günlük geri bildirimler
  getDaily: async (menuId) => {
    const response = await apiClient.get(`/feedback/daily/${menuId}`);
    return response.data;
  },

  // GET /api/admin/feedback - Tüm geri bildirimler (Admin)
  getAll: async () => {
    const response = await apiClient.get('/admin/feedback');
    return response.data;
  },
};

// Profile API Functions
export const profileAPI = {
  // GET /api/profile/me - Kullanıcı profilini getir
  getMe: async () => {
    const response = await apiClient.get('/profile/me');
    return response.data;
  },

  // PUT /api/profile/me - Kullanıcı profilini güncelle
  update: async (profileData) => {
    const response = await apiClient.put('/profile/me', profileData);
    return response.data;
  },
};

// Notification API Functions
export const notificationAPI = {
  // GET /api/notifications - Kullanıcı bildirimlerini getir
  getAll: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  // POST /api/notifications/mark-read - Bildirimleri okundu olarak işaretle
  markAsRead: async (notificationId = null, markAllAsRead = false) => {
    const body = markAllAsRead 
      ? { markAllAsRead: true }
      : { notificationId };
    
    const response = await apiClient.post('/notifications/mark-read', body);
    return response.data;
  },
};

export default apiClient;
