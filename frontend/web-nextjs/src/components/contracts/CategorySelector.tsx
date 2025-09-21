'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Select, Input, Spin, Empty, TreeSelect, Cascader } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { categoryService, CategoryItem } from '@/services/categoryService';
import { RestResponse } from '@/types/api';

const { Option } = Select;
const { Search } = Input;

interface CategorySelectorProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  hierarchical?: boolean;
  showSearch?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
  className?: string;
  onSearch?: (value: string) => void;
  onSelect?: (value: string, option: CategoryItem) => void;
  onDeselect?: (value: string) => void;
  loading?: boolean;
  error?: string;
}

interface HierarchicalCategory {
  value: string;
  title: string;
  children?: HierarchicalCategory[];
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  placeholder,
  searchable = true,
  multiple = false,
  hierarchical = false,
  showSearch = true,
  allowClear = true,
  disabled = false,
  size = 'middle',
  style,
  className,
  onSearch,
  onSelect,
  onDeselect,
  loading = false,
  error
}) => {
  const { t } = useTranslation('contracts');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [hierarchicalData, setHierarchicalData] = useState<HierarchicalCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<CategoryItem[]>([]);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      if (hierarchical) {
        const response = await categoryService.getHierarchicalCategories();
        const hierarchicalCategories = convertToHierarchicalData(response);
        setHierarchicalData(hierarchicalCategories);
      } else {
        const response = await categoryService.getAllCategories();
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const convertToHierarchicalData = (data: { [mainCategory: string]: { [subCategory: string]: CategoryItem[] } }): HierarchicalCategory[] => {
    return Object.entries(data).map(([mainCategory, subCategories]) => ({
      value: mainCategory,
      title: t(`categoryGroups.${mainCategory}`, mainCategory),
      children: Object.entries(subCategories).map(([subCategory, items]) => ({
        value: `${mainCategory}_${subCategory}`,
        title: t(`subCategories.${subCategory}`, subCategory),
        children: items.map(item => ({
          value: item.value,
          title: t(`categories.${item.value}`, item.displayName)
        }))
      }))
    }));
  };

  const handleSearch = async (query: string) => {
    setSearchValue(query);
    if (onSearch) {
      onSearch(query);
    }

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await categoryService.searchCategories(query);
      setSearchResults(response.data.categories);
    } catch (error) {
      console.error('Error searching categories:', error);
      setSearchResults([]);
    }
  };

  const handleSelect = (selectedValue: string, option: any) => {
    const category = categories.find(c => c.value === selectedValue) || 
                   searchResults.find(c => c.value === selectedValue);
    
    if (category && onSelect) {
      onSelect(selectedValue, category);
    }
  };

  const handleDeselect = (deselectedValue: string) => {
    if (onDeselect) {
      onDeselect(deselectedValue);
    }
  };

  const displayCategories = useMemo(() => {
    if (searchValue.trim().length >= 2) {
      return searchResults;
    }
    return categories;
  }, [searchValue, searchResults, categories]);

  const renderOption = (category: CategoryItem) => (
    <Option key={category.value} value={category.value}>
      <div className="flex flex-col">
        <span className="font-medium">
          {t(`categories.${category.value}`, category.displayName)}
        </span>
        <span className="text-xs text-gray-500">
          {t(`categoryGroups.${category.mainCategory}`, category.mainCategory)} • 
          {t(`subCategories.${category.subCategory}`, category.subCategory)}
        </span>
      </div>
    </Option>
  );

  const renderHierarchicalOption = (item: HierarchicalCategory) => (
    <TreeSelect.TreeNode
      key={item.value}
      value={item.value}
      title={item.title}
      children={item.children?.map(renderHierarchicalOption)}
    />
  );

  if (hierarchical) {
    return (
      <div className={`category-selector ${className || ''}`} style={style}>
        <TreeSelect
          value={value}
          onChange={onChange}
          placeholder={placeholder || t('ui.selectCategory')}
          treeData={hierarchicalData}
          showSearch={showSearch}
          allowClear={allowClear}
          disabled={disabled || loading || loadingCategories}
          size={size}
          loading={loading || loadingCategories}
          treeDefaultExpandAll={false}
          treeNodeFilterProp="title"
          filterTreeNode={(input, node) =>
            node.title?.toString().toLowerCase().includes(input.toLowerCase()) || false
          }
          suffixIcon={<DownOutlined />}
          className={error ? 'border-red-500' : ''}
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>
    );
  }

  return (
    <div className={`category-selector ${className || ''}`} style={style}>
      <Select
        value={value}
        onChange={onChange}
        placeholder={placeholder || t('ui.selectCategory')}
        mode={multiple ? 'multiple' : undefined}
        showSearch={showSearch}
        allowClear={allowClear}
        disabled={disabled || loading || loadingCategories}
        size={size}
        loading={loading || loadingCategories}
        onSearch={searchable ? handleSearch : undefined}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        filterOption={false} // Disable client-side filtering since we're using server-side search
        notFoundContent={
          loadingCategories ? (
            <div className="text-center py-4">
              <Spin size="small" />
              <div className="mt-2">{t('ui.loading')}</div>
            </div>
          ) : searchValue.trim().length >= 2 && searchResults.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t('ui.noResults')}
            />
          ) : null
        }
        className={error ? 'border-red-500' : ''}
        suffixIcon={<DownOutlined />}
      >
        {displayCategories.map(renderOption)}
      </Select>
      
      {searchable && (
        <div className="mt-2">
          <Search
            placeholder={t('ui.searchCategories')}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            size="small"
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      )}
      
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default CategorySelector;
