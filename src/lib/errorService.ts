// Global error handling utilities
export interface ErrorContext {
  page?: string;
  component?: string;
  action?: string;
  userId?: string;
  timestamp: Date;
}

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  context?: ErrorContext;
}

class ErrorService {
  private errorQueue: AppError[] = [];
  private isReporting = false;

  // Log error locally
  logError(error: AppError, context?: ErrorContext) {
    console.error('[PropertyWorld Error]', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      statusCode: error.statusCode,
      context: {
        ...error.context,
        ...context,
        timestamp: new Date(),
      },
    });

    // Add to queue for potential reporting
    this.errorQueue.push({
      ...error,
      context: {
        ...error.context,
        ...context,
        timestamp: new Date(),
      },
    });

    // In production, you might want to send to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, context);
    }
  }

  // Report error to external service (example implementation)
  private async reportError(error: AppError, context?: ErrorContext) {
    if (this.isReporting) return;
    
    try {
      this.isReporting = true;
      
      // Example: Send to your error reporting service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: error.message,
      //     stack: error.stack,
      //     code: error.code,
      //     statusCode: error.statusCode,
      //     context: { ...error.context, ...context },
      //   }),
      // });
      
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    } finally {
      this.isReporting = false;
    }
  }

  // Create custom error types
  createPropertyError(message: string, propertyId?: string): AppError {
    const error = new Error(message) as AppError;
    error.code = 'PROPERTY_ERROR';
    error.context = {
      page: 'property',
      component: 'PropertyDetails',
      action: 'fetch',
      timestamp: new Date(),
    };
    if (propertyId) {
      error.context.action = `fetch_property_${propertyId}`;
    }
    return error;
  }

  createSearchError(message: string, filters?: any): AppError {
    const error = new Error(message) as AppError;
    error.code = 'SEARCH_ERROR';
    error.context = {
      page: 'search',
      component: 'PropertySearch',
      action: 'search',
      timestamp: new Date(),
    };
    return error;
  }

  createMapError(message: string): AppError {
    const error = new Error(message) as AppError;
    error.code = 'MAP_ERROR';
    error.context = {
      page: 'map',
      component: 'PropertyMap',
      action: 'render',
      timestamp: new Date(),
    };
    return error;
  }

  createApiError(message: string, statusCode: number, endpoint?: string): AppError {
    const error = new Error(message) as AppError;
    error.code = 'API_ERROR';
    error.statusCode = statusCode;
    error.context = {
      component: 'API',
      action: endpoint || 'unknown_endpoint',
      timestamp: new Date(),
    };
    return error;
  }

  // Utility to wrap async functions with error handling
  wrapAsync<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: ErrorContext
  ) {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        const appError = error as AppError;
        appError.context = { 
          ...appError.context, 
          ...context,
          timestamp: new Date()
        };
        this.logError(appError, context);
        throw appError;
      }
    };
  }

  // Get error statistics
  getErrorStats() {
    const stats = {
      total: this.errorQueue.length,
      byCode: {} as Record<string, number>,
      byComponent: {} as Record<string, number>,
      recent: this.errorQueue.slice(-10),
    };

    this.errorQueue.forEach(error => {
      // Count by error code
      const code = error.code || 'unknown';
      stats.byCode[code] = (stats.byCode[code] || 0) + 1;

      // Count by component
      const component = error.context?.component || 'unknown';
      stats.byComponent[component] = (stats.byComponent[component] || 0) + 1;
    });

    return stats;
  }

  // Clear error queue (useful for testing or memory management)
  clearErrors() {
    this.errorQueue = [];
  }
}

// Export singleton instance
export const errorService = new ErrorService();

// Helper hook for React components
import { useCallback } from 'react';

export function useErrorHandler() {
  const handleError = useCallback((error: Error, context?: ErrorContext) => {
    errorService.logError(error as AppError, context);
  }, []);

  const createAndHandleError = useCallback((
    message: string, 
    type: 'property' | 'search' | 'map' | 'api',
    additionalContext?: ErrorContext
  ) => {
    let error: AppError;
    
    switch (type) {
      case 'property':
        error = errorService.createPropertyError(message);
        break;
      case 'search':
        error = errorService.createSearchError(message);
        break;
      case 'map':
        error = errorService.createMapError(message);
        break;
      case 'api':
        error = errorService.createApiError(message, 500);
        break;
      default:
        error = new Error(message) as AppError;
    }

    errorService.logError(error, additionalContext);
    return error;
  }, []);

  return {
    handleError,
    createAndHandleError,
    wrapAsync: errorService.wrapAsync.bind(errorService),
    getStats: errorService.getErrorStats.bind(errorService),
  };
}