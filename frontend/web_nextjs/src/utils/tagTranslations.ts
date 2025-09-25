/**
 * Utility functions for translating contract tags and statuses
 */

/**
 * Translate contract type to Vietnamese
 */
export const translateContractType = (type: string, t: (key: string) => string): string => {
  const translationKey = `contracts.types.${type}`
  const translated = t(translationKey)
  
  // If translation not found, return original type
  if (translated === translationKey) {
    return type
  }
  
  return translated
}

/**
 * Translate contract status to Vietnamese
 */
export const translateContractStatus = (status: string, t: (key: string) => string): string => {
  const translationKey = `contracts.statuses.${status}`
  const translated = t(translationKey)
  
  // If translation not found, return original status
  if (translated === translationKey) {
    return status
  }
  
  return translated
}

/**
 * Translate contract tag to Vietnamese
 */
export const translateContractTag = (tag: string, t: (key: string) => string): string => {
  // Remove # prefix if present
  const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag
  
  const translationKey = `contracts.tags.${cleanTag}`
  const translated = t(translationKey)
  
  // If translation not found, return original tag
  if (translated === translationKey) {
    return tag
  }
  
  return translated
}

/**
 * Translate multiple tags at once
 */
export const translateContractTags = (tags: string[], t: (key: string) => string): string[] => {
  return tags.map(tag => translateContractTag(tag, t))
}

/**
 * Get all available contract types for dropdown/select
 */
export const getContractTypes = (t: (key: string) => string) => {
  return [
    { value: 'ALL', label: t('contracts.types.all') },
    { value: 'SERVICE_AGREEMENT', label: t('contracts.types.SERVICE_AGREEMENT') },
    { value: 'PURCHASE_AGREEMENT', label: t('contracts.types.PURCHASE_AGREEMENT') },
    { value: 'PARTNERSHIP_AGREEMENT', label: t('contracts.types.PARTNERSHIP_AGREEMENT') },
    { value: 'EMPLOYMENT_CONTRACT', label: t('contracts.types.EMPLOYMENT_CONTRACT') },
    { value: 'CONFIDENTIALITY_AGREEMENT', label: t('contracts.types.CONFIDENTIALITY_AGREEMENT') },
    { value: 'LEASE_AGREEMENT', label: t('contracts.types.LEASE_AGREEMENT') },
    { value: 'OTHER', label: t('contracts.types.OTHER') }
  ]
}

/**
 * Get all available contract statuses for dropdown/select
 */
export const getContractStatuses = (t: (key: string) => string) => {
  return [
    { value: 'ALL', label: t('common.all') },
    { value: 'DRAFT', label: t('contracts.statuses.DRAFT') },
    { value: 'PENDING_REVIEW', label: t('contracts.statuses.PENDING_REVIEW') },
    { value: 'APPROVED', label: t('contracts.statuses.APPROVED') },
    { value: 'ACTIVE', label: t('contracts.statuses.ACTIVE') },
    { value: 'EXPIRED', label: t('contracts.statuses.EXPIRED') },
    { value: 'TERMINATED', label: t('contracts.statuses.TERMINATED') },
    { value: 'ARCHIVED', label: t('contracts.statuses.ARCHIVED') }
  ]
}
