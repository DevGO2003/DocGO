import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
      email: string;
      roles: string[];
    };
  };
  timestamp: string;
  requestId: string;
  path: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    token: string;
    refreshToken: string;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

export interface LogoutRequest {
  token: string;
}

export interface LogoutResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: null;
  timestamp: string;
  requestId: string;
  path: string;
}

class AuthService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.AUTHENTICATION_SERVICE_URL || 'http://user-management-service:8001';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[AuthService] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[AuthService] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[AuthService] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.client.post(
        '/api/v1/user-management-service/v1/auth/login',
        credentials
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Login failed');
    }
  }

  async logout(logoutData: LogoutRequest): Promise<LogoutResponse> {
    try {
      const response: AxiosResponse<LogoutResponse> = await this.client.post(
        '/api/v1/user-management-service/v1/auth/logout',
        logoutData,
        {
          headers: {
            Authorization: `Bearer ${logoutData.token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Logout failed');
    }
  }

  async refreshToken(refreshData: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const response: AxiosResponse<RefreshTokenResponse> = await this.client.post(
        '/api/v1/user-management-service/v1/auth/refresh',
        refreshData
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Token refresh failed');
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.client.get(
        '/api/v1/user-management-service/v1/auth/validate',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async getProfile(token: string): Promise<any> {
    try {
      const response = await this.client.get(
        '/api/v1/user-management-service/v1/auth/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Get profile failed');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get(
        '/api/v1/user-management-service/v1/auth/health'
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  private handleError(error: any, message: string): Error {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      return new Error(
        errorData?.description || errorData?.shortMessage || message
      );
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Service unavailable. Please try again later.');
    } else {
      // Something else happened
      return new Error(message);
    }
  }
}

export const authService = new AuthService();
