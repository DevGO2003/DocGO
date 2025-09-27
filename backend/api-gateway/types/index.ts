// Common Types
export interface RestResponse<T = any> {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: T | null;
  timestamp: string;
  requestId: string;
  path: string;
}

export interface ErrorResponse {
  error: string;
  status_code: number;
  path: string;
}

// Authentication Types
export interface AuthRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  token?: string;
  refreshToken?: string;
  role?: string;
  status?: string;
}

// User Management Types
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserApproval {
  id: number;
  userId: number;
  status: 'pending' | 'approved' | 'rejected';
  approverId?: number;
  approvedAt?: string;
  comments?: string;
}

// Kafka Types
export interface KafkaMessage {
  topic: string;
  partition: number;
  message: {
    key: string;
    value: any;
    timestamp: string;
  };
}

export interface KafkaEvent {
  type: 'USER_CREATED' | 'USER_UPDATED' | 'USER_DELETED' | 'AUTH_SUCCESS' | 'AUTH_FAILED' | 'GATEWAY_ERROR';
  payload: any;
  timestamp: string;
  requestId: string;
}

// API Gateway Types
export interface ServiceConfig {
  name: string;
  url: string;
  healthCheck: string;
  timeout: number;
}

export interface RouteConfig {
  path: string;
  method: string;
  service: string;
  auth: boolean;
  rateLimit?: number;
}

// Request/Response Types
export interface GatewayRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
  params?: Record<string, string>;
}

export interface GatewayResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
}
