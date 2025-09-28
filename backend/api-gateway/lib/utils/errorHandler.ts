import { NextRequest, NextResponse } from 'next/server';

export interface ErrorResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: null;
  timestamp: string;
  requestId: string;
  path: string;
  error?: any;
}

export class ApiError extends Error {
  public statusCode: number;
  public shortMessage: string;
  public description: string;
  public requestId: string;
  public path: string;
  public originalError?: any;

  constructor(
    statusCode: number,
    shortMessage: string,
    description: string,
    requestId: string,
    path: string,
    originalError?: any
  ) {
    super(description);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.shortMessage = shortMessage;
    this.description = description;
    this.requestId = requestId;
    this.path = path;
    this.originalError = originalError;
  }
}

export class ValidationError extends ApiError {
  constructor(description: string, requestId: string, path: string, originalError?: any) {
    super(400, 'Bad Request', description, requestId, path, originalError);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(description: string, requestId: string, path: string, originalError?: any) {
    super(401, 'Unauthorized', description, requestId, path, originalError);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(description: string, requestId: string, path: string, originalError?: any) {
    super(403, 'Forbidden', description, requestId, path, originalError);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(description: string, requestId: string, path: string, originalError?: any) {
    super(404, 'Not Found', description, requestId, path, originalError);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(description: string, requestId: string, path: string, originalError?: any) {
    super(409, 'Conflict', description, requestId, path, originalError);
    this.name = 'ConflictError';
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(description: string, requestId: string, path: string, originalError?: any) {
    super(503, 'Service Unavailable', description, requestId, path, originalError);
    this.name = 'ServiceUnavailableError';
  }
}

export class InternalServerError extends ApiError {
  constructor(description: string, requestId: string, path: string, originalError?: any) {
    super(500, 'Internal Server Error', description, requestId, path, originalError);
    this.name = 'InternalServerError';
  }
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createErrorResponse(
  error: Error | ApiError,
  request: NextRequest,
  statusCode?: number
): NextResponse<ErrorResponse> {
  const requestId = generateRequestId();
  const path = request.nextUrl.pathname;
  const timestamp = new Date().toISOString();

  let response: ErrorResponse;

  if (error instanceof ApiError) {
    response = {
      apiVersion: 'v1',
      statusCode: error.statusCode,
      shortMessage: error.shortMessage,
      description: error.description,
      data: null,
      timestamp,
      requestId: error.requestId || requestId,
      path: error.path || path,
      error: error.originalError,
    };
  } else {
    // Handle generic errors
    const status = statusCode || 500;
    const shortMessage = getShortMessage(status);
    
    response = {
      apiVersion: 'v1',
      statusCode: status,
      shortMessage,
      description: error.message || 'An unexpected error occurred',
      data: null,
      timestamp,
      requestId,
      path,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }

  return NextResponse.json(response, { status: 200 }); // Always return 200 with statusCode in body
}

export function getShortMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  };

  return messages[statusCode] || 'Error';
}

export function handleServiceError(error: any, serviceName: string, requestId: string, path: string): ApiError {
  if (error.response) {
    // Service responded with error
    const statusCode = error.response.status;
    const errorData = error.response.data;
    
    const description = errorData?.description || errorData?.shortMessage || `Service ${serviceName} error`;
    
    switch (statusCode) {
      case 400:
        return new ValidationError(description, requestId, path, errorData);
      case 401:
        return new AuthenticationError(description, requestId, path, errorData);
      case 403:
        return new AuthorizationError(description, requestId, path, errorData);
      case 404:
        return new NotFoundError(description, requestId, path, errorData);
      case 409:
        return new ConflictError(description, requestId, path, errorData);
      case 503:
        return new ServiceUnavailableError(description, requestId, path, errorData);
      default:
        return new ApiError(statusCode, getShortMessage(statusCode), description, requestId, path, errorData);
    }
  } else if (error.request) {
    // Request was made but no response received
    return new ServiceUnavailableError(
      `Service ${serviceName} is unavailable`,
      requestId,
      path,
      error
    );
  } else {
    // Something else happened
    return new InternalServerError(
      `Unexpected error calling service ${serviceName}`,
      requestId,
      path,
      error
    );
  }
}

export function validateRequest(request: NextRequest, requiredFields: string[]): void {
  const url = new URL(request.url);
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!url.searchParams.has(field) && !request.body) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    const requestId = generateRequestId();
    const path = request.nextUrl.pathname;
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(', ')}`,
      requestId,
      path
    );
  }
}

export function validateRequestBody(body: any, requiredFields: string[]): void {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!body || body[field] === undefined || body[field] === null) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    const requestId = generateRequestId();
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(', ')}`,
      requestId,
      '/api/validation'
    );
  }
}

export function sanitizeError(error: any): any {
  if (process.env.NODE_ENV === 'production') {
    // In production, remove sensitive information
    return {
      message: error.message,
      statusCode: error.statusCode,
      shortMessage: error.shortMessage,
    };
  }
  
  // In development, include more details
  return error;
}

export function logError(error: ApiError, context: string): void {
  console.error(`[${context}] Error:`, {
    name: error.name,
    statusCode: error.statusCode,
    shortMessage: error.shortMessage,
    description: error.description,
    requestId: error.requestId,
    path: error.path,
    stack: error.stack,
    originalError: error.originalError,
  });
}

export default {
  ApiError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  ServiceUnavailableError,
  InternalServerError,
  generateRequestId,
  createErrorResponse,
  getShortMessage,
  handleServiceError,
  validateRequest,
  validateRequestBody,
  sanitizeError,
  logError,
};
