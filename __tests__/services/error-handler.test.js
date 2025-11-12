const {
  AppError,
  ValidationError,
  AuthenticationError,
  DatabaseError,
  createErrorResponse,
  normalizeError,
  pluginErrorBoundary
} = require('../../services/error-handler');

describe('Error Handler Service', () => {
  test('should create AppError with message and code', () => {
    const error = new AppError('Test error', 400);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.isOperational).toBe(true);
  });

  test('should create AppError with default code 500', () => {
    const error = new AppError('Test error');
    expect(error.statusCode).toBe(500);
  });

  test('should handle validation errors', () => {
    const validationError = new ValidationError('Invalid input');
    expect(validationError).toBeInstanceOf(Error);
    expect(validationError.statusCode).toBe(400);
    expect(validationError.message).toBe('Invalid input');
    expect(validationError.code).toBe('VALIDATION_ERROR');
  });

  test('should handle authentication errors', () => {
    const authError = new AuthenticationError('Unauthorized');
    expect(authError).toBeInstanceOf(Error);
    expect(authError.statusCode).toBe(401);
    expect(authError.message).toBe('Unauthorized');
    expect(authError.code).toBe('AUTHENTICATION_ERROR');
  });

  test('should handle database errors', () => {
    const dbError = new DatabaseError('Database connection failed');
    expect(dbError).toBeInstanceOf(Error);
    expect(dbError.statusCode).toBe(500);
    expect(dbError.message).toBe('Database connection failed');
    expect(dbError.code).toBe('DATABASE_ERROR');
  });

  test('should create standardized error response', () => {
    const error = new AppError('Test error', 400);
    const response = createErrorResponse(error);
    
    expect(response).toEqual({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Test error',
        timestamp: expect.any(String)
      }
    });
  });

  test('should normalize error objects', () => {
    const regularError = new Error('Regular error');
    const normalized = normalizeError(regularError);
    
    expect(normalized).toBeInstanceOf(AppError);
    expect(normalized.message).toBe('Regular error');
    expect(normalized.code).toBe('UNKNOWN_ERROR');
  });

  test('should handle plugin error boundary', async () => {
    const mockPlugin = jest.fn().mockRejectedValue(new Error('Plugin failed'));
    const wrappedPlugin = pluginErrorBoundary('test-plugin', mockPlugin);
    
    await expect(wrappedPlugin()).rejects.toThrow();
    expect(mockPlugin).toHaveBeenCalled();
  });
});
