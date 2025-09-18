import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface RestResponse<T = any> {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: T;
  timestamp: string;
  requestId: string;
  path: string;
}

export class ApiClient {
  private client: AxiosInstance;
  private retries: number;
  private retryDelay: number;

  constructor(config: ApiClientConfig) {
    this.retries = config.retries || 3;
    this.retryDelay = config.retryDelay || 1000;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add request ID
        config.headers['X-Request-ID'] = this.generateRequestId();
        
        // Log request
        console.log(`[ApiClient] ${config.method?.toUpperCase()} ${config.url}`);
        
        return config;
      },
      (error) => {
        console.error('[ApiClient] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log successful response
        console.log(`[ApiClient] ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        // Log error
        console.error('[ApiClient] Response error:', error.response?.data || error.message);
        
        // Retry logic
        if (this.shouldRetry(error)) {
          return this.retryRequest(error.config);
        }
        
        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: any): boolean {
    if (!error.config || !this.retries) return false;
    
    const { retryCount = 0 } = error.config;
    if (retryCount >= this.retries) return false;
    
    // Retry on network errors or 5xx status codes
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }

  private async retryRequest(config: any): Promise<AxiosResponse> {
    const { retryCount = 0 } = config;
    config.retryCount = retryCount + 1;
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
    
    console.log(`[ApiClient] Retrying request (${config.retryCount}/${this.retries})`);
    
    return this.client(config);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<RestResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<RestResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<RestResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<RestResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<RestResponse<T>> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.error('[ApiClient] Health check failed:', error);
      return false;
    }
  }

  // Set authorization header
  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Remove authorization header
  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  // Get the underlying axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Factory function to create service clients
export function createServiceClient(serviceName: string, baseURL: string): ApiClient {
  return new ApiClient({
    baseURL,
    timeout: 15000,
    retries: 3,
    retryDelay: 1000,
  });
}

// Pre-configured service clients
export const serviceClients = {
  auth: createServiceClient('auth', process.env.AUTH_SERVICE_URL || 'http://authentication-identity-service:8001'),
  contract: createServiceClient('contract', process.env.CONTRACT_SERVICE_URL || 'http://contract-management-service:8002'),
  ai: createServiceClient('ai', process.env.AI_SERVICE_URL || 'http://ai-processing-service:8003'),
  file: createServiceClient('file', process.env.FILE_SERVICE_URL || 'http://file-storage-service:8004'),
};

export default ApiClient;
