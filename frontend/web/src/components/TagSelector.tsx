import React, { useState } from 'react';
import { useTags } from '../hooks/useTags';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  showPopular?: boolean;
  showSearch?: boolean;
  maxTags?: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  showPopular = true,
  showSearch = true,
  maxTags = 10,
}) => {
  const { tags, popularTags, loading, error, searchTags } = useTags();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  const handleTagToggle = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(tag => tag !== tagName));
    } else if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      await searchTags(term);
    } else {
      setShowAllTags(true);
    }
  };

  const displayTags = searchTerm.trim() ? tags : (showAllTags ? tags : popularTags);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải tags...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tags..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* Show All Tags Button */}
      {!searchTerm.trim() && !showAllTags && (
        <button
          onClick={() => setShowAllTags(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Xem tất cả tags ({tags.length})
        </button>
      )}

      {/* Tags Grid */}
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => handleTagToggle(tag.name)}
            disabled={!selectedTags.includes(tag.name) && selectedTags.length >= maxTags}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${selectedTags.includes(tag.name)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${!selectedTags.includes(tag.name) && selectedTags.length >= maxTags
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
              }
            `}
          >
            {tag.displayName}
            {tag.count > 0 && (
              <span className="ml-1 text-xs opacity-75">
                ({tag.count})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Selected Tags Summary */}
      {selectedTags.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">
            Đã chọn {selectedTags.length}/{maxTags} tags:
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedTags.map((tagName) => (
              <span
                key={tagName}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full"
              >
                {tagName}
                <button
                  onClick={() => handleTagToggle(tagName)}
                  className="ml-1 hover:text-red-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* No Tags Message */}
      {displayTags.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm.trim() 
            ? `Không tìm thấy tags nào cho "${searchTerm}"`
            : 'Không có tags nào'
          }
        </div>
      )}
    </div>
  );
};

export default TagSelector;
