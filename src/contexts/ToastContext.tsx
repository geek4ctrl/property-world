'use client';

import React, { createContext, useContext } from 'react';
import { useToast, Toast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';

interface ToastContextType {
  addToast: (message: string, type?: Toast['type'], duration?: number) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastUtils = useToast();

  return (
    <ToastContext.Provider value={toastUtils}>
      {children}
      <ToastContainer 
        toasts={toastUtils.toasts} 
        onRemove={toastUtils.removeToast} 
      />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}