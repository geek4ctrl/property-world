'use client';

import React, { useState, useEffect } from 'react';
import { errorService } from '@/lib/errorService';

// Development-only error overlay for debugging
export default function ErrorOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [errorStats, setErrorStats] = useState<any>(null);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const updateStats = () => {
      setErrorStats(errorService.getErrorStats());
    };

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000);
    updateStats(); // Initial call

    return () => clearInterval(interval);
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
        title="Show Error Stats (Dev Only)"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {errorStats?.total > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {errorStats.total}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-96 overflow-hidden z-50">
      <div className="bg-red-600 text-white p-3 flex items-center justify-between">
        <h3 className="font-bold text-sm">Error Stats (Dev Mode)</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="p-3 max-h-80 overflow-y-auto">
        {!errorStats || errorStats.total === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <svg className="w-8 h-8 mx-auto mb-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">No errors detected!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Total Errors */}
            <div className="text-center bg-red-50 p-2 rounded">
              <div className="text-lg font-bold text-red-600">{errorStats.total}</div>
              <div className="text-xs text-red-500">Total Errors</div>
            </div>

            {/* Error Breakdown */}
            {Object.keys(errorStats.byCode).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2 text-sm">By Error Type:</h4>
                <div className="space-y-1">
                  {Object.entries(errorStats.byCode).map(([code, count]) => (
                    <div key={code} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                      <span className="font-mono">{code}</span>
                      <span className="font-bold text-red-600">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Component Breakdown */}
            {Object.keys(errorStats.byComponent).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2 text-sm">By Component:</h4>
                <div className="space-y-1">
                  {Object.entries(errorStats.byComponent).map(([component, count]) => (
                    <div key={component} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                      <span className="font-mono">{component}</span>
                      <span className="font-bold text-blue-600">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Errors */}
            {errorStats.recent && errorStats.recent.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2 text-sm">Recent Errors:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {errorStats.recent.slice(-3).map((error: any, index: number) => (
                    <div key={index} className="text-xs bg-red-50 p-2 rounded border-l-2 border-red-400">
                      <div className="font-bold text-red-700">{error.code || 'Unknown'}</div>
                      <div className="text-red-600 truncate">{error.message}</div>
                      <div className="text-gray-500 mt-1">
                        {error.context?.component && `Component: ${error.context.component}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  errorService.clearErrors();
                  setErrorStats(errorService.getErrorStats());
                }}
                className="flex-1 bg-gray-600 text-white text-xs py-2 px-3 rounded hover:bg-gray-700 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setErrorStats(errorService.getErrorStats())}
                className="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}