/**
 * Test script để verify translation functions hoạt động đúng
 * Chạy: node test-translations.js
 */

// Mock i18n function
const mockT = (key) => {
  const translations = {
    'contracts.types.SERVICE_AGREEMENT': 'Hợp đồng dịch vụ',
    'contracts.types.LEASE_AGREEMENT': 'Hợp đồng thuê',
    'contracts.types.PURCHASE_AGREEMENT': 'Hợp đồng mua bán',
    'contracts.statuses.ACTIVE': 'Đang hiệu lực',
    'contracts.statuses.PENDING_REVIEW': 'Chờ duyệt',
    'contracts.tags.Real Estate': 'Bất động sản',
    'contracts.tags.Office Rental': 'Thuê văn phòng',
    'contracts.tags.IT': 'Công nghệ thông tin',
    'contracts.tags.Logistics': 'Hậu cần',
    'contracts.tags.Transportation': 'Vận tải',
    'contracts.tags.Delivery': 'Giao hàng'
  }
  return translations[key] || key
}

// Import translation functions
const { 
  translateContractType, 
  translateContractStatus, 
  translateContractTag,
  getContractTypes,
  getContractStatuses 
} = require('./src/utils/tagTranslations.ts')

console.log('🧪 Testing Translation Functions...\n')

// Test contract type translation
console.log('📋 Contract Types:')
const testTypes = ['SERVICE_AGREEMENT', 'LEASE_AGREEMENT', 'PURCHASE_AGREEMENT']
testTypes.forEach(type => {
  const translated = translateContractType(type, mockT)
  console.log(`  ${type} → ${translated}`)
})

console.log('\n📊 Contract Statuses:')
const testStatuses = ['ACTIVE', 'PENDING_REVIEW', 'EXPIRED']
testStatuses.forEach(status => {
  const translated = translateContractStatus(status, mockT)
  console.log(`  ${status} → ${translated}`)
})

console.log('\n🏷️ Contract Tags:')
const testTags = ['Real Estate', 'Office Rental', 'IT', 'Logistics', 'Transportation', 'Delivery']
testTags.forEach(tag => {
  const translated = translateContractTag(tag, mockT)
  console.log(`  ${tag} → ${translated}`)
})

console.log('\n📝 Contract Types Options:')
const typeOptions = getContractTypes(mockT)
typeOptions.forEach(option => {
  console.log(`  ${option.value} → ${option.label}`)
})

console.log('\n📈 Contract Statuses Options:')
const statusOptions = getContractStatuses(mockT)
statusOptions.forEach(option => {
  console.log(`  ${option.value} → ${option.label}`)
})

console.log('\n✅ Translation test completed!')

