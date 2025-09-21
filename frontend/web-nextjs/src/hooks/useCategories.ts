import { useState, useEffect, useCallback } from 'react';
import { categoryService, CategoryItem, StatusItem, TypeItem } from '@/services/categoryService';
import { message } from 'antd';

interface UseCategoriesOptions {
  autoLoad?: boolean;
  cache?: boolean;
  onError?: (error: Error) => void;
}

interface UseCategoriesReturn {
  // Categories
  categories: CategoryItem[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  loadCategories: () => Promise<void>;
  searchCategories: (query: string) => Promise<CategoryItem[]>;
  
  // Statuses
  statuses: StatusItem[];
  statusesLoading: boolean;
  statusesError: string | null;
  loadStatuses: () => Promise<void>;
  getNextStatuses: (currentStatus: string) => Promise<StatusItem[]>;
  
  // Types
  types: TypeItem[];
  typesLoading: boolean;
  typesError: string | null;
  loadTypes: () => Promise<void>;
  searchTypes: (query: string) => Promise<TypeItem[]>;
  
  // Hierarchical data
  hierarchicalCategories: { [mainCategory: string]: { [subCategory: string]: CategoryItem[] } };
  categoriesByMain: { [mainCategory: string]: CategoryItem[] };
  typesByGroup: { [group: string]: TypeItem[] };
  
  // Validation
  validateCategory: (category: string) => Promise<boolean>;
  validateStatus: (status: string) => Promise<boolean>;
  validateType: (type: string) => Promise<boolean>;
  validateStatusTransition: (currentStatus: string, newStatus: string) => Promise<boolean>;
  
  // Utilities
  refresh: () => Promise<void>;
  clearCache: () => void;
}

export const useCategories = (options: UseCategoriesOptions = {}): UseCategoriesReturn => {
  const {
    autoLoad = true,
    cache = true,
    onError
  } = options;

  // Categories state
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Statuses state
  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);
  const [statusesError, setStatusesError] = useState<string | null>(null);

  // Types state
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [typesError, setTypesError] = useState<string | null>(null);

  // Hierarchical data state
  const [hierarchicalCategories, setHierarchicalCategories] = useState<{ [mainCategory: string]: { [subCategory: string]: CategoryItem[] } }>({});
  const [categoriesByMain, setCategoriesByMain] = useState<{ [mainCategory: string]: CategoryItem[] }>({});
  const [typesByGroup, setTypesByGroup] = useState<{ [group: string]: TypeItem[] }>({});

  // Cache
  const [cache, setCache] = useState<{
    categories?: CategoryItem[];
    statuses?: StatusItem[];
    types?: TypeItem[];
    hierarchical?: { [mainCategory: string]: { [subCategory: string]: CategoryItem[] } };
    categoriesByMain?: { [mainCategory: string]: CategoryItem[] };
    typesByGroup?: { [group: string]: TypeItem[] };
  }>({});

