'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Input, Button, Select, Space, Tooltip, Popconfirm, message } from 'antd';
import { PlusOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { categoryService, CategoryItem } from '@/services/categoryService';
import CategorySelector from './CategorySelector';

const { Option } = Select;

interface TagManagerProps {
  contractId?: string;
  initialTags?: string[];
  initialCategories?: string[];
  onTagsChange?: (tags: string[]) => void;
  onCategoriesChange?: (categories: string[]) => void;
  maxTags?: number;
  maxCategories?: number;
  allowCustomTags?: boolean;
  allowMultipleCategories?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
  className?: string;
}

interface TagItem {
  id: string;
  value: string;
  type: 'category' | 'custom';
  displayName: string;
  color?: string;
}

export const TagManager: React.FC<TagManagerProps> = ({
  contractId,
  initialTags = [],
  initialCategories = [],
  onTagsChange,
  onCategoriesChange,
  maxTags = 10,
  maxCategories = 5,
  allowCustomTags = true,
  allowMultipleCategories = true,
  showCategories = true,
  showTags = true,
  disabled = false,
  size = 'middle',
  style,
  className
}) => {
  const { t } = useTranslation('contracts');
  const [tags, setTags] = useState<TagItem[]>([]);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load available categories on component mount
  useEffect(() => {
    loadAvailableCategories();
  }, []);

  // Initialize tags from initial values
  useEffect(() => {
    const initialTagItems: TagItem[] = [
      ...initialCategories.map(cat => ({
        id: `cat_${cat}`,
        value: cat,
        type: 'category' as const,
        displayName: t(`categories.${cat}`, cat),
        color: 'blue'
      })),
      ...initialTags.map(tag => ({
        id: `tag_${tag}`,
        value: tag,
        type: 'custom' as const,
        displayName: tag,
        color: 'default'
      }))
    ];
    setTags(initialTagItems);
  }, [initialTags, initialCategories, t]);

  const loadAvailableCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      setAvailableCategories(response.data.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = (categoryValue: string) => {
    if (!allowMultipleCategories && categories.length >= 1) {
      message.warning('Chỉ được chọn một danh mục chính');
      return;
    }

    if (categories.length >= maxCategories) {
      message.warning(`Tối đa ${maxCategories} danh mục`);
      return;
    }

    if (categories.includes(categoryValue)) {
      message.warning('Danh mục đã được thêm');
      return;
    }

    const newCategories = [...categories, categoryValue];
    setCategories(newCategories);
    
    // Add to tags display
    const category = availableCategories.find(c => c.value === categoryValue);
    const newTag: TagItem = {
      id: `cat_${categoryValue}`,
      value: categoryValue,
      type: 'category',
      displayName: category?.displayName || categoryValue,
      color: 'blue'
    };
    
    setTags(prev => [...prev, newTag]);
    
    if (onCategoriesChange) {
      onCategoriesChange(newCategories);
    }
  };

  const handleAddCustomTag = () => {
    const tagValue = customTagInput.trim();
    
    if (!tagValue) {
      message.warning('Vui lòng nhập tên thẻ');
      return;
    }

    if (tags.length >= maxTags) {
      message.warning(`Tối đa ${maxTags} thẻ`);
      return;
    }

    if (tags.some(tag => tag.value === tagValue)) {
      message.warning('Thẻ đã tồn tại');
      return;
    }

    const newTag: TagItem = {
      id: `tag_${tagValue}`,
      value: tagValue,
      type: 'custom',
      displayName: tagValue,
      color: 'default'
    };

    const newTags = [...tags, newTag];
    setTags(newTags);
    setCustomTagInput('');
    setIsAddingTag(false);

    // Update tags for parent component
    const customTags = newTags.filter(tag => tag.type === 'custom').map(tag => tag.value);
    if (onTagsChange) {
      onTagsChange(customTags);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    const tagToRemove = tags.find(tag => tag.id === tagId);
    if (!tagToRemove) return;

    const newTags = tags.filter(tag => tag.id !== tagId);
    setTags(newTags);

    if (tagToRemove.type === 'category') {
      const newCategories = categories.filter(cat => cat !== tagToRemove.value);
      setCategories(newCategories);
      if (onCategoriesChange) {
        onCategoriesChange(newCategories);
      }
    } else {
      const customTags = newTags.filter(tag => tag.type === 'custom').map(tag => tag.value);
      if (onTagsChange) {
        onTagsChange(customTags);
      }
    }
  };

  const handleEditTag = (tagId: string, newValue: string) => {
    const newTags = tags.map(tag => 
      tag.id === tagId 
        ? { ...tag, value: newValue, displayName: newValue }
        : tag
    );
    setTags(newTags);

    // Update parent component
    const customTags = newTags.filter(tag => tag.type === 'custom').map(tag => tag.value);
    if (onTagsChange) {
      onTagsChange(customTags);
    }
  };

  const renderTag = (tag: TagItem) => (
    <Tag
      key={tag.id}
      color={tag.color}
      closable={!disabled}
      onClose={() => handleRemoveTag(tag.id)}
      className="mb-2"
    >
      <span className="flex items-center gap-1">
        {tag.type === 'category' && <span className="text-xs">📁</span>}
        {tag.displayName}
      </span>
    </Tag>
  );

  return (
    <div className={`tag-manager ${className || ''}`} style={style}>
      {/* Categories Section */}
      {showCategories && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {t('ui.primaryCategory')}
          </label>
          <CategorySelector
            value={categories.length > 0 ? categories[0] : undefined}
            onChange={(value) => {
              if (typeof value === 'string') {
                handleAddCategory(value);
              }
            }}
            placeholder={t('ui.selectCategory')}
            searchable
            disabled={disabled || loading}
            size={size}
            allowClear
          />
          
          {allowMultipleCategories && categories.length > 0 && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-2">
                {t('ui.secondaryCategories')}
              </label>
              <CategorySelector
                value={categories.slice(1)}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    const newCategories = [categories[0], ...value];
                    setCategories(newCategories);
                    if (onCategoriesChange) {
                      onCategoriesChange(newCategories);
                    }
                  }
                }}
                placeholder={t('ui.selectCategory')}
                multiple
                searchable
                disabled={disabled || loading}
                size={size}
                allowClear
              />
            </div>
          )}
        </div>
      )}

      {/* Tags Section */}
      {showTags && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {t('ui.categoryTags')}
          </label>
          
          {/* Display existing tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(renderTag)}
          </div>

          {/* Add custom tag input */}
          {allowCustomTags && !disabled && (
            <div className="flex gap-2">
              {!isAddingTag ? (
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddingTag(true)}
                  size={size}
                  disabled={tags.length >= maxTags}
                >
                  {t('ui.addTag')}
                </Button>
              ) : (
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    placeholder="Nhập tên thẻ mới"
                    size={size}
                    onPressEnter={handleAddCustomTag}
                    onBlur={() => {
                      if (!customTagInput.trim()) {
                        setIsAddingTag(false);
                      }
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={handleAddCustomTag}
                    size={size}
                  >
                    Thêm
                  </Button>
                  <Button
                    onClick={() => {
                      setCustomTagInput('');
                      setIsAddingTag(false);
                    }}
                    size={size}
                  >
                    Hủy
                  </Button>
                </Space.Compact>
              )}
            </div>
          )}

          {/* Tag limits info */}
          <div className="text-xs text-gray-500 mt-2">
            {tags.length}/{maxTags} thẻ • {categories.length}/{maxCategories} danh mục
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-gray-600">
        <div>Tổng: {tags.length} thẻ</div>
        <div>Danh mục: {categories.length}</div>
        <div>Thẻ tùy chỉnh: {tags.filter(tag => tag.type === 'custom').length}</div>
      </div>
    </div>
  );
};

export default TagManager;
