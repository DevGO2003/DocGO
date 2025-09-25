// Tag Service for fetching tags from contract-management-service
import httpClient from '../utils/httpClient';

export interface Tag {
  name: string;
  displayName: string;
  count: number;
  isPopular: boolean;
}

export interface TagResponse {
  apiVersion: string;
  statusCode: number;
  shortMessage: string;
  description: string;
  data: Tag[];
  timestamp: string;
  requestId: string;
  path: string;
}

class TagService {
  private readonly baseURL = '/api/v1/contract-management-service';

  /**
   * Lấy tất cả tags được sắp xếp theo tên
   */
  async getAllTags(): Promise<Tag[]> {
    try {
      const response = await httpClient.get<TagResponse>(`${this.baseURL}/tags/all`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch all tags:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách 10 tags phổ biến nhất
   */
  async getPopularTags(): Promise<Tag[]> {
    try {
      const response = await httpClient.get<TagResponse>(`${this.baseURL}/tags/popular`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch popular tags:', error);
      throw error;
    }
  }

  /**
   * Tìm kiếm tags theo từ khóa
   */
  async searchTags(searchTerm?: string): Promise<Tag[]> {
    try {
      const url = searchTerm 
        ? `${this.baseURL}/tags/search?searchTerm=${encodeURIComponent(searchTerm)}`
        : `${this.baseURL}/tags/search`;
      
      const response = await httpClient.get<TagResponse>(url);
      return response.data || [];
    } catch (error) {
      console.error('Failed to search tags:', error);
      throw error;
    }
  }
}

// Create singleton instance
const tagService = new TagService();

export default tagService;
