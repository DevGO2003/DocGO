import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface ExtractRequest {
  file: File;
  geminiApiKey?: string;
}

export interface ExtractResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: string;
  timestamp: string;
  requestId: string;
  path: string;
}

export interface SummarizeRequest {
  file?: File;
  text?: string;
  geminiApiKey?: string;
}

export interface SummarizeResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: any;
  timestamp: string;
  requestId: string;
  path: string;
}

export interface OCRRequest {
  file: File;
  geminiApiKey?: string;
}

export interface OCRResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: string;
  timestamp: string;
  requestId: string;
  path: string;
}

export interface NotificationRequest {
  type: 'email' | 'sms' | 'push' | 'websocket';
  recipients: string[];
  subject?: string;
  content: string;
  templateId?: string;
  templateVariables?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  scheduledAt?: string;
  metadata?: Record<string, any>;
}

export interface NotificationResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    id: string;
    type: string;
    recipients: string[];
    subject?: string;
    content: string;
    status: string;
    priority: string;
    createdAt: string;
    sentAt?: string;
    failedAt?: string;
    errorMessage?: string;
    metadata?: Record<string, any>;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

export interface NotificationHistoryResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    notifications: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

export interface BatchProcessingRequest {
  files: Array<{
    fileId: string;
    filename: string;
    url: string;
  }>;
  processingType: 'extract' | 'summarize' | 'classify';
  options?: Record<string, any>;
  callbackUrl?: string;
}

export interface BatchProcessingResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    jobId: string;
    totalFiles: number;
    estimatedTime?: number;
    statusUrl: string;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

class AIService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.AI_SERVICE_URL || 'http://ai-processing-service:8003';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // Longer timeout for AI processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[AIService] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[AIService] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[AIService] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private getAuthHeaders(token?: string) {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async extractText(request: ExtractRequest, token?: string): Promise<ExtractResponse> {
    try {
      const formData = new FormData();
      formData.append('file', request.file);
      
      if (request.geminiApiKey) {
        formData.append('gemini_api_key', request.geminiApiKey);
      }

      const response: AxiosResponse<ExtractResponse> = await this.client.post(
        '/api/v1/ai-processing-service/extract',
        formData,
        {
          headers: {
            ...this.getAuthHeaders(token),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to extract text');
    }
  }

  async summarize(request: SummarizeRequest, token?: string): Promise<SummarizeResponse> {
    try {
      let formData: FormData | any;
      let headers: any = {
        ...this.getAuthHeaders(token),
      };

      if (request.file) {
        formData = new FormData();
        formData.append('file', request.file);
        if (request.geminiApiKey) {
          formData.append('gemini_api_key', request.geminiApiKey);
        }
        headers['Content-Type'] = 'multipart/form-data';
      } else if (request.text) {
        formData = { text: request.text };
        if (request.geminiApiKey) {
          headers['GEMINI_API_KEY'] = request.geminiApiKey;
        }
        headers['Content-Type'] = 'application/json';
      } else {
        throw new Error('Either file or text must be provided');
      }

      const response: AxiosResponse<SummarizeResponse> = await this.client.post(
        '/api/v1/ai-processing-service/summarize',
        formData,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to summarize content');
    }
  }

  async performOCR(request: OCRRequest, token?: string): Promise<OCRResponse> {
    try {
      const formData = new FormData();
      formData.append('file', request.file);
      
      if (request.geminiApiKey) {
        formData.append('gemini_api_key', request.geminiApiKey);
      }

      const response: AxiosResponse<OCRResponse> = await this.client.post(
        '/api/v1/ai-processing-service/ocr',
        formData,
        {
          headers: {
            ...this.getAuthHeaders(token),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to perform OCR');
    }
  }

  async sendNotification(request: NotificationRequest, token?: string): Promise<NotificationResponse> {
    try {
      const response: AxiosResponse<NotificationResponse> = await this.client.post(
        '/api/v1/ai-processing-service/notifications/send',
        request,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to send notification');
    }
  }

  async getNotificationHistory(
    page: number = 1,
    limit: number = 10,
    notificationType?: string,
    status?: string,
    startDate?: string,
    endDate?: string,
    token?: string
  ): Promise<NotificationHistoryResponse> {
    try {
      const params: any = { page, limit };
      if (notificationType) params.notification_type = notificationType;
      if (status) params.status = status;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response: AxiosResponse<NotificationHistoryResponse> = await this.client.get(
        '/api/v1/ai-processing-service/notifications/history',
        {
          params,
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch notification history');
    }
  }

  async processBatch(request: BatchProcessingRequest, token?: string): Promise<BatchProcessingResponse> {
    try {
      const response: AxiosResponse<BatchProcessingResponse> = await this.client.post(
        '/api/v1/ai-processing-service/batch/process',
        request,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to process batch');
    }
  }

  async getBatchJobStatus(jobId: string, token?: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/v1/ai-processing-service/batch/status/${jobId}`,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to get batch job status');
    }
  }

  private handleError(error: any, message: string): Error {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      return new Error(
        errorData?.description || errorData?.shortMessage || message
      );
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Service unavailable. Please try again later.');
    } else {
      // Something else happened
      return new Error(message);
    }
  }
}

export const aiService = new AIService();
