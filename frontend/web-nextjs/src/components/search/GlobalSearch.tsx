'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input, List, Avatar, Typography, Empty, Spin } from 'antd';
import { SearchOutlined, FileTextOutlined, UserOutlined, FolderOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@/hooks/useSearch';

const { Search } = Input;
const { Text } = Typography;

interface SearchSuggestion {
  id: string;
  title: string;
  description?: string;
  type: 'contract' | 'document' | 'user' | 'category';
  url: string;
  icon?: React.ReactNode;
}

interface GlobalSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onSearch,
  placeholder,
  className = '',
  size = 'middle'
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { results, isLoading, search } = useSearch();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length >= 2) {
      search(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search submit
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    saveRecentSearch(searchQuery);
    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Default behavior: navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    router.push(suggestion.url);
  };

  // Handle recent search click
  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    handleSearch(recentQuery);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get icon for search result type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return <FileTextOutlined className="text-blue-500" />;
      case 'document':
        return <FolderOutlined className="text-green-500" />;
      case 'user':
        return <UserOutlined className="text-purple-500" />;
      default:
        return <SearchOutlined className="text-gray-500" />;
    }
  };

  // Render search suggestions
  const renderSuggestions = () => {
    if (isLoading) {
      return (
        <div className="p-4 text-center">
          <Spin size="small" />
          <div className="mt-2 text-sm text-gray-500">{t('search.searching')}</div>
        </div>
      );
    }

    if (results.length === 0 && query.trim().length >= 2) {
      return (
        <div className="p-4">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t('search.noResults')}
            className="py-8"
          />
        </div>
      );
    }

    if (results.length > 0) {
      return (
        <List
          dataSource={results}
          renderItem={(item: SearchSuggestion) => (
            <List.Item
              className="cursor-pointer hover:bg-gray-50 px-4 py-3"
              onClick={() => handleSuggestionClick(item)}
            >
              <List.Item.Meta
                avatar={<Avatar icon={getTypeIcon(item.type)} size="small" />}
                title={
                  <Text className="text-sm font-medium">
                    {item.title}
                  </Text>
                }
                description={
                  <Text className="text-xs text-gray-500">
                    {item.description}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      );
    }

    // Show recent searches when no query
    if (recentSearches.length > 0 && !query.trim()) {
      return (
        <div className="p-4">
          <div className="text-xs font-medium text-gray-500 mb-2">
            {t('search.recentSearches')}
          </div>
          {recentSearches.map((recent, index) => (
            <div
              key={index}
              className="cursor-pointer hover:bg-gray-50 px-2 py-2 rounded text-sm"
              onClick={() => handleRecentSearchClick(recent)}
            >
              <SearchOutlined className="mr-2 text-gray-400" />
              {recent}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <Search
        value={query}
        onChange={handleInputChange}
        onSearch={handleSearch}
        placeholder={placeholder || t('search.placeholder')}
        size={size}
        prefix={<SearchOutlined className="text-gray-400" />}
        onFocus={() => setShowSuggestions(true)}
        allowClear
        className="w-full"
      />
      
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {renderSuggestions()}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;

