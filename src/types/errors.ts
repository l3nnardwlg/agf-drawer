export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND', details?: unknown) {
    super(404, code, message, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST', details?: unknown) {
    super(400, code, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', code = 'UNAUTHORIZED', details?: unknown) {
    super(401, code, message, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied', code = 'FORBIDDEN', details?: unknown) {
    super(403, code, message, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict occurred', code = 'CONFLICT', details?: unknown) {
    super(409, code, message, details);
  }
}

export class ConcurrencyConflictError extends AppError {
  constructor(message = 'Resource was modified by another request. Please retry.', code = 'CONCURRENCY_CONFLICT', details?: unknown) {
    super(409, code, message, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.', code = 'RATE_LIMIT_EXCEEDED') {
    super(429, code, message);
  }
}
