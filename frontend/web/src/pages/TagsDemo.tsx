import React, { useState } from 'react';
import TagSelector from '../components/TagSelector';

const TagsDemo: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    console.log('Selected tags:', tags);
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demo Tag Selector
          </h1>
          <p className="text-gray-600 mb-6">
            Component để chọn tags từ database với tính năng tìm kiếm và hiển thị tags phổ biến.
          </p>

          <div className="space-y-6">
            {/* Tag Selector */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Chọn Tags
              </h2>
              <TagSelector
                selectedTags={selectedTags}
                onTagsChange={handleTagsChange}
                showPopular={true}
                showSearch={true}
                maxTags={5}
              />
            </div>

            {/* Selected Tags Display */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Tags đã chọn
                </h2>
                {selectedTags.length > 0 && (
                  <button
                    onClick={handleClearTags}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
              
              {selectedTags.length > 0 ? (
                <div className="space-y-2">
                  {selectedTags.map((tag, index) => (
                    <div
                      key={tag}
                      className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <span className="font-medium text-blue-800">
                        {index + 1}. {tag}
                      </span>
                      <button
                        onClick={() => handleTagsChange(selectedTags.filter(t => t !== tag))}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa chọn tags nào
                </div>
              )}
            </div>

            {/* JSON Output */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                JSON Output
              </h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{JSON.stringify(selectedTags, null, 2)}</code>
              </pre>
            </div>

            {/* API Endpoints Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                API Endpoints
              </h2>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <strong>GET</strong> <code>/api/v1/contract-management-service/tags/all</code>
                  <br />
                  <span className="text-green-700">Lấy tất cả tags</span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <strong>GET</strong> <code>/api/v1/contract-management-service/tags/popular</code>
                  <br />
                  <span className="text-blue-700">Lấy 10 tags phổ biến nhất</span>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <strong>GET</strong> <code>/api/v1/contract-management-service/tags/search?searchTerm=ưu</code>
                  <br />
                  <span className="text-purple-700">Tìm kiếm tags theo từ khóa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsDemo;
