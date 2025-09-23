'use client';

import { ReactNode } from 'react';
import { ComparisonProvider } from '@/contexts/ComparisonContext';

interface ClientProvidersProps {
  readonly children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ComparisonProvider>
      {children}
    </ComparisonProvider>
  );
}