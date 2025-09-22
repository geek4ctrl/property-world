'use client';

import React from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface Props {
  children: React.ReactNode;
}

// Specialized error boundary for property-related components
export function PropertyErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="mb-4">
            <svg 
              className="w-12 h-12 text-orange-500 mx-auto mb-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to load properties
            </h3>
            <p className="text-gray-600 text-sm">
              We're having trouble loading the property data. Please try refreshing the page.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Refresh Page
          </button>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Property component error:', error, errorInfo);
        // You could send this to an analytics service
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Specialized error boundary for map components
export function MapErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center h-96 flex items-center justify-center">
          <div>
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Map unavailable
            </h3>
            <p className="text-gray-600 text-sm">
              We're unable to load the map at this time. Please try again later.
            </p>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Map component error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Specialized error boundary for search components
export function SearchErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="mb-3">
            <svg 
              className="w-8 h-8 text-yellow-500 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <h4 className="text-base font-medium text-gray-900 mb-1">
              Search temporarily unavailable
            </h4>
            <p className="text-gray-600 text-xs">
              Please refresh the page to restore search functionality.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Search component error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Generic page-level error boundary
export function PageErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Page-level error:', error, errorInfo);
        // Send to error reporting service in production
      }}
    >
      {children}
    </ErrorBoundary>
  );
}