  // Load categories
  const loadCategories = useCallback(async () => {
    if (cache && cache.categories) {
      setCategories(cache.categories);
      setHierarchicalCategories(cache.hierarchical || {});
      setCategoriesByMain(cache.categoriesByMain || {});
      return;
    }

    setCategoriesLoading(true);
    setCategoriesError(null);

    try {
      const [categoriesResponse, hierarchicalResponse, groupedResponse] = await Promise.all([
        categoryService.getAllCategories(),
        categoryService.getHierarchicalCategories(),
        categoryService.getCategoriesGroupedByMain()
      ]);

      const categoriesData = categoriesResponse.data.categories;
      setCategories(categoriesData);
      setHierarchicalCategories(hierarchicalResponse);
      setCategoriesByMain(groupedResponse);

      if (cache) {
        setCache(prev => ({
          ...prev,
          categories: categoriesData,
          hierarchical: hierarchicalResponse,
          categoriesByMain: groupedResponse
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
      setCategoriesError(errorMessage);
      if (onError) {
        onError(error as Error);
      } else {
        message.error(`Lỗi tải danh mục: ${errorMessage}`);
      }
    } finally {
      setCategoriesLoading(false);
    }
  }, [cache, onError]);

  // Load statuses
  const loadStatuses = useCallback(async () => {
    if (cache && cache.statuses) {
      setStatuses(cache.statuses);
      return;
    }

    setStatusesLoading(true);
    setStatusesError(null);

    try {
      const response = await categoryService.getAllStatuses();
      const statusesData = response.data.statuses;
      setStatuses(statusesData);

      if (cache) {
        setCache(prev => ({
          ...prev,
          statuses: statusesData
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load statuses';
      setStatusesError(errorMessage);
      if (onError) {
        onError(error as Error);
      } else {
        message.error(`Lỗi tải trạng thái: ${errorMessage}`);
      }
    } finally {
      setStatusesLoading(false);
    }
  }, [cache, onError]);

  // Load types
  const loadTypes = useCallback(async () => {
    if (cache && cache.types) {
      setTypes(cache.types);
      setTypesByGroup(cache.typesByGroup || {});
      return;
    }

    setTypesLoading(true);
    setTypesError(null);

    try {
      const [typesResponse, groupedResponse] = await Promise.all([
        categoryService.getAllTypes(),
        categoryService.getTypesGroupedByGroup()
      ]);

      const typesData = typesResponse.data.types;
      setTypes(typesData);
      setTypesByGroup(groupedResponse);

      if (cache) {
        setCache(prev => ({
          ...prev,
          types: typesData,
          typesByGroup: groupedResponse
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load types';
      setTypesError(errorMessage);
      if (onError) {
        onError(error as Error);
      } else {
        message.error(`Lỗi tải loại hợp đồng: ${errorMessage}`);
      }
    } finally {
      setTypesLoading(false);
    }
  }, [cache, onError]);

  // Search categories
  const searchCategories = useCallback(async (query: string): Promise<CategoryItem[]> => {
    try {
      const response = await categoryService.searchCategories(query);
      return response.data.categories;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search categories';
      if (onError) {
        onError(error as Error);
      } else {
        message.error(`Lỗi tìm kiếm danh mục: ${errorMessage}`);
      }
      return [];
    }
  }, [onError]);

  // Search types
  const searchTypes = useCallback(async (query: string): Promise<TypeItem[]> => {
    try {
      const response = await categoryService.searchTypes(query);
      return response.data.types;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search types';
      if (onError) {
        onError(error as Error);
      } else {
        message.error(`Lỗi tìm kiếm loại hợp đồng: ${errorMessage}`);
      }
      return [];
    }
  }, [onError]);

  // Get next statuses
  const getNextStatuses = useCallback(async (currentStatus: string): Promise<StatusItem[]> => {
    try {
      const response = await categoryService.getPossibleNextStatuses(currentStatus);
      return response.data.statuses;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get next statuses';
      if (onError) {
        onError(error as Error);
      } else {
        message.error(`Lỗi lấy trạng thái tiếp theo: ${errorMessage}`);
      }
      return [];
    }
  }, [onError]);

  // Validation functions
  const validateCategory = useCallback(async (category: string): Promise<boolean> => {
    try {
      const response = await categoryService.validateCategory(category);
      return response.data;
    } catch (error) {
      console.error('Error validating category:', error);
      return false;
    }
  }, []);

  const validateStatus = useCallback(async (status: string): Promise<boolean> => {
    try {
      const response = await categoryService.validateStatus(status);
      return response.data;
    } catch (error) {
      console.error('Error validating status:', error);
      return false;
    }
  }, []);

  const validateType = useCallback(async (type: string): Promise<boolean> => {
    try {
      const response = await categoryService.validateType(type);
      return response.data;
    } catch (error) {
      console.error('Error validating type:', error);
      return false;
    }
  }, []);

  const validateStatusTransition = useCallback(async (currentStatus: string, newStatus: string): Promise<boolean> => {
    try {
      const response = await categoryService.validateStatusTransition(currentStatus, newStatus);
      return response.data;
    } catch (error) {
      console.error('Error validating status transition:', error);
      return false;
    }
  }, []);

  // Refresh all data
  const refresh = useCallback(async () => {
    clearCache();
    await Promise.all([
      loadCategories(),
      loadStatuses(),
      loadTypes()
    ]);
  }, [loadCategories, loadStatuses, loadTypes]);

  // Clear cache
  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadCategories();
      loadStatuses();
      loadTypes();
    }
  }, [autoLoad, loadCategories, loadStatuses, loadTypes]);

  return {
    // Categories
    categories,
    categoriesLoading,
    categoriesError,
    loadCategories,
    searchCategories,
    
    // Statuses
    statuses,
    statusesLoading,
    statusesError,
    loadStatuses,
    getNextStatuses,
    
    // Types
    types,
    typesLoading,
    typesError,
    loadTypes,
    searchTypes,
    
    // Hierarchical data
    hierarchicalCategories,
    categoriesByMain,
    typesByGroup,
    
    // Validation
    validateCategory,
    validateStatus,
    validateType,
    validateStatusTransition,
    
    // Utilities
    refresh,
    clearCache
  };
};

export default useCategories;

