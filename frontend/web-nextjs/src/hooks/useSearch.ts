import { useState, useCallback, useRef, useEffect } from 'react';
import { searchService, SearchResult } from '@/services/searchService';
import { message } from 'antd';

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  autoSearch?: boolean;
  onError?: (error: Error) => void;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
  hasSearched: boolean;
  totalCount: number;
  suggestions: string[];
  loadSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
}

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    autoSearch = true,
    onError
  } = options;

  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const debounceRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (searchQuery.trim().length >= minQueryLength) {
          search(searchQuery);
        } else {
          clearResults();
        }
      }, debounceMs);
    },
    [debounceMs, minQueryLength]
  );

  // Set query with debounced search
  const setQuery = useCallback(
    (newQuery: string) => {
      setQueryState(newQuery);
      setError(null);

      if (autoSearch) {
        debouncedSearch(newQuery);
      }
    },
    [autoSearch, debouncedSearch]
  );

  // Search function
  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        clearResults();
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const response = await searchService.search(searchQuery, {
          limit: 10,
          page: 1,
        });

        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        setResults(response.data.results);
        setTotalCount(response.data.totalCount);

        // Track search for analytics
        await searchService.saveSearchQuery(searchQuery, response.data.totalCount);
      } catch (error) {
        // Don't set error if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const errorMessage = error instanceof Error ? error.message : 'Search failed';
        setError(errorMessage);

        if (onError) {
          onError(error as Error);
        } else {
          message.error(`Tìm kiếm thất bại: ${errorMessage}`);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [onError]
  );

  // Load suggestions
  const loadSuggestions = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim().length < minQueryLength) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await searchService.getSuggestions(searchQuery);
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error('Failed to load suggestions:', error);
        setSuggestions([]);
      }
    },
    [minQueryLength]
  );

  // Clear results
  const clearResults = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setHasSearched(false);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    search,
    clearResults,
    clearError,
    hasSearched,
    totalCount,
    suggestions,
    loadSuggestions,
    clearSuggestions,
  };
};

export default useSearch;
