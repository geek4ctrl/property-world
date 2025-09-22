'use client';

import React from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Error boundary specifically for API and async operations
export function AsyncErrorBoundary({ children, fallback }: Props) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="mb-4">
              <svg 
                className="w-12 h-12 text-red-500 mx-auto mb-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Service Temporarily Unavailable
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                We're experiencing some technical difficulties. Please try again in a moment.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )
      }
      onError={(error, errorInfo) => {
        console.error('Async operation error:', error, errorInfo);
        
        // In production, send to error tracking service
        if (process.env.NODE_ENV === 'production') {
          // Example: sendToErrorTracking(error, errorInfo);
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Error boundary for form submissions and user interactions
export function InteractionErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="mb-3">
            <svg 
              className="w-8 h-8 text-red-500 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            <h4 className="text-base font-medium text-red-800 mb-1">
              Action Failed
            </h4>
            <p className="text-red-700 text-sm">
              Something went wrong with your request. Please try again.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('User interaction error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}