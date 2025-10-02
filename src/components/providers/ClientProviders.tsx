'use client';

import { ReactNode } from 'react';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

interface ClientProvidersProps {
  readonly children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ComparisonProvider>
          {children}
        </ComparisonProvider>
      </ToastProvider>
    </AuthProvider>
  );
}