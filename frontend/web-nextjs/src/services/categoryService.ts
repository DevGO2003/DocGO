import { RestResponse } from '@/types/api';

// Types for Category API responses
export interface CategoryItem {
  value: string;
  displayName: string;
  mainCategory: string;
  subCategory: string;
  specificCategory: string;
  description: string;
}

export interface CategoryResponse {
  categories: CategoryItem[];
  mainCategories: string[];
  totalCount: number;
}

export interface StatusItem {
  value: string;
  displayName: string;
  description: string;
  editable: boolean;
  active: boolean;
  finalStatus: boolean;
}

export interface StatusResponse {
  statuses: StatusItem[];
  totalCount: number;
}

export interface TypeItem {
  value: string;
  displayName: string;
  description: string;
  group: string;
}

export interface TypeResponse {
  types: TypeItem[];
  groups: string[];
  totalCount: number;
}

export interface CategoryStats {
  totalCategories: number;
  totalMainCategories: number;
  totalStatuses: number;
  totalTypes: number;
  totalGroups: number;
}

/**
 * Service for managing categories, statuses, and types
 */
class CategoryService {
  private baseUrl = '/api/v1/contract-management-service/categories';

  /**
   * Get all categories
   */
  async getAllCategories(): Promise<RestResponse<CategoryResponse>> {
    const response = await fetch(`${this.baseUrl}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get categories by main category
   */
  async getCategoriesByMainCategory(mainCategory: string): Promise<RestResponse<CategoryResponse>> {
    const response = await fetch(`${this.baseUrl}/${encodeURIComponent(mainCategory)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories for main category ${mainCategory}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get categories by sub category
   */
  async getCategoriesBySubCategory(
    mainCategory: string, 
    subCategory: string
  ): Promise<RestResponse<CategoryResponse>> {
    const response = await fetch(
      `${this.baseUrl}/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch categories for sub category ${subCategory}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Search categories
   */
  async searchCategories(query: string): Promise<RestResponse<CategoryResponse>> {
    const response = await fetch(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Failed to search categories: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get all statuses
   */
  async getAllStatuses(): Promise<RestResponse<StatusResponse>> {
    const response = await fetch(`${this.baseUrl}/statuses`);
    if (!response.ok) {
      throw new Error(`Failed to fetch statuses: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get possible next statuses from current status
   */
  async getPossibleNextStatuses(currentStatus: string): Promise<RestResponse<StatusResponse>> {
    const response = await fetch(`${this.baseUrl}/statuses/${encodeURIComponent(currentStatus)}/next`);
    if (!response.ok) {
      throw new Error(`Failed to fetch next statuses for ${currentStatus}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get all types
   */
  async getAllTypes(): Promise<RestResponse<TypeResponse>> {
    const response = await fetch(`${this.baseUrl}/types`);
    if (!response.ok) {
      throw new Error(`Failed to fetch types: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get types by group
   */
  async getTypesByGroup(group: string): Promise<RestResponse<TypeResponse>> {
    const response = await fetch(`${this.baseUrl}/types/group/${encodeURIComponent(group)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch types for group ${group}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Search types
   */
  async searchTypes(query: string): Promise<RestResponse<TypeResponse>> {
    const response = await fetch(`${this.baseUrl}/types/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Failed to search types: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Validate category
   */
  async validateCategory(category: string): Promise<RestResponse<boolean>> {
    const response = await fetch(`${this.baseUrl}/validate/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error(`Failed to validate category ${category}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Validate status
   */
  async validateStatus(status: string): Promise<RestResponse<boolean>> {
    const response = await fetch(`${this.baseUrl}/statuses/validate/${encodeURIComponent(status)}`);
    if (!response.ok) {
      throw new Error(`Failed to validate status ${status}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Validate type
   */
  async validateType(type: string): Promise<RestResponse<boolean>> {
    const response = await fetch(`${this.baseUrl}/types/validate/${encodeURIComponent(type)}`);
    if (!response.ok) {
      throw new Error(`Failed to validate type ${type}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Validate status transition
   */
  async validateStatusTransition(
    currentStatus: string, 
    newStatus: string
  ): Promise<RestResponse<boolean>> {
    const response = await fetch(
      `${this.baseUrl}/statuses/validate-transition?currentStatus=${encodeURIComponent(currentStatus)}&newStatus=${encodeURIComponent(newStatus)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to validate status transition: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<RestResponse<CategoryStats>> {
    const response = await fetch(`${this.baseUrl}/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch category stats: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get hierarchical categories (main -> sub -> specific)
   */
  async getHierarchicalCategories(): Promise<{
    [mainCategory: string]: {
      [subCategory: string]: CategoryItem[];
    };
  }> {
    const response = await this.getAllCategories();
    const hierarchical: { [mainCategory: string]: { [subCategory: string]: CategoryItem[] } } = {};

    response.data.categories.forEach(category => {
      if (!hierarchical[category.mainCategory]) {
        hierarchical[category.mainCategory] = {};
      }
      if (!hierarchical[category.mainCategory][category.subCategory]) {
        hierarchical[category.mainCategory][category.subCategory] = [];
      }
      hierarchical[category.mainCategory][category.subCategory].push(category);
    });

    return hierarchical;
  }

  /**
   * Get categories grouped by main category
   */
  async getCategoriesGroupedByMain(): Promise<{ [mainCategory: string]: CategoryItem[] }> {
    const response = await this.getAllCategories();
    const grouped: { [mainCategory: string]: CategoryItem[] } = {};

    response.data.categories.forEach(category => {
      if (!grouped[category.mainCategory]) {
        grouped[category.mainCategory] = [];
      }
      grouped[category.mainCategory].push(category);
    });

    return grouped;
  }

  /**
   * Get types grouped by group
   */
  async getTypesGroupedByGroup(): Promise<{ [group: string]: TypeItem[] }> {
    const response = await this.getAllTypes();
    const grouped: { [group: string]: TypeItem[] } = {};

    response.data.types.forEach(type => {
      if (!grouped[type.group]) {
        grouped[type.group] = [];
      }
      grouped[type.group].push(type);
    });

    return grouped;
  }

  /**
   * Search across all categories, statuses, and types
   */
  async searchAll(query: string): Promise<{
    categories: CategoryItem[];
    statuses: StatusItem[];
    types: TypeItem[];
  }> {
    const [categoriesResponse, statusesResponse, typesResponse] = await Promise.all([
      this.searchCategories(query),
      this.getAllStatuses(),
      this.searchTypes(query)
    ]);

    // Filter statuses by query
    const filteredStatuses = statusesResponse.data.statuses.filter(status =>
      status.value.toLowerCase().includes(query.toLowerCase()) ||
      status.displayName.toLowerCase().includes(query.toLowerCase()) ||
      status.description.toLowerCase().includes(query.toLowerCase())
    );

    return {
      categories: categoriesResponse.data.categories,
      statuses: filteredStatuses,
      types: typesResponse.data.types
    };
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
export default categoryService;
