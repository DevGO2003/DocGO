import axios, { AxiosInstance } from 'axios';
import logger from '../logger';

export interface IntegrationConfig {
  name: string;
  type: 'webhook' | 'api' | 'database' | 'message_queue';
  endpoint: string;
  authentication: {
    type: 'none' | 'api_key' | 'oauth' | 'basic';
    credentials?: any;
  };
  enabled: boolean;
}

export interface IntegrationStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastCheck: string;
  responseTime?: number;
  error?: string;
}

class IntegrationService {
  private integrations: Map<string, IntegrationConfig> = new Map();
  private statusCache: Map<string, { status: IntegrationStatus; lastCheck: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute

  constructor() {
    this.initializeIntegrations();
  }

  private initializeIntegrations(): void {
    // Initialize default integrations
    const defaultIntegrations: IntegrationConfig[] = [
      {
        name: 'kafka',
        type: 'message_queue',
        endpoint: process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092',
        authentication: { type: 'none' },
        enabled: true
      },
      {
        name: 'redis',
        type: 'database',
        endpoint: process.env.REDIS_URL || 'redis://localhost:6379',
        authentication: { type: 'none' },
        enabled: true
      },
      {
        name: 'mongodb',
        type: 'database',
        endpoint: process.env.MONGODB_URL || 'mongodb://localhost:27017',
        authentication: { type: 'none' },
        enabled: true
      }
    ];

    defaultIntegrations.forEach(integration => {
      this.integrations.set(integration.name, integration);
    });
  }

  async testConnection(integrationName: string): Promise<IntegrationStatus> {
    const cached = this.statusCache.get(integrationName);
    const now = Date.now();

    // Return cached result if still valid
    if (cached && (now - cached.lastCheck) < this.CACHE_DURATION) {
      return cached.status;
    }

    const integration = this.integrations.get(integrationName);
    if (!integration) {
      const status: IntegrationStatus = {
        name: integrationName,
        status: 'error',
        lastCheck: new Date().toISOString(),
        error: 'Integration not found'
      };
      this.statusCache.set(integrationName, { status, lastCheck: now });
      return status;
    }

    if (!integration.enabled) {
      const status: IntegrationStatus = {
        name: integrationName,
        status: 'disconnected',
        lastCheck: new Date().toISOString(),
        error: 'Integration disabled'
      };
      this.statusCache.set(integrationName, { status, lastCheck: now });
      return status;
    }

    const startTime = Date.now();
    try {
      let isConnected = false;

      switch (integration.type) {
        case 'api':
          isConnected = await this.testApiConnection(integration);
          break;
        case 'webhook':
          isConnected = await this.testWebhookConnection(integration);
          break;
        case 'database':
          isConnected = await this.testDatabaseConnection(integration);
          break;
        case 'message_queue':
          isConnected = await this.testMessageQueueConnection(integration);
          break;
        default:
          throw new Error(`Unsupported integration type: ${integration.type}`);
      }

      const responseTime = Date.now() - startTime;
      const status: IntegrationStatus = {
        name: integrationName,
        status: isConnected ? 'connected' : 'disconnected',
        responseTime,
        lastCheck: new Date().toISOString()
      };

      this.statusCache.set(integrationName, { status, lastCheck: now });
      return status;

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const status: IntegrationStatus = {
        name: integrationName,
        status: 'error',
        responseTime,
        lastCheck: new Date().toISOString(),
        error: error.message
      };

      this.statusCache.set(integrationName, { status, lastCheck: now });
      logger.error(`❌ Integration test failed for ${integrationName}:`, error.message);
      return status;
    }
  }

  private async testApiConnection(integration: IntegrationConfig): Promise<boolean> {
    try {
      const response = await axios.get(integration.endpoint, {
        timeout: 5000,
        headers: this.getAuthHeaders(integration)
      });
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      return false;
    }
  }

  private async testWebhookConnection(integration: IntegrationConfig): Promise<boolean> {
    try {
      const response = await axios.post(integration.endpoint, {
        test: true,
        timestamp: new Date().toISOString()
      }, {
        timeout: 5000,
        headers: this.getAuthHeaders(integration)
      });
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      return false;
    }
  }

  private async testDatabaseConnection(integration: IntegrationConfig): Promise<boolean> {
    // For now, just check if endpoint is reachable
    try {
      const response = await axios.get(integration.endpoint, {
        timeout: 5000
      });
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      return false;
    }
  }

  private async testMessageQueueConnection(integration: IntegrationConfig): Promise<boolean> {
    // For Kafka, we can't easily test without a client
    // For now, assume it's working if endpoint is configured
    return integration.endpoint && integration.endpoint.length > 0;
  }

  private getAuthHeaders(integration: IntegrationConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': 'Integration-Service/1.0'
    };

    if (integration.authentication.type === 'api_key' && integration.authentication.credentials?.apiKey) {
      headers['Authorization'] = `Bearer ${integration.authentication.credentials.apiKey}`;
    } else if (integration.authentication.type === 'basic' && integration.authentication.credentials) {
      const { username, password } = integration.authentication.credentials;
      const auth = Buffer.from(`${username}:${password}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    return headers;
  }

  async getAllIntegrationsStatus(): Promise<IntegrationStatus[]> {
    const integrationNames = Array.from(this.integrations.keys());
    const statusPromises = integrationNames.map(name => this.testConnection(name));
    return Promise.all(statusPromises);
  }

  addIntegration(integration: IntegrationConfig): void {
    this.integrations.set(integration.name, integration);
    this.statusCache.delete(integration.name); // Clear cache
  }

  removeIntegration(name: string): boolean {
    const deleted = this.integrations.delete(name);
    this.statusCache.delete(name);
    return deleted;
  }

  getIntegration(name: string): IntegrationConfig | undefined {
    return this.integrations.get(name);
  }

  getAllIntegrations(): IntegrationConfig[] {
    return Array.from(this.integrations.values());
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache(): void {
    this.statusCache.clear();
  }
}

// Singleton instance
const integrationService = new IntegrationService();

export default integrationService;
