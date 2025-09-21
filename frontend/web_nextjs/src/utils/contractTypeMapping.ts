// ContractType mapping: Vietnamese displayName -> English enum value
export const CONTRACT_TYPE_MAPPING: { [key: string]: string } = {
  'Hợp đồng dịch vụ': 'SERVICE_AGREEMENT',
  'Hợp đồng tư vấn': 'CONSULTING_AGREEMENT',
  'Hợp đồng bảo trì': 'MAINTENANCE_AGREEMENT',
  'Hợp đồng hỗ trợ': 'SUPPORT_AGREEMENT',
  'Hợp đồng đào tạo': 'TRAINING_AGREEMENT',
  'Hợp đồng mua bán': 'PURCHASE_AGREEMENT',
  'Hợp đồng cung ứng': 'SUPPLY_AGREEMENT',
  'Hợp đồng mua sắm': 'PROCUREMENT_AGREEMENT',
  'Hợp đồng thuê': 'LEASE_AGREEMENT',
  'Hợp đồng cho thuê': 'RENTAL_AGREEMENT',
  'Hợp đồng thuê thiết bị': 'EQUIPMENT_LEASE',
  'Hợp đồng lao động': 'EMPLOYMENT_CONTRACT',
  'Hợp đồng tư vấn viên': 'CONSULTANT_CONTRACT',
  'Hợp đồng freelancer': 'FREELANCER_CONTRACT',
  'Hợp đồng thực tập': 'INTERN_AGREEMENT',
  'Hợp đồng bảo mật': 'CONFIDENTIALITY_AGREEMENT',
  'Hợp đồng đối tác': 'PARTNERSHIP_AGREEMENT',
  'Hợp đồng phân phối': 'DISTRIBUTION_AGREEMENT',
  'Hợp đồng cấp phép': 'LICENSING_AGREEMENT',
  'Hợp đồng vay': 'LOAN_AGREEMENT',
  'Hợp đồng bảo hiểm': 'INSURANCE_AGREEMENT',
  'Hợp đồng SaaS': 'SAAS_AGREEMENT',
  'Hợp đồng đám mây': 'CLOUD_AGREEMENT',
  'Hợp đồng hosting': 'HOSTING_AGREEMENT',
  'Hợp đồng phát triển': 'DEVELOPMENT_AGREEMENT',
  'Hợp đồng quảng cáo': 'ADVERTISING_AGREEMENT',
  'Hợp đồng marketing': 'MARKETING_AGREEMENT',
  'Hợp đồng tài trợ': 'SPONSORSHIP_AGREEMENT',
  'Hợp đồng thuê bất động sản': 'PROPERTY_LEASE',
  'Hợp đồng mua bất động sản': 'PROPERTY_PURCHASE',
  'Hợp đồng xây dựng': 'CONSTRUCTION_AGREEMENT',
  'Thỏa thuận dàn xếp': 'SETTLEMENT_AGREEMENT',
  'Thỏa thuận trọng tài': 'ARBITRATION_AGREEMENT',
  'Thỏa thuận hòa giải': 'MEDIATION_AGREEMENT',
  'Phụ lục hợp đồng': 'AMENDMENT_AGREEMENT',
  'Thỏa thuận chấm dứt': 'TERMINATION_AGREEMENT',
  'Thỏa thuận gia hạn': 'RENEWAL_AGREEMENT',
  'Thỏa thuận chuyển nhượng': 'ASSIGNMENT_AGREEMENT',
  'Khác': 'OTHER',
  'Chung': 'GENERAL',
  'Thỏa thuận bảo mật': 'NDA'
}

// Reverse mapping: English enum value -> Vietnamese displayName
export const CONTRACT_TYPE_DISPLAY: { [key: string]: string } = Object.fromEntries(
  Object.entries(CONTRACT_TYPE_MAPPING).map(([vi, en]) => [en, vi])
)

/**
 * Map Vietnamese displayName to English enum value
 */
export function mapContractTypeToEnum(displayName: string): string {
  return CONTRACT_TYPE_MAPPING[displayName] || displayName
}

/**
 * Map English enum value to Vietnamese displayName
 */
export function mapContractTypeToDisplay(enumValue: string): string {
  return CONTRACT_TYPE_DISPLAY[enumValue] || enumValue
}

/**
 * Get all available contract types for UI
 */
export function getAvailableContractTypes(): Array<{ value: string; label: string }> {
  return Object.entries(CONTRACT_TYPE_MAPPING).map(([vi, en]) => ({
    value: vi,
    label: vi
  }))
}
