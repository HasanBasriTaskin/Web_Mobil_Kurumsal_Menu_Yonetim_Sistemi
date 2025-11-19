'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // true: login, false: register
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // JWT token'dan kullanıcı bilgilerini çıkar
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Lütfen email ve şifre giriniz');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(email, password);
      
      if (response.isSuccessful && response.data) {
        // Token'ı al
        const token = response.data.accessToken || response.data.token;
        
        if (token) {
          // Token'ı kaydet
          localStorage.setItem('token', token);
          
          // Token'dan kullanıcı bilgilerini çıkar
          const decodedToken = decodeToken(token);
          
          if (decodedToken) {
            // JWT token'dan email ve role bilgilerini al
            const userEmail = decodedToken.email || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || email;
            const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role || 'User';
            const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decodedToken.sub || decodedToken.userId;
            
            // Kullanıcı bilgilerini kaydet
            localStorage.setItem('user', JSON.stringify({
              email: userEmail,
              role: userRole,
              id: userId,
              username: decodedToken.sub || userEmail.split('@')[0],
            }));
            
            // Role göre yönlendir
            if (userRole === 'Admin' || userRole === 'admin') {
              router.push('/admin');
            } else {
              router.push('/user');
            }
          } else {
            // Token decode edilemezse, sadece email ile devam et
            localStorage.setItem('user', JSON.stringify({
              email: email,
              role: 'User',
            }));
            router.push('/user');
          }
        } else {
          setError('Giriş başarısız: Token alınamadı');
          setIsLoading(false);
        }
      } else {
        // Hata mesajını backend'den al
        const errorMessage = response.errors?.[0]?.message || 
                            response.errors?.[0]?.error || 
                            response.message || 
                            'Email veya şifre hatalı';
        setError(errorMessage);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Backend'den gelen hata mesajını göster
      const errorMessage = error.response?.data?.errors?.[0]?.message ||
                          error.response?.data?.message ||
                          error.response?.data?.title ||
                          error.message ||
                          'Giriş yapılırken bir hata oluştu';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!firstName || !lastName || !schoolEmail || !registerPassword) {
      setError('Lütfen tüm alanları doldurunuz');
      setIsLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(firstName, lastName, schoolEmail, registerPassword);
      
      if (response.isSuccessful) {
        // Email'i kaydet (login formuna geçmeden önce)
        const registeredEmail = schoolEmail;
        
        // Başarı mesajı göster
        setSuccess('Hesabınız başarıyla oluşturuldu! Giriş yapabilirsiniz.');
        setIsLoading(false);
        
        // Formu temizle
        setFirstName('');
        setLastName('');
        setSchoolEmail('');
        setRegisterPassword('');
        
        // 2 saniye sonra login formuna geç
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
          // Email alanını doldur (kullanıcı kolaylığı için)
          setEmail(registeredEmail);
        }, 2000);
      } else {
        // Hata mesajını backend'den al
        let errorMessage = 'Kayıt olurken bir hata oluştu';
        
        console.log('Register response (error):', response);
        
        if (response.errors) {
          if (Array.isArray(response.errors)) {
            // ErrorDetail formatındaki hatalar
            const messages = response.errors
              .map(err => err.message || err.error || err.field)
              .filter(Boolean);
            errorMessage = messages.length > 0 ? messages.join(', ') : errorMessage;
          } else if (typeof response.errors === 'object') {
            // Validation hataları (field bazlı)
            const validationErrors = [];
            Object.keys(response.errors).forEach(key => {
              if (Array.isArray(response.errors[key])) {
                response.errors[key].forEach(msg => {
                  validationErrors.push(msg);
                });
              }
            });
            errorMessage = validationErrors.length > 0 ? validationErrors.join(', ') : errorMessage;
          }
        } else if (response.message) {
          errorMessage = response.message;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Register error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      // Network hatası kontrolü
      if (!error.response) {
        setError('Backend\'e bağlanılamadı. Backend çalışıyor mu kontrol edin (http://localhost:5000)');
        setIsLoading(false);
        return;
      }
      
      // Response data'yı al (bazen data direkt response'da olabilir)
      const responseData = error.response?.data || error.response || {};
      
      // Backend validation hatalarını topla
      if (responseData.errors) {
        let errorMessage = 'Kayıt olurken bir hata oluştu';
        
        if (Array.isArray(responseData.errors)) {
          // ErrorDetail formatındaki hatalar
          const messages = responseData.errors
            .map(err => err.message || err.error || err.field)
            .filter(Boolean);
          errorMessage = messages.length > 0 ? messages.join(', ') : errorMessage;
        } else if (typeof responseData.errors === 'object') {
          // Validation hataları (field bazlı)
          const validationErrors = [];
          Object.keys(responseData.errors).forEach(key => {
            if (Array.isArray(responseData.errors[key])) {
              responseData.errors[key].forEach(msg => {
                validationErrors.push(msg);
              });
            }
          });
          errorMessage = validationErrors.length > 0 ? validationErrors.join(', ') : errorMessage;
        }
        
        setError(errorMessage);
      } else if (responseData.message) {
        setError(responseData.message);
      } else if (responseData.title) {
        setError(responseData.title);
      } else {
        // Genel hata mesajı
        const statusText = error.response?.statusText || '';
        const status = error.response?.status || 'Unknown';
        setError(`Kayıt olurken bir hata oluştu (${status} ${statusText})`);
      }
      
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!forgotPasswordEmail) {
      setError('Lütfen e-posta adresinizi giriniz');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.forgotPassword(forgotPasswordEmail);
      
      if (response.isSuccessful) {
        setSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
        setForgotPasswordEmail('');
        setIsLoading(false);
        
        // 3 saniye sonra login formuna dön
        setTimeout(() => {
          setShowForgotPassword(false);
          setSuccess('');
        }, 3000);
      } else {
        setError(response.message || response.error || 'Bir hata oluştu');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.response?.data?.message || error.message || 'Bir hata oluştu');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sol Taraf - Logo ve Açıklama */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 flex-col justify-center items-center px-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">CafeteriaCo</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Günlük mutfak yolculuğunuz burada başlar.
          </h2>
          <p className="text-gray-300 text-lg">
            Menüleri görüntülemek, sipariş vermek ve hesabınızı yönetmek için giriş yapın.
          </p>
        </div>
      </div>

      {/* Sağ Taraf - Login/Register Formu */}
      <div className="w-full lg:w-1/2 bg-green-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Toggle Buttons - Şifre sıfırlama formunda gizle */}
            {!showForgotPassword && (
              <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setSuccess('');
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    isLogin
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Giriş Yap
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setSuccess('');
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    !isLogin
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Üye Ol
                </button>
              </div>
            )}

            {/* Başlıklar - Şifre sıfırlama formunda gizle */}
            {!showForgotPassword && (
              <>
                {isLogin ? (
                  <>
                    <h2 className="text-3xl font-bold text-green-600 mb-2">Tekrar Hoş Geldiniz</h2>
                    <p className="text-green-600 mb-8">Kurumsal hesabınızla giriş yapın</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Kurumsal Menü Yönetim Sistemi</h2>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Hesap Oluştur</h3>
                    <p className="text-gray-600 mb-8 text-sm">Lütfen resmi kurum e-posta adresinizi kullanın.</p>
                  </>
                )}
              </>
            )}

            {/* Google ve Microsoft Butonları - Sadece Login'de ve şifre sıfırlama formunda değilken göster */}
            {isLogin && !showForgotPassword && (
              <>
                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-gray-700 font-medium">Google ile Devam Et</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00A4EF">
                      <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                    </svg>
                    <span className="text-gray-700 font-medium">Microsoft ile Devam Et</span>
                  </button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-green-600">veya e-posta ile giriş yapın</span>
                  </div>
                </div>
              </>
            )}

            {/* Hata Mesajı */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Başarı Mesajı */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            {/* Şifre Sıfırlama Formu */}
            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail('');
                      setError('');
                      setSuccess('');
                    }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Geri Dön
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Şifremi Unuttum</h3>
                  <p className="text-gray-600 text-sm">
                    E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz.
                  </p>
                </div>

                <div>
                  <label htmlFor="forgotPasswordEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta Adresi
                  </label>
                  <input
                    id="forgotPasswordEmail"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="E-posta adresinizi girin"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                </button>
              </form>
            ) : isLogin ? (
              <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresinizi girin"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Şifre
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setError('');
                      setSuccess('');
                    }}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Şifremi Unuttum?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi girin"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none pr-12 text-gray-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Örn: Ahmet"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Soyad
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Örn: Yılmaz"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="schoolEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Kurum E-postası
                  </label>
                  <input
                    id="schoolEmail"
                    type="email"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                    placeholder="Örn: ahmet.yilmaz@kurum.com.tr"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre
                  </label>
                  <div className="relative">
                    <input
                      id="registerPassword"
                      type={showRegisterPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Şifrenizi giriniz"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none pr-12 text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showRegisterPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Kayıt yapılıyor...' : 'Kaydet'}
                </button>
              </form>
            )}

            {isLogin && !showForgotPassword && (
              <div className="mt-6 text-center">
                <a href="#" className="text-sm text-green-600 hover:text-green-700">
                  Yardıma mı ihtiyacınız var?
                </a>
              </div>
            )}
          </div>

          {/* Test Bilgileri (Geliştirme için) */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-2">Test Kullanıcıları:</p>
            <p>Admin: admin@taskinnovation.com / Taskinnovation1234!</p>
            <p>User: user@company.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
