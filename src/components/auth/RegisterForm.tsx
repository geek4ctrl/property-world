'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n/translation';
import { Input, Button } from '@/components/ui/FormComponents';
import { isSupabaseAvailable } from '@/lib/supabase';

interface RegisterFormProps {
  readonly onSuccess?: () => void;
  readonly redirectTo?: string;
}

export default function RegisterForm({ onSuccess, redirectTo = '/dashboard' }: Readonly<RegisterFormProps>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // Custom validation
    let hasErrors = false;
    
    if (!fullName.trim()) {
      setFullNameError(t('auth.field_required'));
      hasErrors = true;
    }
    
    if (!email.trim()) {
      setEmailError(t('auth.email_required'));
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('auth.invalid_email'));
      hasErrors = true;
    }
    
    if (!password.trim()) {
      setPasswordError(t('auth.password_required'));
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError(t('auth.password_min_length'));
      hasErrors = true;
    }
    
    if (!confirmPassword.trim()) {
      setConfirmPasswordError(t('auth.field_required'));
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t('auth.passwords_no_match'));
      hasErrors = true;
    }
    
    if (hasErrors) {
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign up user...', { email, fullName });
      const { error: signUpError, data } = await signUp(email, password, {
        full_name: fullName,
      });
      
      console.log('Sign up result:', { error: signUpError, data });
      
      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setError(signUpError.message);
      } else {
        setSuccess(true);
        setCountdown(10);
        
        // Start countdown timer
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Note: User will need to verify email before they can sign in
        // Increased timeout to give user time to read the message
        setTimeout(() => {
          clearInterval(countdownInterval);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/auth/login?message=Check your email to verify your account');
          }
        }, 10000); // 10 seconds instead of 2 seconds
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6 text-green-600 animate-bounce">
          <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('auth.registration_successful')}</h2>
        
        {/* Email verification notice - prominent animated box */}
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-4 border-blue-400 rounded-xl shadow-lg animate-pulse">
          <div className="flex items-start justify-center mb-3">
            <svg className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="text-left">
              <h3 className="text-xl font-bold text-blue-900 mb-2">{t('auth.check_your_email')}! 📧</h3>
              <p className="text-base text-blue-900 font-medium">
                {t('auth.check_email_verification')}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <p className="text-gray-700 text-sm mb-2">
            {t('auth.email_sent_to')}
          </p>
          <p className="text-lg font-bold text-gray-900">{email}</p>
        </div>
        
        <div className="space-y-4">
          <Link href="/auth/login" className="inline-block w-full">
            <Button className="w-full text-lg py-3">
              {t('auth.go_to_login')}
            </Button>
          </Link>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Redirecting in <strong className="text-blue-600">{countdown}</strong> seconds...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      {!isSupabaseAvailable() && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <strong className="text-amber-800">Development Mode</strong>
          </div>
          <p className="text-amber-700 mt-1">Using mock authentication. Set up Supabase for production.</p>
        </div>
      )}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {t('auth.create_account')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('auth.full_name')}
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t('auth.enter_full_name')}
          disabled={loading}
          error={fullNameError || undefined}
        />

        <Input
          label={t('auth.email_address')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.enter_email')}
          disabled={loading}
          error={emailError || undefined}
        />

        <div>
          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.enter_password')}
            disabled={loading}
            error={passwordError || undefined}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t('auth.password_min_length')}
          </p>
        </div>

        <Input
          label={t('auth.confirm_password')}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t('auth.confirm_password_placeholder')}
          disabled={loading}
          error={confirmPasswordError || undefined}
        />

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>{t('auth.registration_failed')}</strong>
              <br />
              {error}
              {error?.includes('not configured') && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <strong>Setup Required:</strong> Please configure your Supabase credentials in .env.local
                  <br />
                  <a 
                    href="/SUPABASE_SETUP.md" 
                    target="_blank" 
                    className="text-blue-600 hover:underline"
                  >
                    View Setup Guide
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          className="w-full"
        >
          {loading ? t('auth.creating_account') : t('auth.sign_up')}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link 
          href="/auth/login" 
          className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
        >
          {t('auth.have_account_sign_in')}
        </Link>
      </div>
    </div>
  );
}