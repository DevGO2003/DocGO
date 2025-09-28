import axios, { AxiosInstance } from 'axios';
import logger from './logger';

export interface ServiceInstance {
  id: string;
  url: string;
  healthy: boolean;
  lastCheck: number;
  responseTime: number;
  weight: number;
}

export interface LoadBalancerConfig {
  healthCheckInterval: number;
  healthCheckTimeout: number;
  maxRetries: number;
  retryDelay: number;
}

export class LoadBalancer {
  private instances: Map<string, ServiceInstance[]> = new Map();
  private currentIndex: Map<string, number> = new Map();
  private config: LoadBalancerConfig;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<LoadBalancerConfig> = {}) {
    this.config = {
      healthCheckInterval: 30000, // 30 seconds
      healthCheckTimeout: 5000,   // 5 seconds
      maxRetries: 3,
      retryDelay: 1000,           // 1 second
      ...config
    };
  }

  /**
   * Thêm service instances cho load balancing
   */
  addService(serviceName: string, instances: Omit<ServiceInstance, 'healthy' | 'lastCheck' | 'responseTime'>[]): void {
    const serviceInstances: ServiceInstance[] = instances.map(instance => ({
      ...instance,
      healthy: true,
      lastCheck: 0,
      responseTime: 0,
      weight: instance.weight || 1
    }));

    this.instances.set(serviceName, serviceInstances);
    this.currentIndex.set(serviceName, 0);

    logger.info(`🔄 Load balancer initialized for ${serviceName} with ${instances.length} instances`);
  }

  /**
   * Lấy instance tiếp theo theo round-robin algorithm
   */
  getNextInstance(serviceName: string): ServiceInstance | null {
    const instances = this.instances.get(serviceName);
    if (!instances || instances.length === 0) {
      logger.warn(`⚠️ No instances available for service: ${serviceName}`);
      return null;
    }

    // Lọc chỉ những instances healthy
    const healthyInstances = instances.filter(instance => instance.healthy);
    if (healthyInstances.length === 0) {
      logger.error(`❌ No healthy instances available for service: ${serviceName}`);
      return null;
    }

    // Round-robin với weight consideration
    const currentIdx = this.currentIndex.get(serviceName) || 0;
    const selectedInstance = this.selectInstanceByWeight(healthyInstances, currentIdx);
    
    // Cập nhật index cho lần tiếp theo
    const nextIdx = (currentIdx + 1) % healthyInstances.length;
    this.currentIndex.set(serviceName, nextIdx);

    logger.debug(`🎯 Selected instance for ${serviceName}: ${selectedInstance.id} (${selectedInstance.url})`);
    return selectedInstance;
  }

  /**
   * Chọn instance dựa trên weight
   */
  private selectInstanceByWeight(instances: ServiceInstance[], currentIndex: number): ServiceInstance {
    // Simple round-robin for now, có thể nâng cấp thành weighted round-robin sau
    return instances[currentIndex % instances.length];
  }

  /**
   * Tạo Axios instance cho service với load balancing
   */
  createAxiosInstance(serviceName: string): AxiosInstance {
    const baseURL = this.getServiceBaseURL(serviceName);
    
    const axiosInstance = axios.create({
      baseURL,
      timeout: this.config.healthCheckTimeout,
      headers: {
        'User-Agent': 'API-Gateway-LoadBalancer/1.0.0'
      }
    });

    // Request interceptor để chọn instance
    axiosInstance.interceptors.request.use(
      (config) => {
        const instance = this.getNextInstance(serviceName);
        if (instance) {
          config.baseURL = instance.url;
          config.metadata = { instanceId: instance.id };
        }
        return config;
      },
      (error) => {
        logger.error(`❌ Request interceptor error for ${serviceName}:`, error);
        return Promise.reject(error);
      }
    );

    // Response interceptor để cập nhật metrics
    axiosInstance.interceptors.response.use(
      (response) => {
        const instanceId = response.config.metadata?.instanceId;
        if (instanceId) {
          this.updateInstanceMetrics(serviceName, instanceId, true, response.config.metadata?.startTime);
        }
        return response;
      },
      (error) => {
        const instanceId = error.config?.metadata?.instanceId;
        if (instanceId) {
          this.updateInstanceMetrics(serviceName, instanceId, false);
        }
        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }

  /**
   * Lấy base URL của service (fallback nếu không có load balancing)
   */
  private getServiceBaseURL(serviceName: string): string {
    const instances = this.instances.get(serviceName);
    if (instances && instances.length > 0) {
      return instances[0].url; // Fallback to first instance
    }

    // Fallback URLs based on service name
    const fallbackUrls: Record<string, string> = {
      'user-management': 'http://user-management-service:8000',
      'document-management': 'http://document-management-service:8000',
      'automation': 'http://automation-service:8000'
    };

    return fallbackUrls[serviceName] || 'http://localhost:8000';
  }

  /**
   * Cập nhật metrics cho instance
   */
  private updateInstanceMetrics(serviceName: string, instanceId: string, success: boolean, startTime?: number): void {
    const instances = this.instances.get(serviceName);
    if (!instances) return;

    const instance = instances.find(inst => inst.id === instanceId);
    if (!instance) return;

    instance.lastCheck = Date.now();
    instance.healthy = success;

    if (startTime) {
      instance.responseTime = Date.now() - startTime;
    }

    logger.debug(`📊 Updated metrics for ${serviceName}/${instanceId}: healthy=${success}, responseTime=${instance.responseTime}ms`);
  }

  /**
   * Bắt đầu health checking
   */
  startHealthChecking(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheckInterval);

    logger.info('🏥 Load balancer health checking started');
  }

  /**
   * Dừng health checking
   */
  stopHealthChecking(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    logger.info('🛑 Load balancer health checking stopped');
  }

  /**
   * Thực hiện health checks cho tất cả instances
   */
  private async performHealthChecks(): Promise<void> {
    for (const [serviceName, instances] of this.instances) {
      for (const instance of instances) {
        try {
          const startTime = Date.now();
          const response = await axios.get(`${instance.url}/health`, {
            timeout: this.config.healthCheckTimeout
          });

          const responseTime = Date.now() - startTime;
          instance.healthy = response.status === 200;
          instance.lastCheck = Date.now();
          instance.responseTime = responseTime;

          logger.debug(`✅ Health check passed for ${serviceName}/${instance.id}: ${responseTime}ms`);
        } catch (error) {
          instance.healthy = false;
          instance.lastCheck = Date.now();
          logger.warn(`❌ Health check failed for ${serviceName}/${instance.id}:`, error.message);
        }
      }
    }
  }

  /**
   * Lấy thống kê của load balancer
   */
  getStats(): Record<string, any> {
    const stats: Record<string, any> = {};

    for (const [serviceName, instances] of this.instances) {
      const healthyCount = instances.filter(inst => inst.healthy).length;
      const totalCount = instances.length;
      const avgResponseTime = instances
        .filter(inst => inst.responseTime > 0)
        .reduce((sum, inst) => sum + inst.responseTime, 0) / instances.length || 0;

      stats[serviceName] = {
        totalInstances: totalCount,
        healthyInstances: healthyCount,
        unhealthyInstances: totalCount - healthyCount,
        averageResponseTime: Math.round(avgResponseTime),
        instances: instances.map(inst => ({
          id: inst.id,
          url: inst.url,
          healthy: inst.healthy,
          responseTime: inst.responseTime,
          lastCheck: inst.lastCheck
        }))
      };
    }

    return stats;
  }
}

// Singleton instance
export const loadBalancer = new LoadBalancer();
