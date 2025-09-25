'use client';

import { ReactNode } from 'react';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { AuthProvider } from '@/contexts/AuthContext';

interface ClientProvidersProps {
  readonly children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <ComparisonProvider>
        {children}
      </ComparisonProvider>
    </AuthProvider>
  );
}