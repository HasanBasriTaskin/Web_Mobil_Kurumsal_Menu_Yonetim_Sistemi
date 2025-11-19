'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * ProtectedRoute Component
 * Wraps pages that require authentication and/or specific roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} props.requiredRole - Required role ('Admin' or 'User')
 * @param {React.ReactNode} props.fallback - Loading fallback component
 */
export default function ProtectedRoute({ 
  children, 
  requiredRole = null,
  fallback = <LoadingScreen />
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to initialize
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.error('Bu sayfayı görüntülemek için giriş yapmalısınız.');
      router.push('/');
      return;
    }

    // Check role if required
    if (requiredRole && user?.role !== requiredRole) {
      toast.error('Bu sayfaya erişim yetkiniz yok.');
      
      // Redirect based on actual role
      if (user?.role === 'Admin') {
        router.push('/admin');
      } else if (user?.role === 'User') {
        router.push('/user');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, loading, requiredRole, router]);

  // Show loading state
  if (loading) {
    return fallback;
  }

  // Check authentication
  if (!isAuthenticated) {
    return null;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  // Render children if authorized
  return <>{children}</>;
}

// Loading screen component
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Yükleniyor...</p>
      </div>
    </div>
  );
}

