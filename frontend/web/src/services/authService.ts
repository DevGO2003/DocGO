// Authentication Service
import httpClient from '../utils/httpClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  userInfo: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };
  expiresIn: number;
  tokenType: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

class AuthService {
  private readonly baseURL = '/api/v1/authentication-identity-service';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        `${this.baseURL}/auth/login`,
        credentials
      );

      // Store tokens
      httpClient.setToken(response.accessToken);
      httpClient.setRefreshToken(response.refreshToken);

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        `${this.baseURL}/auth/register`,
        userData
      );

      // Store tokens
      httpClient.setToken(response.accessToken);
      httpClient.setRefreshToken(response.refreshToken);

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = httpClient.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await httpClient.post<AuthResponse>(
        `${this.baseURL}/auth/refresh`,
        { refreshToken }
      );

      // Update tokens
      httpClient.setToken(response.accessToken);
      httpClient.setRefreshToken(response.refreshToken);

      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens and redirect to login
      httpClient.logout();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = httpClient.getToken();
      if (token) {
        await httpClient.post(`${this.baseURL}/auth/logout`, { token });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      httpClient.logout();
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const token = httpClient.getToken();
      if (!token) {
        return false;
      }

      await httpClient.post(`${this.baseURL}/auth/validate`, { token });
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    return httpClient.isAuthenticated();
  }

  getCurrentUser(): any {
    const token = httpClient.getToken();
    if (!token) {
      return null;
    }

    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId,
        username: payload.sub,
        roles: payload.roles || [],
        exp: payload.exp
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
