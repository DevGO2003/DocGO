import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ServiceConfig, RestResponse } from '@/types/index';
import logger from './logger';
import { config, getServiceConfig } from './config';

class ServiceManager {
  private services: Map<string, AxiosInstance> = new Map();
  private serviceConfigs: Map<string, ServiceConfig> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices(): void {
    // Initialize services using centralized config
    Object.entries(config.services).forEach(([key, serviceConfig]) => {
      this.addService(key, serviceConfig);
    });
  }

  private addService(key: string, config: ServiceConfig): void {
    console.log(`[DEBUG] 🔧 Initializing service: ${key}`);
    console.log(`[DEBUG] 🌐 Service URL: ${config.url}`);
    console.log(`[DEBUG] ⏱️  Timeout: ${config.timeout}ms`);
    console.log(`[DEBUG] 🏥 Health Check: ${config.healthCheck}`);
    
    const axiosInstance = axios.create({
      baseURL: config.url,
      timeout: config.timeout,
      headers: {
        'User-Agent': 'API-Gateway/1.0.0',
        'Content-Type': 'application/json'
      },
      // Cải thiện kết nối
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 300; // Chỉ coi 2xx là thành công
      }
    });

    // Add request interceptor for logging
    axiosInstance.interceptors.request.use(
      (config) => {
        // Propagate correlation and actor headers
        const correlationId = (config.headers?.['X-Correlation-Id'] as string) || process.env.CORRELATION_ID || '';
        const actor = (config.headers?.['X-Actor'] as string) || process.env.ACTOR || '';
        if (!config.headers) {
          config.headers = {} as any;
        }
        if (!config.headers['X-Correlation-Id']) {
          config.headers['X-Correlation-Id'] = correlationId || cryptoRandomId();
        }
        if (!config.headers['X-Actor']) {
          config.headers['X-Actor'] = actor || 'api-gateway';
        }

        logger.info(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
          service: key,
          headers: config.headers
        });
        return config;
      },
      (error) => {
        logger.error(`❌ Request error to ${key}:`, error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    axiosInstance.interceptors.response.use(
      (response) => {
        logger.info(`✅ Response from ${key}: ${response.status}`, {
          service: key,
          status: response.status,
          url: response.config.url
        });
        return response;
      },
      (error) => {
        logger.error(`❌ Response error from ${key}:`, {
          service: key,
          status: error.response?.status,
          message: error.message,
          url: error.config?.url
        });
        return Promise.reject(error);
      }
    );

    this.services.set(key, axiosInstance);
    this.serviceConfigs.set(key, config);
    logger.info(`🔗 Service ${key} initialized: ${config.url}`);
  }

  getService(key: string): AxiosInstance | undefined {
    return this.services.get(key);
  }

  getServiceConfig(key: string): ServiceConfig | undefined {
    return this.serviceConfigs.get(key);
  }

  async checkServiceHealth(key: string): Promise<boolean> {
    const service = this.services.get(key);
    const config = this.serviceConfigs.get(key);

    if (!service || !config) {
      return false;
    }

    try {
      const response = await service.get(config.healthCheck);
      return response.status === 200;
    } catch (error) {
      logger.error(`❌ Health check failed for ${key}:`, error);
      return false;
    }
  }

  async checkAllServicesHealth(): Promise<Record<string, boolean>> {
    const healthStatus: Record<string, boolean> = {};
    
    // Use Array.from to convert Map keys to array for iteration
    const serviceKeys = Array.from(this.services.keys());
    
    for (const key of serviceKeys) {
      healthStatus[key] = await this.checkServiceHealth(key);
    }

    return healthStatus;
  }

  // User Management Service Methods
  async authenticateUser(loginRequest: any): Promise<RestResponse<any>> {
    const service = this.getService('user-management');
    if (!service) {
      throw new Error('User management service not available');
    }

    // Debug logging for request body (can be removed in production)
    logger.debug('🔍 [DEBUG] Login request details:', {
      originalRequest: loginRequest,
      requestType: typeof loginRequest,
      requestStringified: JSON.stringify(loginRequest),
      requestKeys: Object.keys(loginRequest || {}),
      requestValues: Object.values(loginRequest || {})
    });

    try {
      const response: AxiosResponse<RestResponse<any>> = await service.post('/api/v1/user-management-service/v1/auth/login', loginRequest);
      return response.data;
    } catch (error: any) {
      logger.error('❌ Authentication failed:', {
        error: error.response?.data || error.message,
        requestBody: loginRequest,
        requestBodyStringified: JSON.stringify(loginRequest),
        errorCode: error.code,
        errorStatus: error.response?.status
      });
      throw error;
    }
  }

  async registerUser(authRequest: any): Promise<RestResponse<any>> {
    const service = this.getService('user-management');
    if (!service) {
      throw new Error('User management service not available');
    }

    try {
      const response: AxiosResponse<RestResponse<any>> = await service.post('/api/v1/user-management-service/v1/auth/register', authRequest);
      return response.data;
    } catch (error: any) {
      logger.error('❌ User registration failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<RestResponse<any>> {
    const service = this.getService('user-management');
    if (!service) {
      throw new Error('User management service not available');
    }

    try {
      const response: AxiosResponse<RestResponse<any>> = await service.get(`/api/v1/user-management-service/users/${userId}`);
      return response.data;
    } catch (error: any) {
      logger.error('❌ Get user profile failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateUserProfile(userId: string, userData: any): Promise<RestResponse<any>> {
    const service = this.getService('user-management');
    if (!service) {
      throw new Error('User management service not available');
    }

    try {
      const response: AxiosResponse<RestResponse<any>> = await service.put(`/api/v1/user-management-service/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      logger.error('❌ Update user profile failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getUserApprovals(userId: string): Promise<RestResponse<any>> {
    const service = this.getService('user-management');
    if (!service) {
      throw new Error('User management service not available');
    }

    try {
      const response: AxiosResponse<RestResponse<any>> = await service.get(`/api/v1/user-management-service/approvals/${userId}`);
      return response.data;
    } catch (error: any) {
      logger.error('❌ Get user approvals failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generic proxy method for other endpoints
  async proxyRequest(serviceKey: string, method: string, endpoint: string, data?: any, headers?: any): Promise<any> {
    const service = this.getService(serviceKey);
    if (!service) {
      throw new Error(`Service ${serviceKey} not available`);
    }

    try {
      const config: any = { headers };
      let response: AxiosResponse;

      switch (method.toLowerCase()) {
        case 'get':
          response = await service.get(endpoint, config);
          break;
        case 'post':
          response = await service.post(endpoint, data, config);
          break;
        case 'put':
          response = await service.put(endpoint, data, config);
          break;
        case 'delete':
          response = await service.delete(endpoint, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return response.data;
    } catch (error: any) {
      logger.error(`❌ Proxy request failed for ${serviceKey}:`, error.response?.data || error.message);
      throw error;
    }
  }
}

// Simple random id fallback
function cryptoRandomId(): string {
  try {
    const { randomUUID } = require('crypto');
    return randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

// Singleton instance
const serviceManager = new ServiceManager();

export default serviceManager;
