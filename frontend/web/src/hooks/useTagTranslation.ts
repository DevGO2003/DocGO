// Mock i18n cho frontend/web (React thuần)
// Trong thực tế, cần cài đặt react-i18next hoặc sử dụng i18n library khác

/**
 * Hook để dịch tags sử dụng i18n
 * @returns Object chứa function translateTag
 */
export const useTagTranslation = () => {
  // Mock translation function
  const t = (key: string, options?: { defaultValue?: string }) => {
    // Trong thực tế, đây sẽ là logic i18n thật
    // Hiện tại chỉ return defaultValue hoặc key
    return options?.defaultValue || key
  }
  
  // Mock i18n object
  const i18n = {
    isInitialized: true
  }

  /**
   * Dịch tag name sang ngôn ngữ hiện tại
   * @param tagName - Tên tag gốc (key)
   * @returns Tên tag đã dịch hoặc tên gốc nếu không tìm thấy translation
   */
  const translateTag = (tagName: string): string => {
    if (!tagName) {
      return ''
    }

    // Sử dụng i18n để dịch tag
    // Key format: tags.{tagName}
    const translation = t(`tags.${tagName}`, { 
      defaultValue: tagName // Fallback về tên gốc nếu không có translation
    })

    return translation
  }

  /**
   * Dịch nhiều tags cùng lúc
   * @param tagNames - Mảng tên tags
   * @returns Mảng tên tags đã dịch
   */
  const translateTags = (tagNames: string[]): string[] => {
    if (!tagNames || tagNames.length === 0) {
      return tagNames || []
    }

    return tagNames.map(tagName => translateTag(tagName))
  }

  /**
   * Kiểm tra xem tag có translation không
   * @param tagName - Tên tag
   * @returns true nếu có translation, false nếu không
   */
  const hasTranslation = (tagName: string): boolean => {
    if (!tagName) {
      return false
    }

    const translation = t(`tags.${tagName}`, { 
      defaultValue: null 
    })

    return translation !== null && translation !== tagName
  }

  return {
    translateTag,
    translateTags,
    hasTranslation,
    isReady: i18n.isInitialized
  }
}
