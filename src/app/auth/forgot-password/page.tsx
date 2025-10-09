'use client';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Navigation back to home */}
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
            >
              <svg 
                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tanoluxe</h1>
            <p className="text-gray-600 mt-2">Reset your password</p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}