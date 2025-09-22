'use client';

import { ReactNode } from 'react';

interface ClientProvidersProps {
  readonly children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return <>{children}</>;
}