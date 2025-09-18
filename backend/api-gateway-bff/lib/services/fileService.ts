import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface FileUploadRequest {
  file: File;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface FileUploadResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    fileId: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    url: string;
    signedUrl?: string;
    metadata?: Record<string, any>;
    tags?: string[];
    uploadedAt: string;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

export interface FileResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    fileId: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    url: string;
    signedUrl?: string;
    metadata?: Record<string, any>;
    tags?: string[];
    uploadedAt: string;
    lastModified: string;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

export interface FileListResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    files: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

export interface FileQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  mimeType?: string;
  tags?: string[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface AssetRequest {
  name: string;
  description?: string;
  type: string;
  fileId: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface AssetResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    assetId: string;
    name: string;
    description?: string;
    type: string;
    fileId: string;
    url: string;
    metadata?: Record<string, any>;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

export interface AssetListResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    assets: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

class FileService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.FILE_SERVICE_URL || 'http://file-storage-service:8004';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[FileService] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[FileService] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[FileService] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private getAuthHeaders(token?: string) {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async uploadFile(request: FileUploadRequest, token?: string): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', request.file);
      
      if (request.metadata) {
        formData.append('metadata', JSON.stringify(request.metadata));
      }
      
      if (request.tags) {
        formData.append('tags', JSON.stringify(request.tags));
      }

      const response: AxiosResponse<FileUploadResponse> = await this.client.post(
        '/api/v1/file-storage-service/files/upload',
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
      throw this.handleError(error, 'Failed to upload file');
    }
  }

  async getFile(fileId: string, token?: string): Promise<FileResponse> {
    try {
      const response: AxiosResponse<FileResponse> = await this.client.get(
        `/api/v1/file-storage-service/files/${fileId}`,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch file');
    }
  }

  async deleteFile(fileId: string, token?: string): Promise<FileResponse> {
    try {
      const response: AxiosResponse<FileResponse> = await this.client.delete(
        `/api/v1/file-storage-service/files/${fileId}`,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete file');
    }
  }

  async getFiles(params: FileQueryParams = {}, token?: string): Promise<FileListResponse> {
    try {
      const response: AxiosResponse<FileListResponse> = await this.client.get(
        '/api/v1/file-storage-service/files',
        {
          params,
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch files');
    }
  }

  async getSignedUrl(fileId: string, expiresIn: number = 3600, token?: string): Promise<string> {
    try {
      const response = await this.client.get(
        `/api/v1/file-storage-service/files/${fileId}/signed-url`,
        {
          params: { expiresIn },
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data.data.signedUrl;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to get signed URL');
    }
  }

  async createAsset(request: AssetRequest, token?: string): Promise<AssetResponse> {
    try {
      const response: AxiosResponse<AssetResponse> = await this.client.post(
        '/api/v1/file-storage-service/assets',
        request,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create asset');
    }
  }

  async getAsset(assetId: string, token?: string): Promise<AssetResponse> {
    try {
      const response: AxiosResponse<AssetResponse> = await this.client.get(
        `/api/v1/file-storage-service/assets/${assetId}`,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch asset');
    }
  }

  async getAssets(params: FileQueryParams = {}, token?: string): Promise<AssetListResponse> {
    try {
      const response: AxiosResponse<AssetListResponse> = await this.client.get(
        '/api/v1/file-storage-service/assets',
        {
          params,
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch assets');
    }
  }

  async updateAsset(assetId: string, updates: Partial<AssetRequest>, token?: string): Promise<AssetResponse> {
    try {
      const response: AxiosResponse<AssetResponse> = await this.client.put(
        `/api/v1/file-storage-service/assets/${assetId}`,
        updates,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update asset');
    }
  }

  async deleteAsset(assetId: string, token?: string): Promise<AssetResponse> {
    try {
      const response: AxiosResponse<AssetResponse> = await this.client.delete(
        `/api/v1/file-storage-service/assets/${assetId}`,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete asset');
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

export const fileService = new FileService();
