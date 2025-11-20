'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Initialize auth state from localStorage or cookie
  useEffect(() => {
    const initializeAuth = () => {
      try {
        let storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        // If no token in localStorage, try to get from cookie
        if (!storedToken) {
          const cookieToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
          
          if (cookieToken) {
            storedToken = cookieToken;
            // Sync back to localStorage
            localStorage.setItem('token', cookieToken);
          }
        }

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);

      console.log('📝 Login response:', response);

      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;

        console.log('✅ Token and user extracted:', { hasToken: !!newToken, user: userData });

        // Store in localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // Store token in cookie for middleware (expires in 7 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = `token=${newToken}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

        // Update state
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);

        toast.success(response.message || 'Giriş başarılı! Hoş geldiniz.');

        // Redirect based on role
        if (userData.role === 'Admin') {
          router.push('/admin');
        } else {
          router.push('/user');
        }

        return { success: true, user: userData };
      } else {
        toast.error(response.message || 'Giriş başarısız.');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (firstName, lastName, email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.register(firstName, lastName, email, password);

      console.log('📝 Register response:', response);

      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;

        // Backend'den firstName/lastName gelmediği için ekleyelim
        const enhancedUserData = {
          ...userData,
          firstName: firstName,
          lastName: lastName
        };

        console.log('✅ Token and user extracted:', { hasToken: !!newToken, user: enhancedUserData });

        // Store in localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(enhancedUserData));

        // Store token in cookie for middleware (expires in 7 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = `token=${newToken}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;

        // Update state
        setToken(newToken);
        setUser(enhancedUserData);
        setIsAuthenticated(true);

        toast.success(response.message || 'Kayıt başarılı! Hoş geldiniz.');

        // Redirect based on role (usually User for registration)
        if (enhancedUserData.role === 'Admin') {
          router.push('/admin');
        } else {
          router.push('/user');
        }

        return { success: true, user: enhancedUserData };
      } else {
        toast.error(response.message || 'Kayıt başarısız.');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('❌ Register error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Kayıt olunurken bir hata oluştu. Lütfen tekrar deneyin.';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
    
    // Set a flag to prevent "login required" toast
    localStorage.setItem('justLoggedOut', 'true');

    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    toast.info('Çıkış yapıldı.');

    // Redirect to login
    router.push('/');
    
    // Clear the flag after a short delay
    setTimeout(() => {
      localStorage.removeItem('justLoggedOut');
    }, 1000);
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await authAPI.forgotPassword(email);

      if (response.success) {
        toast.success(
          response.message ||
            'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
        );
        return { success: true };
      } else {
        toast.error(response.message || 'İşlem başarısız.');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Bir hata oluştu. Lütfen tekrar deneyin.';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email, token, newPassword, confirmNewPassword) => {
    try {
      setLoading(true);
      const response = await authAPI.resetPassword(email, token, newPassword, confirmNewPassword);

      if (response.success) {
        toast.success(
          response.message || 'Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.'
        );
        router.push('/');
        return { success: true };
      } else {
        toast.error(response.message || 'Şifre sıfırlama başarısız.');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Bir hata oluştu. Lütfen tekrar deneyin.';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'Admin';
  };

  // Check if user is regular user
  const isUser = () => {
    return user?.role === 'User';
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    hasRole,
    isAdmin,
    isUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export context for direct use if needed
export default AuthContext;

