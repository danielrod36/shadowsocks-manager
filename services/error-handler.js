const log4js = require('log4js');
const logger = log4js.getLogger('system');

/**
 * Base application error class
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error for configuration and input validation
 */
class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * Authentication error
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Authorization error
 */
class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Resource not found error
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
  }
}

/**
 * Database error
 */
class DatabaseError extends AppError {
  constructor(message, details = null) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

/**
 * Plugin error for plugin-specific issues
 */
class PluginError extends AppError {
  constructor(pluginName, message, details = null) {
    super(`Plugin ${pluginName}: ${message}`, 500, 'PLUGIN_ERROR', details);
  }
}

/**
 * Rate limiting error
 */
class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

/**
 * Standardized error response format
 */
function createErrorResponse(error) {
  const response = {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }
  };
  
  // Include details in development mode
  if (process.env.NODE_ENV === 'development' && error.details) {
    response.error.details = error.details;
  }
  
  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development' && error.stack) {
    response.error.stack = error.stack;
  }
  
  return response;
}

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Handle operational errors (expected errors)
  if (err.isOperational) {
    const statusCode = err.statusCode || 500;
    const errorResponse = createErrorResponse(err);
    return res.status(statusCode).json(errorResponse);
  }
  
  // Handle unexpected errors
  logger.error('Unexpected error:', err);
  const errorResponse = createErrorResponse({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
  
  return res.status(500).json(errorResponse);
}

/**
 * Async error handler wrapper for Express routes
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Plugin error boundary - wraps plugin execution
 */
function pluginErrorBoundary(pluginName, fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error(`Plugin ${pluginName} error:`, {
        message: error.message,
        stack: error.stack
      });
      
      // Re-throw as PluginError to maintain error context
      throw new PluginError(pluginName, error.message, {
        originalError: error.message,
        stack: error.stack
      });
    }
  };
}

/**
 * Validate and normalize error for logging
 */
function normalizeError(error) {
  if (error instanceof AppError) {
    return error;
  }
  
  // Convert unknown errors to AppError
  if (error instanceof Error) {
    return new AppError(error.message, 500, 'UNKNOWN_ERROR', {
      originalError: error.message,
      stack: error.stack
    });
  }
  
  // Handle non-Error objects
  return new AppError(
    typeof error === 'string' ? error : 'Unknown error occurred',
    500,
    'UNKNOWN_ERROR',
    { originalValue: error }
  );
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
  PluginError,
  RateLimitError,
  createErrorResponse,
  errorHandler,
  asyncHandler,
  pluginErrorBoundary,
  normalizeError
};
