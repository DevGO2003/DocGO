import { RestResponse } from '@/types/api';

// Types for Search API responses
export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'contract' | 'document' | 'user' | 'category';
  url: string;
  score?: number;
  metadata?: {
    [key: string]: any;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  query: string;
  took: number; // Search time in milliseconds
  suggestions?: string[];
}

export interface SearchFilters {
  type?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  status?: string[];
  category?: string[];
}

export interface SearchOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: SearchFilters;
}

/**
 * Service for global search functionality
 */
class SearchService {
  private baseUrl = '/api/v1/search';

  /**
   * Perform global search across all entities
   */
  async search(
    query: string, 
    options: SearchOptions = {}
  ): Promise<RestResponse<SearchResponse>> {
    const params = new URLSearchParams({
      q: query,
      page: (options.page || 1).toString(),
      limit: (options.limit || 10).toString(),
      ...(options.sortBy && { sortBy: options.sortBy }),
      ...(options.sortOrder && { sortOrder: options.sortOrder }),
    });

    // Add filters to params
    if (options.filters) {
      if (options.filters.type) {
        options.filters.type.forEach(type => params.append('type', type));
      }
      if (options.filters.status) {
        options.filters.status.forEach(status => params.append('status', status));
      }
      if (options.filters.category) {
        options.filters.category.forEach(category => params.append('category', category));
      }
      if (options.filters.dateRange) {
        params.append('dateFrom', options.filters.dateRange.from);
        params.append('dateTo', options.filters.dateRange.to);
      }
    }

    const response = await fetch(`${this.baseUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Search contracts specifically
   */
  async searchContracts(
    query: string, 
    options: SearchOptions = {}
  ): Promise<RestResponse<SearchResponse>> {
    const params = new URLSearchParams({
      q: query,
      type: 'contract',
      page: (options.page || 1).toString(),
      limit: (options.limit || 10).toString(),
      ...(options.sortBy && { sortBy: options.sortBy }),
      ...(options.sortOrder && { sortOrder: options.sortOrder }),
    });

    const response = await fetch(`${this.baseUrl}/contracts?${params}`);
    if (!response.ok) {
      throw new Error(`Contract search failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Search documents specifically
   */
  async searchDocuments(
    query: string, 
    options: SearchOptions = {}
  ): Promise<RestResponse<SearchResponse>> {
    const params = new URLSearchParams({
      q: query,
      type: 'document',
      page: (options.page || 1).toString(),
      limit: (options.limit || 10).toString(),
      ...(options.sortBy && { sortBy: options.sortBy }),
      ...(options.sortOrder && { sortOrder: options.sortOrder }),
    });

    const response = await fetch(`${this.baseUrl}/documents?${params}`);
    if (!response.ok) {
      throw new Error(`Document search failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Search users specifically
   */
  async searchUsers(
    query: string, 
    options: SearchOptions = {}
  ): Promise<RestResponse<SearchResponse>> {
    const params = new URLSearchParams({
      q: query,
      type: 'user',
      page: (options.page || 1).toString(),
      limit: (options.limit || 10).toString(),
      ...(options.sortBy && { sortBy: options.sortBy }),
      ...(options.sortOrder && { sortOrder: options.sortOrder }),
    });

    const response = await fetch(`${this.baseUrl}/users?${params}`);
    if (!response.ok) {
      throw new Error(`User search failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get search suggestions/autocomplete
   */
  async getSuggestions(query: string): Promise<RestResponse<{ suggestions: string[] }>> {
    const response = await fetch(`${this.baseUrl}/suggestions?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Failed to get suggestions: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get popular searches
   */
  async getPopularSearches(): Promise<RestResponse<{ searches: string[] }>> {
    const response = await fetch(`${this.baseUrl}/popular`);
    if (!response.ok) {
      throw new Error(`Failed to get popular searches: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get search analytics
   */
  async getSearchAnalytics(
    dateRange?: { from: string; to: string }
  ): Promise<RestResponse<{
    totalSearches: number;
    uniqueQueries: number;
    topQueries: Array<{ query: string; count: number }>;
    searchTrends: Array<{ date: string; count: number }>;
  }>> {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('from', dateRange.from);
      params.append('to', dateRange.to);
    }

    const response = await fetch(`${this.baseUrl}/analytics?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to get search analytics: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Save search query for analytics
   */
  async saveSearchQuery(query: string, resultCount: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          resultCount,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      // Silently fail for analytics tracking
      console.warn('Failed to track search query:', error);
    }
  }

  /**
   * Clear search history
   */
  async clearSearchHistory(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/history`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error(`Failed to clear search history: ${error}`);
    }
  }

  /**
   * Get search history
   */
  async getSearchHistory(): Promise<RestResponse<{ history: string[] }>> {
    const response = await fetch(`${this.baseUrl}/history`);
    if (!response.ok) {
      throw new Error(`Failed to get search history: ${response.statusText}`);
    }
    return response.json();
  }
}

// Export singleton instance
export const searchService = new SearchService();
export default searchService;

