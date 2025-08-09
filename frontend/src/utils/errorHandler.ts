// frontend/src/utils/errorHandler.ts

import { AppError, ApiError, ValidationError } from '../types';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

// Error codes
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  TIMEOUT = 'TIMEOUT',
}

// Create standardized error object
export const createError = (
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  code?: string,
  status?: number,
  details?: unknown
): AppError => ({
  message,
  code: code || type,
  status,
  details,
});

// Parse API error response
export const parseApiError = (error: unknown): AppError => {
  // Handle axios errors
  if (error && typeof error === 'object' && 'response' in error && error.response) {
    const { status, data } = error.response as { status: number; data: unknown };
    
    switch (status) {
      case 400:
        return createError(
          (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') ? data.message : 'Invalid request',
          ErrorType.VALIDATION,
          ErrorCode.VALIDATION_ERROR,
          status,
          data
        );
      case 401:
        return createError(
          'Authentication required',
          ErrorType.AUTHENTICATION,
          ErrorCode.UNAUTHORIZED,
          status
        );
      case 403:
        return createError(
          'Access denied',
          ErrorType.AUTHORIZATION,
          ErrorCode.FORBIDDEN,
          status
        );
      case 404:
        return createError(
          'Resource not found',
          ErrorType.NOT_FOUND,
          ErrorCode.NOT_FOUND,
          status
        );
      case 429:
        return createError(
          'Too many requests. Please try again later.',
          ErrorType.VALIDATION,
          ErrorCode.RATE_LIMIT_EXCEEDED,
          status
        );
      case 500:
        return createError(
          'Internal server error',
          ErrorType.SERVER_ERROR,
          ErrorCode.INTERNAL_SERVER_ERROR,
          status
        );
      default:
        return createError(
          (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') ? data.message : 'An error occurred',
          ErrorType.UNKNOWN,
          undefined,
          status,
          data
        );
    }
  }

  // Handle network errors
  if (error && typeof error === 'object' && 'request' in error && error.request) {
    return createError(
      'Network error. Please check your connection.',
      ErrorType.NETWORK,
      ErrorCode.NETWORK_ERROR
    );
  }

  // Handle timeout errors
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
    return createError(
      'Request timeout. Please try again.',
      ErrorType.NETWORK,
      ErrorCode.TIMEOUT
    );
  }

  // Handle validation errors
  if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
            return createError(
          'Validation error',
          ErrorType.VALIDATION,
          ErrorCode.VALIDATION_ERROR,
          undefined,
          (error as { details?: unknown }).details
        );
  }

  // Handle unknown errors
  return createError(
    (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') ? error.message : 'An unexpected error occurred',
    ErrorType.UNKNOWN
  );
};

// Validation error handler
export const handleValidationError = (errors: ValidationError[]): AppError => {
  const messages = errors.map(err => `${err.field}: ${err.message}`).join(', ');
  return createError(
    `Validation failed: ${messages}`,
    ErrorType.VALIDATION,
    ErrorCode.VALIDATION_ERROR,
    undefined,
    errors
  );
};

// Async error wrapper
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  errorHandler?: (error: AppError) => void
): Promise<T> => {
  try {
    return await asyncFn();
  } catch (error) {
    const appError = parseApiError(error);
    
    // Log error for debugging
    console.error('Error occurred:', {
      message: appError.message,
      code: appError.code,
      status: appError.status,
      details: appError.details,
      originalError: error,
    });

    // Call custom error handler if provided
    if (errorHandler) {
      errorHandler(appError);
    }

    throw appError;
  }
};

// Error boundary error handler
export const handleErrorBoundaryError = (error: Error, errorInfo: unknown): AppError => {
  console.error('Error boundary caught error:', error, errorInfo);
  
  return createError(
    'Something went wrong. Please refresh the page.',
    ErrorType.UNKNOWN,
    'REACT_ERROR',
    undefined,
    { error: error.message, errorInfo }
  );
};

// User-friendly error messages
export const getUserFriendlyMessage = (error: AppError): string => {
  switch (error.code) {
    case ErrorCode.NETWORK_ERROR:
      return 'Connection error. Please check your internet connection and try again.';
    case ErrorCode.VALIDATION_ERROR:
      return 'Please check your input and try again.';
    case ErrorCode.UNAUTHORIZED:
      return 'Please log in to continue.';
    case ErrorCode.FORBIDDEN:
      return 'You don\'t have permission to perform this action.';
    case ErrorCode.NOT_FOUND:
      return 'The requested resource was not found.';
    case ErrorCode.RATE_LIMIT_EXCEEDED:
      return 'Too many requests. Please wait a moment and try again.';
    case ErrorCode.TIMEOUT:
      return 'Request timed out. Please try again.';
    case ErrorCode.INTERNAL_SERVER_ERROR:
      return 'Server error. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

// Error logging utility
export const logError = (error: AppError, context?: string) => {
  const logData = {
    timestamp: new Date().toISOString(),
    context,
    error: {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
    },
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
  };

  // In production, you might want to send this to a logging service
  console.error('Application Error:', logData);
  
  // You could also send to external logging service here
  // await sendToLoggingService(logData);
};

// Retry utility with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: AppError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = parseApiError(error);
      
      // Don't retry on certain error types
      if (lastError.code === ErrorCode.VALIDATION_ERROR || 
          lastError.code === ErrorCode.UNAUTHORIZED ||
          lastError.code === ErrorCode.FORBIDDEN) {
        throw lastError;
      }

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

// Error recovery suggestions
export const getErrorRecoverySuggestions = (error: AppError): string[] => {
  const suggestions: string[] = [];

  switch (error.code) {
    case ErrorCode.NETWORK_ERROR:
      suggestions.push('Check your internet connection');
      suggestions.push('Try refreshing the page');
      suggestions.push('Check if the service is available');
      break;
    case ErrorCode.VALIDATION_ERROR:
      suggestions.push('Review your input and try again');
      suggestions.push('Make sure all required fields are filled');
      break;
    case ErrorCode.RATE_LIMIT_EXCEEDED:
      suggestions.push('Wait a few minutes before trying again');
      suggestions.push('Reduce the frequency of your requests');
      break;
    case ErrorCode.TIMEOUT:
      suggestions.push('Try again in a moment');
      suggestions.push('Check your internet connection');
      break;
    default:
      suggestions.push('Try refreshing the page');
      suggestions.push('Contact support if the problem persists');
  }

  return suggestions;
}; 