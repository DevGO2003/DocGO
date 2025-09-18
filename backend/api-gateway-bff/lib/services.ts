import axios, { AxiosInstance, AxiosResponse } from 'axios';
import fs from 'fs';
import { ServiceConfig, RestResponse } from '@/types/index';
import logger from './logger';

class ServiceManager {
  private services: Map<string, AxiosInstance> = new Map();
  private serviceConfigs: Map<string, ServiceConfig> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices(): void {
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
    // API Gateway BFF (Next.js) - Port 8000
    this.addService('api-gateway-bff', {
      name: 'api-gateway-bff',
      url: process.env.API_GATEWAY_BFF_URL || 'http://localhost:8000',
      healthCheck: '/health',
      timeout: 10000
    });

    // Authentication Identity Service (Spring Boot) - Port 8000
    this.addService('authentication', {
      name: 'authentication-identity-service',
      url: selectUrl(process.env.AUTH_SERVICE_URL, 'http://authentication-identity-service:8000', 'http://localhost:8001'),
      healthCheck: '/api/v1/authentication-identity-service/auth/health',
      timeout: 10000
    });

    // User Management Service (FastAPI) - Port 8002
    this.addService('user-management', {
      name: 'user-management-service',
      url: selectUrl(process.env.USER_MANAGEMENT_SERVICE_URL, 'http://user-management-service:8002', 'http://localhost:8002'),
      healthCheck: '/health',
      timeout: 10000
    });

    // Contract Management Service (Spring Boot) - Port 8000
    this.addService('contract-management', {
      name: 'contract-management-service',
      url: selectUrl(process.env.CONTRACT_SERVICE_URL, 'http://contract-management-service:8000', 'http://localhost:8002'),
      healthCheck: '/actuator/health',
      timeout: 10000
    });

    // Versioning Document History Service (FastAPI) - Port 8004
    this.addService('versioning-document-history', {
      name: 'versioning-document-history-service',
      url: selectUrl(process.env.VERSIONING_DOCUMENT_HISTORY_SERVICE_URL, 'http://versioning-document-history-service:8004', 'http://localhost:8004'),
      healthCheck: '/health',
      timeout: 10000
    });

    // Commenting Collaboration Service (FastAPI) - Port 8005
    this.addService('commenting-collaboration', {
      name: 'commenting-collaboration-service',
      url: selectUrl(process.env.COMMENTING_COLLABORATION_SERVICE_URL, 'http://commenting-collaboration-service:8005', 'http://localhost:8005'),
      healthCheck: '/health',
      timeout: 10000
    });

    // Approval Workflow Service (FastAPI) - Port 8006
    this.addService('approval-workflow', {
      name: 'approval-workflow-service',
      url: selectUrl(process.env.APPROVAL_WORKFLOW_SERVICE_URL, 'http://approval-workflow-service:8006', 'http://localhost:8006'),
      healthCheck: '/health',
      timeout: 10000
    });

    // Reminder Scheduler Service (FastAPI) - Port 8007
    this.addService('reminder-scheduler', {
      name: 'reminder-scheduler-service',
      url: selectUrl(process.env.REMINDER_SCHEDULER_SERVICE_URL, 'http://reminder-scheduler-service:8007', 'http://localhost:8007'),
      healthCheck: '/health',
      timeout: 10000
    });

    // E-Signature Integration Service (FastAPI) - Port 8008
    this.addService('esignature-integration', {
      name: 'esignature-integration-service',
      url: selectUrl(process.env.ESIGNATURE_INTEGRATION_SERVICE_URL, 'http://esignature-integration-service:8008', 'http://localhost:8008'),
      healthCheck: '/health',
      timeout: 10000
    });

    // Notification Service (FastAPI) - Port 8009
    this.addService('notification', {
      name: 'notification-service',
      url: selectUrl(process.env.NOTIFICATION_SERVICE_URL, 'http://notification-service:8009', 'http://localhost:8009'),
      healthCheck: '/health',
      timeout: 10000
    });

    // Reporting Analytics Service (FastAPI) - Port 8010
    this.addService('reporting-analytics', {
      name: 'reporting-analytics-service',
      url: selectUrl(process.env.REPORTING_ANALYTICS_SERVICE_URL, 'http://reporting-analytics-service:8010', 'http://localhost:8010'),
      healthCheck: '/health',
      timeout: 10000
    });

    // OCR Document Extraction Service (FastAPI) - Port 8011
    this.addService('ocr-document-extraction', {
      name: 'ocr-document-extraction-service',
      url: selectUrl(process.env.OCR_DOCUMENT_EXTRACTION_SERVICE_URL, 'http://ocr-document-extraction-service:8011', 'http://localhost:8011'),
      healthCheck: '/health',
      timeout: 10000
    });

    // File Storage Asset Service (FastAPI) - Port 8004
    this.addService('file-storage', {
      name: 'file-storage-service',
      url: selectUrl(process.env.FILE_SERVICE_URL, 'http://file-storage-service:8000', 'http://localhost:8004'),
      healthCheck: '/health',
      timeout: 10000
    });

    // Audit Activity Log Service (FastAPI) - Port 8013
    this.addService('audit-activity-log', {
      name: 'audit-activity-log-service',
      url: selectUrl(process.env.AUDIT_ACTIVITY_LOG_SERVICE_URL, 'http://audit-activity-log-service:8013', 'http://localhost:8013'),
      healthCheck: '/health',
      timeout: 10000
    });

    // Integration Connectors Service (FastAPI) - Port 8014
    this.addService('integration-connectors', {
      name: 'integration-connectors-service',
      url: selectUrl(process.env.INTEGRATION_CONNECTORS_SERVICE_URL, 'http://integration-connectors-service:8014', 'http://localhost:8014'),
      healthCheck: '/health',
      timeout: 10000
    });

    // Batch ETL Service (FastAPI) - Port 8015
    this.addService('batch-etl', {
      name: 'batch-etl-service',
      url: selectUrl(process.env.BATCH_ETL_SERVICE_URL, 'http://batch-etl-service:8015', 'http://localhost:8015'),
      healthCheck: '/health',
      timeout: 10000
    });

    // Health Monitoring Agent (FastAPI) - Port 8016
    this.addService('health-monitoring-agent', {
      name: 'health-monitoring-agent',
      url: selectUrl(process.env.HEALTH_MONITORING_AGENT_URL, 'http://health-monitoring-agent:8016', 'http://localhost:8016'),
      healthCheck: '/health',
      timeout: 10000
    });

    // AI Processing Service (FastAPI) - Port 8003
    this.addService('ai-processing', {
      name: 'ai-processing-service',
      url: selectUrl(process.env.AI_SERVICE_URL, 'http://docgo-local-ai-processing-service:8000', 'http://localhost:8003'),
      healthCheck: '/health',
      timeout: 10000
    });

    // File Storage Asset Service (FastAPI) - Port 8012
    this.addService('file-storage-asset', {
      name: 'file-storage-asset-service',
      url: selectUrl(process.env.FILE_STORAGE_ASSET_SERVICE_URL, 'http://file-storage-asset-service:8012', 'http://localhost:8012'),
      healthCheck: '/health',
      timeout: 10000
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
        'User-Agent': 'API-Gateway-BFF/1.0.0'
      }
    });

    // Add request interceptor for logging
    axiosInstance.interceptors.request.use(
      (config) => {
        // Propagate correlation and actor headers
        const correlationId = (config.headers?.['X-Correlation-Id'] as string) || process.env.CORRELATION_ID || '';
        const actor = (config.headers?.['X-Actor'] as string) || process.env.ACTOR || '';
        config.headers = config.headers || {};
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

  // Authentication Service Methods
  async authenticateUser(loginRequest: any): Promise<RestResponse<any>> {
    const service = this.getService('authentication');
    if (!service) {
      throw new Error('Authentication service not available');
    }

    try {
      const response: AxiosResponse<RestResponse<any>> = await service.post('/api/v1/authentication-identity-service/auth/login', loginRequest);
      return response.data;
    } catch (error: any) {
      logger.error('❌ Authentication failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async registerUser(authRequest: any): Promise<RestResponse<any>> {
    const service = this.getService('authentication');
    if (!service) {
      throw new Error('Authentication service not available');
    }

    try {
      const response: AxiosResponse<RestResponse<any>> = await service.post('/api/v1/authentication-identity-service/auth/register', authRequest);
      return response.data;
    } catch (error: any) {
      logger.error('❌ User registration failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // User Management Service Methods
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
