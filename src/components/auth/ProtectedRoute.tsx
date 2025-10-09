'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/translation';

interface ProtectedRouteProps {  
  readonly children: React.ReactNode;
  readonly redirectTo?: string;
  readonly requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login',
  requireAuth = true 
}: Readonly<ProtectedRouteProps>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        // Redirect authenticated users away from auth pages
        router.push('/dashboard');
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // If we require auth and user is not authenticated, show loading while redirecting
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.redirecting')}</p>
        </div>
      </div>
    );
  }

  // If we don't require auth (auth pages) and user is authenticated, show loading while redirecting
  if (!requireAuth && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.redirecting_to_dashboard')}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}