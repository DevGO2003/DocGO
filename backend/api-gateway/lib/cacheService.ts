import Redis from 'ioredis';
import logger from './logger';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix: string;
  defaultTTL: number; // seconds
  maxRetries: number;
  retryDelay: number;
}

export interface CacheOptions {
  ttl?: number; // seconds
  tags?: string[];
  compress?: boolean;
}

export class CacheService {
  private redis: Redis;
  private config: CacheConfig;
  private isConnected: boolean = false;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      keyPrefix: 'docgo:api-gateway:',
      defaultTTL: 300, // 5 minutes
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    };

    this.redis = new Redis({
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      db: this.config.db,
      retryDelayOnFailover: this.config.retryDelay,
      maxRetriesPerRequest: this.config.maxRetries,
      lazyConnect: true,
      keyPrefix: this.config.keyPrefix
    });

    this.setupEventHandlers();
  }

  /**
   * Thiết lập event handlers cho Redis
   */
  private setupEventHandlers(): void {
    this.redis.on('connect', () => {
      this.isConnected = true;
      logger.info('🔗 Redis cache connected successfully');
    });

    this.redis.on('error', (error) => {
      this.isConnected = false;
      logger.error('❌ Redis cache error:', error);
    });

    this.redis.on('close', () => {
      this.isConnected = false;
      logger.warn('🔌 Redis cache connection closed');
    });

    this.redis.on('reconnecting', () => {
      logger.info('🔄 Redis cache reconnecting...');
    });
  }

  /**
   * Kết nối đến Redis
   */
  async connect(): Promise<void> {
    try {
      await this.redis.connect();
      logger.info('✅ Cache service initialized');
    } catch (error) {
      logger.error('❌ Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Đóng kết nối Redis
   */
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
      this.isConnected = false;
      logger.info('🔌 Cache service disconnected');
    } catch (error) {
      logger.error('❌ Error disconnecting from Redis:', error);
    }
  }

  /**
   * Tạo cache key từ các tham số
   */
  private createCacheKey(service: string, endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    const hash = this.hashString(`${service}:${endpoint}:${paramString}`);
    return `${service}:${endpoint}:${hash}`;
  }

  /**
   * Hash string để tạo key ngắn gọn
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Lấy dữ liệu từ cache
   */
  async get<T>(service: string, endpoint: string, params?: Record<string, any>): Promise<T | null> {
    if (!this.isConnected) {
      logger.warn('⚠️ Cache not connected, skipping get operation');
      return null;
    }

    try {
      const key = this.createCacheKey(service, endpoint, params);
      const cached = await this.redis.get(key);
      
      if (cached) {
        logger.debug(`📦 Cache hit for ${service}:${endpoint}`);
        return JSON.parse(cached);
      }

      logger.debug(`📭 Cache miss for ${service}:${endpoint}`);
      return null;
    } catch (error) {
      logger.error(`❌ Cache get error for ${service}:${endpoint}:`, error);
      return null;
    }
  }

  /**
   * Lưu dữ liệu vào cache
   */
  async set<T>(
    service: string, 
    endpoint: string, 
    data: T, 
    options: CacheOptions = {}
  ): Promise<boolean> {
    if (!this.isConnected) {
      logger.warn('⚠️ Cache not connected, skipping set operation');
      return false;
    }

    try {
      const key = this.createCacheKey(service, endpoint);
      const ttl = options.ttl || this.config.defaultTTL;
      const serializedData = JSON.stringify(data);

      await this.redis.setex(key, ttl, serializedData);

      // Thêm tags nếu có
      if (options.tags && options.tags.length > 0) {
        await this.addTags(key, options.tags);
      }

      logger.debug(`💾 Cached data for ${service}:${endpoint} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      logger.error(`❌ Cache set error for ${service}:${endpoint}:`, error);
      return false;
    }
  }

  /**
   * Xóa dữ liệu khỏi cache
   */
  async delete(service: string, endpoint: string, params?: Record<string, any>): Promise<boolean> {
    if (!this.isConnected) {
      logger.warn('⚠️ Cache not connected, skipping delete operation');
      return false;
    }

    try {
      const key = this.createCacheKey(service, endpoint, params);
      const result = await this.redis.del(key);
      
      logger.debug(`🗑️ Deleted cache for ${service}:${endpoint}`);
      return result > 0;
    } catch (error) {
      logger.error(`❌ Cache delete error for ${service}:${endpoint}:`, error);
      return false;
    }
  }

  /**
   * Xóa tất cả cache của một service
   */
  async deleteByService(service: string): Promise<number> {
    if (!this.isConnected) {
      logger.warn('⚠️ Cache not connected, skipping delete operation');
      return 0;
    }

    try {
      const pattern = `${service}:*`;
      const keys = await this.redis.keys(pattern);
      
      if (keys.length > 0) {
        const result = await this.redis.del(...keys);
        logger.info(`🗑️ Deleted ${result} cache entries for service: ${service}`);
        return result;
      }

      return 0;
    } catch (error) {
      logger.error(`❌ Cache delete by service error for ${service}:`, error);
      return 0;
    }
  }

  /**
   * Xóa cache theo tags
   */
  async deleteByTags(tags: string[]): Promise<number> {
    if (!this.isConnected) {
      logger.warn('⚠️ Cache not connected, skipping delete operation');
      return 0;
    }

    try {
      let totalDeleted = 0;
      
      for (const tag of tags) {
        const pattern = `tag:${tag}:*`;
        const keys = await this.redis.keys(pattern);
        
        if (keys.length > 0) {
          // Lấy actual cache keys từ tag keys
          const cacheKeys = await Promise.all(
            keys.map(async (tagKey) => {
              const actualKey = await this.redis.get(tagKey);
              return actualKey;
            })
          );

          const validKeys = cacheKeys.filter(key => key !== null);
          if (validKeys.length > 0) {
            const deleted = await this.redis.del(...validKeys);
            totalDeleted += deleted;
          }

          // Xóa tag keys
          await this.redis.del(...keys);
        }
      }

      logger.info(`🏷️ Deleted ${totalDeleted} cache entries by tags: ${tags.join(', ')}`);
      return totalDeleted;
    } catch (error) {
      logger.error(`❌ Cache delete by tags error:`, error);
      return 0;
    }
  }

  /**
   * Thêm tags cho cache key
   */
  private async addTags(key: string, tags: string[]): Promise<void> {
    try {
      for (const tag of tags) {
        const tagKey = `tag:${tag}:${Date.now()}`;
        await this.redis.setex(tagKey, this.config.defaultTTL, key);
      }
    } catch (error) {
      logger.error(`❌ Error adding tags for key ${key}:`, error);
    }
  }

  /**
   * Lấy thống kê cache
   */
  async getStats(): Promise<Record<string, any>> {
    if (!this.isConnected) {
      return { connected: false };
    }

    try {
      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      
      // Parse memory info
      const memoryInfo: Record<string, string> = {};
      info.split('\r\n').forEach(line => {
        if (line.includes(':')) {
          const [key, value] = line.split(':');
          memoryInfo[key] = value;
        }
      });

      // Parse keyspace info
      const keyspaceInfo: Record<string, string> = {};
      keyspace.split('\r\n').forEach(line => {
        if (line.includes(':')) {
          const [key, value] = line.split(':');
          keyspaceInfo[key] = value;
        }
      });

      return {
        connected: this.isConnected,
        memory: {
          used: memoryInfo.used_memory_human,
          peak: memoryInfo.used_memory_peak_human,
          fragmentation: memoryInfo.mem_fragmentation_ratio
        },
        keyspace: keyspaceInfo,
        uptime: memoryInfo.uptime_in_seconds
      };
    } catch (error) {
      logger.error('❌ Error getting cache stats:', error);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Kiểm tra kết nối Redis
   */
  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('❌ Redis ping failed:', error);
      return false;
    }
  }

  /**
   * Làm sạch tất cả cache
   */
  async flushAll(): Promise<boolean> {
    if (!this.isConnected) {
      logger.warn('⚠️ Cache not connected, skipping flush operation');
      return false;
    }

    try {
      await this.redis.flushall();
      logger.info('🧹 All cache flushed');
      return true;
    } catch (error) {
      logger.error('❌ Error flushing cache:', error);
      return false;
    }
  }
}

// Singleton instance
export const cacheService = new CacheService();
