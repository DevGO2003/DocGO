/**
 * Centralized configuration for API Gateway
 * Tất cả URL và cấu hình được quản lý tập trung
 */

export interface ServiceConfig {
  name: string;
  url: string;
  port: number;
  healthCheck: string;
  timeout: number;
}

export interface GatewayConfig {
  services: Record<string, ServiceConfig>;
  redis: {
    url: string;
    host: string;
    port: number;
    password?: string;
  };
  kafka: {
    brokers: string;
  };
  logging: {
    level: string;
    environment: string;
  };
}

/**
 * Get service URL based on environment
 * - Docker: uses service names with internal ports
 * - Local: uses localhost with external ports
 */
function buildServiceUrl(serviceName: string, internalPort: number, externalPort: number): string {
  const isDocker = process.env.DOCKERIZED === '1' || process.env.NODE_ENV === 'production';
  
  if (isDocker) {
    return `http://${serviceName}:${internalPort}`;
  }
  
  return `http://localhost:${externalPort}`;
}

/**
 * Centralized configuration object
 */
export const config: GatewayConfig = {
  services: {
    'api-gateway': {
      name: 'api-gateway',
      url: process.env.API_GATEWAY_URL || 'http://localhost:8000',
      port: 8000,
      healthCheck: '/health',
      timeout: 10000
    },
    
    'user-management': {
      name: 'user-management-service',
      url: process.env.USER_MANAGEMENT_SERVICE_URL || 
           buildServiceUrl('user-management-service', 8001, 8001),
      port: 8001,
      healthCheck: '/api/v1/user-management-service/v1/auth/health',
      timeout: 10000
    },
    
    'document-management': {
      name: 'document-management-service',
      url: process.env.DOCUMENT_MANAGEMENT_SERVICE_URL || 
           buildServiceUrl('document-management-service', 8000, 8002),
      port: 8002,
      healthCheck: '/actuator/health',
      timeout: 10000
    },
    
    'automation': {
      name: 'automation-service',
      url: process.env.AUTOMATION_SERVICE_URL || 
           buildServiceUrl('automation-service', 8000, 8003),
      port: 8003,
      healthCheck: '/health',
      timeout: 15000
    }
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://redis:6379',
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  },
  
  kafka: {
    brokers: process.env.KAFKA_BROKERS || 'kafka:9092'
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    environment: process.env.NODE_ENV || 'development'
  }
};

/**
 * Helper function to get service config
 */
export function getServiceConfig(serviceName: string): ServiceConfig | null {
  return config.services[serviceName] || null;
}

/**
 * Helper function to get service URL
 */
export function getServiceUrl(serviceName: string): string | null {
  const serviceConfig = getServiceConfig(serviceName);
  return serviceConfig?.url || null;
}

/**
 * Check if running in Docker
 */
export function isDocker(): boolean {
  return process.env.DOCKERIZED === '1' || process.env.NODE_ENV === 'production';
}

export default config;
