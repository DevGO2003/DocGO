import axios, { AxiosInstance, AxiosResponse } from 'axios';
import fs from 'fs';
import { ServiceConfig, RestResponse } from '@/types/index';
import logger from './logger';
import { loadBalancer, ServiceInstance } from './loadBalancer';
import { cacheService } from './cacheService';

interface EnhancedServiceConfig extends ServiceConfig {
  instances?: ServiceInstance[];
  enableCaching?: boolean;
  cacheTTL?: number;
  cacheTags?: string[];
}

class EnhancedServiceManager {
  private services: Map<string, AxiosInstance> = new Map();
  private serviceConfigs: Map<string, EnhancedServiceConfig> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.initializeServices();
  }

  private async initializeServices(): Promise<void> {
    try {
      // Khởi tạo cache service
      await cacheService.connect();
      
      // Khởi tạo load balancer
      this.setupLoadBalancer();
      
      // Khởi tạo services
      this.setupServices();
      
      // Bắt đầu health checking
      loadBalancer.startHealthChecking();
      
      this.isInitialized = true;
      logger.info('🚀 Enhanced Service Manager initialized with Load Balancing and Caching');
    } catch (error) {
      logger.error('❌ Failed to initialize Enhanced Service Manager:', error);
      throw error;
    }
  }

  private setupLoadBalancer(): void {
    // Cấu hình load balancer cho các services
    // Trong môi trường hiện tại, mỗi service chỉ có 1 instance
    // Nhưng cấu trúc này cho phép mở rộng dễ dàng

    // User Management Service
    loadBalancer.addService('user-management', [
      {
        id: 'user-mgmt-1',
        url: process.env.USER_MANAGEMENT_SERVICE_URL || 'http://user-management-service:8001',
        weight: 1
      }
    ]);

    // Document Management Service
    loadBalancer.addService('document-management', [
      {
        id: 'doc-mgmt-1',
        url: process.env.DOCUMENT_MANAGEMENT_SERVICE_URL || 'http://document-management-service:8002',
        weight: 1
      }
    ]);

    // Automation Service
    loadBalancer.addService('automation', [
      {
        id: 'automation-1',
        url: process.env.AUTOMATION_SERVICE_URL || 'http://automation-service:8003',
        weight: 1
      }
    ]);
  }

  private setupServices(): void {
    const isInDocker = (): boolean => {
      try {
        return fs.existsSync('/.dockerenv') || (process.env.DOCKERIZED === '1');
      } catch {
        return false;
      }
    };

    const selectUrl = (envVar: string | undefined, dockerUrl: string, hostUrl: string): string => {
      if (envVar && envVar.trim().length > 0) return envVar;
      return isInDocker() ? dockerUrl : hostUrl;
    };

    // User Management Service với Load Balancing
    this.addService('user-management', {
      name: 'user-management-service',
      url: selectUrl(process.env.USER_MANAGEMENT_SERVICE_URL, 'http://user-management-service:8001', 'http://localhost:8001'),
      healthCheck: '/api/v1/user-management-service/v1/auth/health',
      timeout: 10000,
      enableCaching: true,
      cacheTTL: 300, // 5 minutes
      cacheTags: ['users', 'auth']
    });

    // Document Management Service với Load Balancing
    this.addService('document-management', {
      name: 'document-management-service',
      url: selectUrl(process.env.DOCUMENT_MANAGEMENT_SERVICE_URL, 'http://document-management-service:8000', 'http://localhost:8002'),
      healthCheck: '/actuator/health',
      timeout: 10000,
      enableCaching: true,
      cacheTTL: 600, // 10 minutes
      cacheTags: ['documents', 'contracts']
    });

    // Automation Service với Load Balancing
    this.addService('automation', {
      name: 'automation-service',
      url: selectUrl(process.env.AUTOMATION_SERVICE_URL, 'http://automation-service:8000', 'http://localhost:8003'),
      healthCheck: '/health',
      timeout: 15000,
      enableCaching: false, // Không cache cho AI processing
      cacheTags: ['automation']
    });
  }

  private addService(key: string, config: EnhancedServiceConfig): void {
    console.log(`[DEBUG] 🔧 Initializing enhanced service: ${key}`);
    console.log(`[DEBUG] 🌐 Service URL: ${config.url}`);
    console.log(`[DEBUG] ⏱️  Timeout: ${config.timeout}ms`);
    console.log(`[DEBUG] 🏥 Health Check: ${config.healthCheck}`);
    console.log(`[DEBUG] 💾 Caching: ${config.enableCaching ? 'Enabled' : 'Disabled'}`);
    console.log(`[DEBUG] 🏷️  Cache Tags: ${config.cacheTags?.join(', ') || 'None'}`);
    
    // Sử dụng load balancer để tạo axios instance
    const axiosInstance = loadBalancer.createAxiosInstance(key);
    
    // Thêm request interceptor cho caching
    if (config.enableCaching) {
      this.addCachingInterceptors(axiosInstance, key, config);
    }

    // Thêm response interceptor cho logging
    this.addLoggingInterceptors(axiosInstance, key);

    this.services.set(key, axiosInstance);
    this.serviceConfigs.set(key, config);
  }

  private addCachingInterceptors(axiosInstance: AxiosInstance, serviceKey: string, config: EnhancedServiceConfig): void {
    // Request interceptor - kiểm tra cache trước khi gọi API
    axiosInstance.interceptors.request.use(
      async (requestConfig) => {
        // Chỉ cache GET requests
        if (requestConfig.method?.toUpperCase() === 'GET') {
          const endpoint = requestConfig.url || '';
          const params = requestConfig.params;
          
          try {
            const cachedData = await cacheService.get(serviceKey, endpoint, params);
            if (cachedData) {
              // Trả về cached data thay vì gọi API
              requestConfig.metadata = { 
                ...requestConfig.metadata,
                fromCache: true,
                cachedData 
              };
              return requestConfig;
            }
          } catch (error) {
            logger.warn(`⚠️ Cache get error for ${serviceKey}:${endpoint}:`, error);
          }
        }
        
        return requestConfig;
      },
      (error) => {
        logger.error(`❌ Request interceptor error for ${serviceKey}:`, error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - lưu response vào cache
    axiosInstance.interceptors.response.use(
      async (response) => {
        const requestConfig = response.config;
        const serviceKey = serviceKey;
        const endpoint = requestConfig.url || '';
        const params = requestConfig.params;

        // Kiểm tra nếu data đã được cache
        if (requestConfig.metadata?.fromCache) {
          logger.debug(`📦 Returning cached data for ${serviceKey}:${endpoint}`);
          return {
            ...response,
            data: requestConfig.metadata.cachedData
          };
        }

        // Lưu response vào cache nếu là GET request và có data
        if (requestConfig.method?.toUpperCase() === 'GET' && response.data) {
          try {
            await cacheService.set(
              serviceKey,
              endpoint,
              response.data,
              {
                ttl: config.cacheTTL,
                tags: config.cacheTags
              }
            );
            logger.debug(`💾 Cached response for ${serviceKey}:${endpoint}`);
          } catch (error) {
            logger.warn(`⚠️ Cache set error for ${serviceKey}:${endpoint}:`, error);
          }
        }

        return response;
      },
      (error) => {
        logger.error(`❌ Response interceptor error for ${serviceKey}:`, error);
        return Promise.reject(error);
      }
    );
  }

  private addLoggingInterceptors(axiosInstance: AxiosInstance, serviceKey: string): void {
    // Request interceptor cho logging
    axiosInstance.interceptors.request.use(
      (config) => {
        // Propagate correlation và actor headers
        const correlationId = (config.headers?.['X-Correlation-Id'] as string) || process.env.CORRELATION_ID || '';
        const actor = (config.headers?.['X-Actor'] as string) || process.env.ACTOR || '';
        
        if (!config.headers) {
          config.headers = {};
        }
        if (!config.headers['X-Correlation-Id']) {
          config.headers['X-Correlation-Id'] = correlationId || this.generateRequestId();
        }
        if (!config.headers['X-Actor']) {
          config.headers['X-Actor'] = actor || 'api-gateway';
        }

        // Thêm timestamp cho performance tracking
        config.metadata = {
          ...config.metadata,
          startTime: Date.now()
        };

        logger.info(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
          service: serviceKey,
          headers: config.headers
        });
        return config;
      },
      (error) => {
        logger.error(`❌ Request error to ${serviceKey}:`, error);
        return Promise.reject(error);
      }
    );

    // Response interceptor cho logging
    axiosInstance.interceptors.response.use(
      (response) => {
        const startTime = response.config.metadata?.startTime;
        const duration = startTime ? Date.now() - startTime : 0;
        
        logger.info(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`, {
          service: serviceKey,
          status: response.status,
          duration: duration
        });
        return response;
      },
      (error) => {
        const startTime = error.config?.metadata?.startTime;
        const duration = startTime ? Date.now() - startTime : 0;
        
        logger.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'ERROR'} (${duration}ms)`, {
          service: serviceKey,
          status: error.response?.status,
          duration: duration,
          error: error.message
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Lấy service instance
   */
  getService(serviceKey: string): AxiosInstance | null {
    return this.services.get(serviceKey) || null;
  }

  /**
   * Lấy service config
   */
  getServiceConfig(serviceKey: string): EnhancedServiceConfig | null {
    return this.serviceConfigs.get(serviceKey) || null;
  }

  /**
   * Lấy tất cả services
   */
  getAllServices(): Map<string, AxiosInstance> {
    return new Map(this.services);
  }

  /**
   * Lấy thống kê load balancer
   */
  getLoadBalancerStats(): Record<string, any> {
    return loadBalancer.getStats();
  }

  /**
   * Lấy thống kê cache
   */
  async getCacheStats(): Promise<Record<string, any>> {
    return await cacheService.getStats();
  }

  /**
   * Xóa cache của service
   */
  async clearServiceCache(serviceKey: string): Promise<number> {
    return await cacheService.deleteByService(serviceKey);
  }

  /**
   * Xóa cache theo tags
   */
  async clearCacheByTags(tags: string[]): Promise<number> {
    return await cacheService.deleteByTags(tags);
  }

  /**
   * Kiểm tra health của tất cả services
   */
  async checkAllServicesHealth(): Promise<Record<string, any>> {
    const healthStatus: Record<string, any> = {};
    
    for (const [serviceKey, service] of this.services) {
      try {
        const config = this.serviceConfigs.get(serviceKey);
        if (config?.healthCheck) {
          const response = await service.get(config.healthCheck, { timeout: 5000 });
          healthStatus[serviceKey] = {
            status: 'healthy',
            responseTime: response.config.metadata?.startTime ? 
              Date.now() - response.config.metadata.startTime : 0,
            lastCheck: new Date().toISOString()
          };
        }
      } catch (error) {
        healthStatus[serviceKey] = {
          status: 'unhealthy',
          error: error.message,
          lastCheck: new Date().toISOString()
        };
      }
    }

    return healthStatus;
  }

  /**
   * Tạo request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Dọn dẹp resources
   */
  async cleanup(): Promise<void> {
    try {
      loadBalancer.stopHealthChecking();
      await cacheService.disconnect();
      logger.info('🧹 Enhanced Service Manager cleaned up');
    } catch (error) {
      logger.error('❌ Error during cleanup:', error);
    }
  }
}

// Singleton instance
export const enhancedServiceManager = new EnhancedServiceManager();
export default enhancedServiceManager;






