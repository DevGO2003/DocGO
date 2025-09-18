import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface Contract {
  id?: string;
  title: string;
  content: string;
  status: string;
  parties: Array<{
    name: string;
    email: string;
    role: string;
  }>;
  effectiveDate: string;
  expiryDate?: string;
  value?: number;
  currency?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ContractListResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: {
    contracts: Contract[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
  requestId: string;
  path: string;
}

export interface ContractResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: Contract;
  timestamp: string;
  requestId: string;
  path: string;
}

export interface ContractQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ApprovalRequest {
  approved: boolean;
  comments?: string;
}

export interface CommentRequest {
  content: string;
  author: string;
}

export interface ESignatureRequest {
  signerEmail: string;
  signerName: string;
  position?: string;
}

export interface ReminderRequest {
  type: string;
  date: string;
  content: string;
  recipients: string[];
}

class ContractService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.CONTRACT_SERVICE_URL || 'http://contract-management-service:8002';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[ContractService] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[ContractService] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[ContractService] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private getAuthHeaders(token?: string) {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getContracts(params: ContractQueryParams = {}, token?: string): Promise<ContractListResponse> {
    try {
      const response: AxiosResponse<ContractListResponse> = await this.client.get(
        '/api/v1/contract-management-service/contracts',
        {
          params,
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch contracts');
    }
  }

  async getContract(id: string, token?: string): Promise<ContractResponse> {
    try {
      const response: AxiosResponse<ContractResponse> = await this.client.get(
        `/api/v1/contract-management-service/contracts/${id}`,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch contract');
    }
  }

  async createContract(contract: Omit<Contract, 'id'>, token?: string): Promise<ContractResponse> {
    try {
      const response: AxiosResponse<ContractResponse> = await this.client.post(
        '/api/v1/contract-management-service/contracts',
        contract,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create contract');
    }
  }

  async updateContract(id: string, contract: Partial<Contract>, token?: string): Promise<ContractResponse> {
    try {
      const response: AxiosResponse<ContractResponse> = await this.client.put(
        `/api/v1/contract-management-service/contracts/${id}`,
        contract,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to update contract');
    }
  }

  async deleteContract(id: string, token?: string): Promise<ContractResponse> {
    try {
      const response: AxiosResponse<ContractResponse> = await this.client.delete(
        `/api/v1/contract-management-service/contracts/${id}`,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to delete contract');
    }
  }

  async approveContract(id: string, approval: ApprovalRequest, token?: string): Promise<ContractResponse> {
    try {
      const response: AxiosResponse<ContractResponse> = await this.client.post(
        `/api/v1/contract-management-service/contracts/${id}/approve`,
        approval,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to approve contract');
    }
  }

  async getContractVersions(id: string, token?: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/v1/contract-management-service/contracts/${id}/versions`,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to fetch contract versions');
    }
  }

  async addComment(id: string, comment: CommentRequest, token?: string): Promise<any> {
    try {
      const response = await this.client.post(
        `/api/v1/contract-management-service/contracts/${id}/comments`,
        comment,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to add comment');
    }
  }

  async requestESignature(id: string, esignature: ESignatureRequest, token?: string): Promise<any> {
    try {
      const response = await this.client.post(
        `/api/v1/contract-management-service/contracts/${id}/esignature`,
        esignature,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to request e-signature');
    }
  }

  async createReminder(id: string, reminder: ReminderRequest, token?: string): Promise<any> {
    try {
      const response = await this.client.post(
        `/api/v1/contract-management-service/contracts/${id}/reminders`,
        reminder,
        {
          headers: this.getAuthHeaders(token),
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Failed to create reminder');
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

export const contractService = new ContractService();
