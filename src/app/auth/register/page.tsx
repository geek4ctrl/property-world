'use client';

import RegisterForm from '@/components/auth/RegisterForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useTranslation } from '@/i18n';

export default function RegisterPage() {
  const { t } = useTranslation();
  
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Property World</h1>
            <p className="text-gray-600 mt-2">{t('auth.create_your_account')}</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}