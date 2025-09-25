import { useState, useEffect } from 'react';
import tagService, { Tag } from '../services/tagService';

export interface UseTagsReturn {
  tags: Tag[];
  popularTags: Tag[];
  loading: boolean;
  error: string | null;
  searchTags: (searchTerm?: string) => Promise<void>;
  refreshTags: () => Promise<void>;
}

export const useTags = (): UseTagsReturn => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const allTags = await tagService.getAllTags();
      setTags(allTags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
      console.error('Error fetching all tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const popular = await tagService.getPopularTags();
      setPopularTags(popular);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch popular tags');
      console.error('Error fetching popular tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchTags = async (searchTerm?: string) => {
    try {
      setLoading(true);
      setError(null);
      const searchResults = await tagService.searchTags(searchTerm);
      setTags(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search tags');
      console.error('Error searching tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshTags = async () => {
    await Promise.all([fetchAllTags(), fetchPopularTags()]);
  };

  // Load initial data
  useEffect(() => {
    refreshTags();
  }, []);

  return {
    tags,
    popularTags,
    loading,
    error,
    searchTags,
    refreshTags,
  };
};
