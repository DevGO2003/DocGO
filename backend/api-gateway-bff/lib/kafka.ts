import { Kafka, Producer, Consumer, KafkaMessage } from 'kafkajs';
import { KafkaEvent } from '@/types';
import logger from './logger';

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isConnected: boolean = false;

  constructor() {
    const brokers = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];
    const clientId = process.env.KAFKA_CLIENT_ID || 'api-gateway-bff';
    const groupId = process.env.KAFKA_GROUP_ID || 'api-gateway-group';

    this.kafka = new Kafka({
      clientId,
      brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId });
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      this.isConnected = true;
      logger.info('✅ Kafka connected successfully');
      
      // Subscribe to topics
      await this.subscribeToTopics();
    } catch (error) {
      logger.error('❌ Failed to connect to Kafka:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      this.isConnected = false;
      logger.info('✅ Kafka disconnected successfully');
    } catch (error) {
      logger.error('❌ Failed to disconnect from Kafka:', error);
    }
  }

  private async subscribeToTopics(): Promise<void> {
    try {
      const topics = [
        'user-events',
        'auth-events',
        'gateway-events'
      ];

      for (const topic of topics) {
        await this.consumer.subscribe({ topic, fromBeginning: false });
        logger.info(`📡 Subscribed to topic: ${topic}`);
      }

      // Start consuming messages
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          await this.handleMessage(topic, partition, message);
        },
      });
    } catch (error) {
      logger.error('❌ Failed to subscribe to topics:', error);
    }
  }

  private async handleMessage(topic: string, partition: number, message: KafkaMessage): Promise<void> {
    try {
      const value = message.value?.toString();
      if (!value) return;

      const event: KafkaEvent = JSON.parse(value);
      logger.info(`📨 Received message from topic ${topic}:`, event);

      // Handle different event types
      switch (event.type) {
        case 'USER_CREATED':
          await this.handleUserCreated(event);
          break;
        case 'USER_UPDATED':
          await this.handleUserUpdated(event);
          break;
        case 'USER_DELETED':
          await this.handleUserDeleted(event);
          break;
        case 'AUTH_SUCCESS':
          await this.handleAuthSuccess(event);
          break;
        case 'AUTH_FAILED':
          await this.handleAuthFailed(event);
          break;
        case 'GATEWAY_ERROR':
          await this.handleGatewayError(event);
          break;
        default:
          logger.warn(`⚠️ Unknown event type: ${event.type}`);
      }
    } catch (error) {
      logger.error('❌ Failed to handle Kafka message:', error);
    }
  }

  private async handleUserCreated(event: KafkaEvent): Promise<void> {
    logger.info('👤 User created event handled:', event.payload);
    // Implement user created logic
  }

  private async handleUserUpdated(event: KafkaEvent): Promise<void> {
    logger.info('✏️ User updated event handled:', event.payload);
    // Implement user updated logic
  }

  private async handleUserDeleted(event: KafkaEvent): Promise<void> {
    logger.info('🗑️ User deleted event handled:', event.payload);
    // Implement user deleted logic
  }

  private async handleAuthSuccess(event: KafkaEvent): Promise<void> {
    logger.info('🔐 Auth success event handled:', event.payload);
    // Implement auth success logic
  }

  private async handleAuthFailed(event: KafkaEvent): Promise<void> {
    logger.info('❌ Auth failed event handled:', event.payload);
    // Implement auth failed logic
  }

  async publishEvent(topic: string, event: KafkaEvent): Promise<void> {
    try {
      if (!this.isConnected) {
        throw new Error('Kafka not connected');
      }

      await this.producer.send({
        topic,
        messages: [
          {
            key: event.type,
            value: JSON.stringify(event),
            timestamp: Date.now().toString(),
          },
        ],
      });

      logger.info(`📤 Published event to topic ${topic}:`, event.type);
    } catch (error) {
      logger.error('❌ Failed to publish event:', error);
      throw error;
    }
  }

  async publishUserEvent(type: string, payload: any): Promise<void> {
    const event: KafkaEvent = {
      type: type as any,
      payload,
      timestamp: new Date().toISOString(),
      requestId: payload.requestId || 'unknown',
    };

    await this.publishEvent('user-events', event);
  }

  async publishAuthEvent(type: string, payload: any): Promise<void> {
    const event: KafkaEvent = {
      type: type as any,
      payload,
      timestamp: new Date().toISOString(),
      requestId: payload.requestId || 'unknown',
    };

    await this.publishEvent('auth-events', event);
  }

  private async handleGatewayError(event: KafkaEvent): Promise<void> {
    const payload = event.payload;
    
    logger.error(`🚨 Gateway Error Event:`, {
      error: payload.error,
      url: payload.url,
      method: payload.method,
      timestamp: payload.timestamp,
      requestId: event.requestId
    });

    // Publish to error monitoring topic
    const errorEvent: KafkaEvent = {
      type: 'GATEWAY_ERROR',
      payload: {
        error: payload.error,
        url: payload.url,
        method: payload.method,
        timestamp: payload.timestamp,
        severity: 'ERROR'
      },
      timestamp: new Date().toISOString(),
      requestId: event.requestId,
    };

    await this.publishEvent('error-events', errorEvent);
  }

  isKafkaConnected(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
const kafkaService = new KafkaService();

export default kafkaService;
