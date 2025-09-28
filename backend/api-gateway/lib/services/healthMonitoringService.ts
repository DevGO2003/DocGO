import axios, { AxiosInstance } from 'axios';
import logger from '../logger';

export interface HealthStatus {
  service: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: HealthStatus[];
  timestamp: string;
  uptime: number;
}

class HealthMonitoringService {
  private services: Map<string, string> = new Map();
  private healthCache: Map<string, { status: HealthStatus; lastCheck: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  constructor() {
    this.initializeServices();
  }

  private initializeServices(): void {
    // Service URLs - same as in services.ts
    this.services.set('api-gateway-bff', process.env.API_GATEWAY_BFF_URL || 'http://localhost:8000');
    this.services.set('authentication-identity-service', process.env.AUTH_SERVICE_URL || 'http://localhost:8001');
    this.services.set('contract-management-service', process.env.CONTRACT_SERVICE_URL || 'http://localhost:8002');
    this.services.set('ai-processing-service', process.env.AI_SERVICE_URL || 'http://localhost:8017');
    this.services.set('file-storage-asset-service', process.env.FILE_SERVICE_URL || 'http://localhost:8012');
    this.services.set('health-monitoring-agent', process.env.HEALTH_MONITORING_URL || 'http://localhost:8016');
    this.services.set('integration-connectors-service', process.env.INTEGRATION_SERVICE_URL || 'http://localhost:8014');
  }

  async checkServiceHealth(serviceName: string): Promise<HealthStatus> {
    const cached = this.healthCache.get(serviceName);
    const now = Date.now();

    // Return cached result if still valid
    if (cached && (now - cached.lastCheck) < this.CACHE_DURATION) {
      return cached.status;
    }

    const serviceUrl = this.services.get(serviceName);
    if (!serviceUrl) {
      const status: HealthStatus = {
        service: serviceName,
        status: 'unknown',
        lastCheck: new Date().toISOString(),
        error: 'Service not configured'
      };
      this.healthCache.set(serviceName, { status, lastCheck: now });
      return status;
    }

    const startTime = Date.now();
    try {
      const response = await axios.get(`${serviceUrl}/health`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Health-Monitoring-Service/1.0'
        }
      });

      const responseTime = Date.now() - startTime;
      const status: HealthStatus = {
        service: serviceName,
        status: response.status === 200 ? 'healthy' : 'unhealthy',
        responseTime,
        lastCheck: new Date().toISOString()
      };

      this.healthCache.set(serviceName, { status, lastCheck: now });
      return status;

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const status: HealthStatus = {
        service: serviceName,
        status: 'unhealthy',
        responseTime,
        lastCheck: new Date().toISOString(),
        error: error.message || 'Health check failed'
      };

      this.healthCache.set(serviceName, { status, lastCheck: now });
      logger.error(`❌ Health check failed for ${serviceName}:`, error.message);
      return status;
    }
  }

  async checkAllServicesHealth(): Promise<SystemHealth> {
    const serviceNames = Array.from(this.services.keys());
    const healthPromises = serviceNames.map(serviceName => 
      this.checkServiceHealth(serviceName)
    );

    const services = await Promise.all(healthPromises);
    
    // Determine overall health
    const healthyCount = services.filter(s => s.status === 'healthy').length;
    const totalCount = services.length;
    
    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === totalCount) {
      overall = 'healthy';
    } else if (healthyCount >= totalCount * 0.7) { // 70% healthy
      overall = 'degraded';
    } else {
      overall = 'unhealthy';
    }

    return {
      overall,
      services,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  async getServiceMetrics(serviceName: string): Promise<any> {
    const serviceUrl = this.services.get(serviceName);
    if (!serviceUrl) {
      throw new Error(`Service ${serviceName} not configured`);
    }

    try {
      const response = await axios.get(`${serviceUrl}/metrics`, {
        timeout: 5000
      });
      return response.data;
    } catch (error: any) {
      logger.error(`❌ Failed to get metrics for ${serviceName}:`, error.message);
      throw error;
    }
  }

  async getSystemMetrics(): Promise<any> {
    const metrics = {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };

    return metrics;
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache(): void {
    this.healthCache.clear();
  }

  // Get cached health status
  getCachedHealth(serviceName: string): HealthStatus | null {
    const cached = this.healthCache.get(serviceName);
    return cached ? cached.status : null;
  }
}

// Singleton instance
const healthMonitoringService = new HealthMonitoringService();

export default healthMonitoringService;
