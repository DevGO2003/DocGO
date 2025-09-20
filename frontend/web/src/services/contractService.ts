// Contract Service with JWT Authentication
import httpClient from '../utils/httpClient';

export interface Contract {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractRequest {
  title: string;
  content: string;
}

export interface UpdateContractRequest {
  title?: string;
  content?: string;
  status?: string;
}

class ContractService {
  private readonly baseURL = '/api/v1/contract-management-service';

  async getContracts(): Promise<Contract[]> {
    try {
      return await httpClient.get<Contract[]>(`${this.baseURL}/contracts`);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      throw error;
    }
  }

  async getContract(id: string): Promise<Contract> {
    try {
      return await httpClient.get<Contract>(`${this.baseURL}/contracts/${id}`);
    } catch (error) {
      console.error(`Failed to fetch contract ${id}:`, error);
      throw error;
    }
  }

  async createContract(contractData: CreateContractRequest): Promise<Contract> {
    try {
      return await httpClient.post<Contract>(`${this.baseURL}/contracts`, contractData);
    } catch (error) {
      console.error('Failed to create contract:', error);
      throw error;
    }
  }

  async updateContract(id: string, contractData: UpdateContractRequest): Promise<Contract> {
    try {
      return await httpClient.put<Contract>(`${this.baseURL}/contracts/${id}`, contractData);
    } catch (error) {
      console.error(`Failed to update contract ${id}:`, error);
      throw error;
    }
  }

  async deleteContract(id: string): Promise<void> {
    try {
      await httpClient.delete(`${this.baseURL}/contracts/${id}`);
    } catch (error) {
      console.error(`Failed to delete contract ${id}:`, error);
      throw error;
    }
  }

  async approveContract(id: string): Promise<Contract> {
    try {
      return await httpClient.put<Contract>(`${this.baseURL}/contracts/${id}/approve`);
    } catch (error) {
      console.error(`Failed to approve contract ${id}:`, error);
      throw error;
    }
  }

  async rejectContract(id: string, reason?: string): Promise<Contract> {
    try {
      return await httpClient.put<Contract>(`${this.baseURL}/contracts/${id}/reject`, { reason });
    } catch (error) {
      console.error(`Failed to reject contract ${id}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const contractService = new ContractService();

export default contractService;
