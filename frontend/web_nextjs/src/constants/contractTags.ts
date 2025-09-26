/**
 * Contract Tags Constants
 * Đồng bộ với ContractCategory enum từ backend contract-management-service
 * Tạo từ enum ContractCategory để đảm bảo consistency
 */

// Lấy tất cả categories từ ContractCategory enum và chuyển thành tags
export const CONTRACT_TAGS = [
  // COMMERCIAL CATEGORIES
  'COMMERCIAL_SALES_DIRECT',
  'COMMERCIAL_SALES_PARTNER', 
  'COMMERCIAL_SALES_RESELLER',
  'COMMERCIAL_SALES_DISTRIBUTION',
  'COMMERCIAL_SALES_FRANCHISE',
  'COMMERCIAL_MARKETING_ADVERTISING',
  'COMMERCIAL_MARKETING_PROMOTIONAL',
  'COMMERCIAL_MARKETING_SPONSORSHIP',
  'COMMERCIAL_MARKETING_EVENT',
  'COMMERCIAL_MARKETING_DIGITAL',
  'COMMERCIAL_PROCUREMENT_PURCHASE',
  'COMMERCIAL_PROCUREMENT_SUPPLY',
  'COMMERCIAL_PROCUREMENT_VENDOR',
  'COMMERCIAL_PROCUREMENT_SERVICES',
  'COMMERCIAL_PROCUREMENT_EQUIPMENT',
  'COMMERCIAL_SERVICES_CONSULTING',
  'COMMERCIAL_SERVICES_MAINTENANCE',
  'COMMERCIAL_SERVICES_SUPPORT',
  'COMMERCIAL_SERVICES_TRAINING',
  'COMMERCIAL_SERVICES_OUTSOURCING',
  
  // LEGAL CATEGORIES
  'LEGAL_COMPLIANCE_GDPR',
  'LEGAL_COMPLIANCE_SOX',
  'LEGAL_COMPLIANCE_HIPAA',
  'LEGAL_COMPLIANCE_PCI_DSS',
  'LEGAL_COMPLIANCE_ISO27001',
  'LEGAL_COMPLIANCE_SOC2',
  'LEGAL_COMPLIANCE_FERPA',
  'LEGAL_COMPLIANCE_CCPA',
  'LEGAL_COMPLIANCE_PIPEDA',
  'LEGAL_COMPLIANCE_LGPD',
  'LEGAL_IP_PATENT',
  'LEGAL_IP_TRADEMARK',
  'LEGAL_IP_COPYRIGHT',
  'LEGAL_IP_TRADE_SECRET',
  'LEGAL_IP_LICENSING',
  'LEGAL_IP_ASSIGNMENT',
  
  // HUMAN RESOURCES CATEGORIES
  'HR_EMPLOYMENT_CONTRACT',
  'HR_EMPLOYMENT_CONSULTANT',
  'HR_EMPLOYMENT_INTERN',
  'HR_EMPLOYMENT_FREELANCER',
  'HR_BENEFITS_HEALTH',
  'HR_BENEFITS_RETIREMENT',
  'HR_BENEFITS_STOCK',
  'HR_BENEFITS_SEVERANCE',
  
  // REAL ESTATE CATEGORIES
  'RE_LEASING_OFFICE',
  'RE_LEASING_WAREHOUSE',
  'RE_LEASING_RETAIL',
  'RE_LEASING_RESIDENTIAL',
  'RE_LEASING_LAND',
  'RE_PURCHASE_PROPERTY',
  'RE_PURCHASE_LAND',
  'RE_PURCHASE_RESIDENTIAL',
  
  // LEGACY TAGS (giữ lại để backward compatibility)
  'ưu_tiên',
  'gấp',
  'gia_hạn',
  'cao_giá',
  'đối_tác_mới',
  'rủi_ro'
];

// Type cho contract tags
export type ContractTag = typeof CONTRACT_TAGS[number];

// Mapping từ tag key sang display name tiếng Việt
export const TAG_DISPLAY_NAMES: Record<string, string> = {
  // COMMERCIAL
  'COMMERCIAL_SALES_DIRECT': 'Bán hàng trực tiếp',
  'COMMERCIAL_SALES_PARTNER': 'Bán hàng đối tác',
  'COMMERCIAL_SALES_RESELLER': 'Hợp đồng đại lý',
  'COMMERCIAL_SALES_DISTRIBUTION': 'Hợp đồng phân phối',
  'COMMERCIAL_SALES_FRANCHISE': 'Hợp đồng nhượng quyền',
  'COMMERCIAL_MARKETING_ADVERTISING': 'Quảng cáo',
  'COMMERCIAL_MARKETING_PROMOTIONAL': 'Khuyến mại',
  'COMMERCIAL_MARKETING_SPONSORSHIP': 'Tài trợ',
  'COMMERCIAL_MARKETING_EVENT': 'Marketing sự kiện',
  'COMMERCIAL_MARKETING_DIGITAL': 'Marketing số',
  'COMMERCIAL_PROCUREMENT_PURCHASE': 'Đơn hàng mua',
  'COMMERCIAL_PROCUREMENT_SUPPLY': 'Hợp đồng cung ứng',
  'COMMERCIAL_PROCUREMENT_VENDOR': 'Hợp đồng nhà cung cấp',
  'COMMERCIAL_PROCUREMENT_SERVICES': 'Dịch vụ mua sắm',
  'COMMERCIAL_PROCUREMENT_EQUIPMENT': 'Thiết bị',
  'COMMERCIAL_SERVICES_CONSULTING': 'Tư vấn',
  'COMMERCIAL_SERVICES_MAINTENANCE': 'Bảo trì',
  'COMMERCIAL_SERVICES_SUPPORT': 'Hỗ trợ',
  'COMMERCIAL_SERVICES_TRAINING': 'Đào tạo',
  'COMMERCIAL_SERVICES_OUTSOURCING': 'Thuê ngoài',
  
  // LEGAL
  'LEGAL_COMPLIANCE_GDPR': 'Tuân thủ GDPR',
  'LEGAL_COMPLIANCE_SOX': 'Tuân thủ SOX',
  'LEGAL_COMPLIANCE_HIPAA': 'Tuân thủ HIPAA',
  'LEGAL_COMPLIANCE_PCI_DSS': 'Tuân thủ PCI DSS',
  'LEGAL_COMPLIANCE_ISO27001': 'Tuân thủ ISO 27001',
  'LEGAL_COMPLIANCE_SOC2': 'Tuân thủ SOC 2',
  'LEGAL_COMPLIANCE_FERPA': 'Tuân thủ FERPA',
  'LEGAL_COMPLIANCE_CCPA': 'Tuân thủ CCPA',
  'LEGAL_COMPLIANCE_PIPEDA': 'Tuân thủ PIPEDA',
  'LEGAL_COMPLIANCE_LGPD': 'Tuân thủ LGPD',
  'LEGAL_IP_PATENT': 'Bằng sáng chế',
  'LEGAL_IP_TRADEMARK': 'Thương hiệu',
  'LEGAL_IP_COPYRIGHT': 'Bản quyền',
  'LEGAL_IP_TRADE_SECRET': 'Bí mật thương mại',
  'LEGAL_IP_LICENSING': 'Cấp phép',
  'LEGAL_IP_ASSIGNMENT': 'Chuyển nhượng',
  
  // HUMAN RESOURCES
  'HR_EMPLOYMENT_CONTRACT': 'Hợp đồng lao động',
  'HR_EMPLOYMENT_CONSULTANT': 'Hợp đồng tư vấn',
  'HR_EMPLOYMENT_INTERN': 'Hợp đồng thực tập',
  'HR_EMPLOYMENT_FREELANCER': 'Hợp đồng freelancer',
  'HR_BENEFITS_HEALTH': 'Bảo hiểm y tế',
  'HR_BENEFITS_RETIREMENT': 'Kế hoạch hưu trí',
  'HR_BENEFITS_STOCK': 'Quyền chọn cổ phiếu',
  'HR_BENEFITS_SEVERANCE': 'Thỏa thuận nghỉ việc',
  
  // REAL ESTATE
  'RE_LEASING_OFFICE': 'Thuê văn phòng',
  'RE_LEASING_WAREHOUSE': 'Thuê kho bãi',
  'RE_LEASING_RETAIL': 'Thuê cửa hàng',
  'RE_LEASING_RESIDENTIAL': 'Thuê nhà ở',
  'RE_LEASING_LAND': 'Thuê đất',
  'RE_PURCHASE_PROPERTY': 'Mua bất động sản',
  'RE_PURCHASE_LAND': 'Mua đất',
  'RE_PURCHASE_RESIDENTIAL': 'Mua nhà ở',
  
  // LEGACY TAGS
  'ưu_tiên': 'Ưu tiên',
  'gấp': 'Gấp',
  'gia_hạn': 'Gia hạn',
  'cao_giá': 'Cao giá',
  'đối_tác_mới': 'Đối tác mới',
  'rủi_ro': 'Rủi ro'
};

// Helper function để lấy display name
export const getTagDisplayName = (tag: string): string => {
  return TAG_DISPLAY_NAMES[tag] || tag;
};

// Helper function để lọc tags theo category
export const getTagsByCategory = (category: 'COMMERCIAL' | 'LEGAL' | 'HR' | 'RE' | 'LEGACY'): string[] => {
  switch (category) {
    case 'COMMERCIAL':
      return [...CONTRACT_TAGS.filter(tag => tag.startsWith('COMMERCIAL_'))];
    case 'LEGAL':
      return [...CONTRACT_TAGS.filter(tag => tag.startsWith('LEGAL_'))];
    case 'HR':
      return [...CONTRACT_TAGS.filter(tag => tag.startsWith('HR_'))];
    case 'RE':
      return [...CONTRACT_TAGS.filter(tag => tag.startsWith('RE_'))];
    case 'LEGACY':
      return [...CONTRACT_TAGS.filter(tag => !tag.includes('_'))];
    default:
      return [...CONTRACT_TAGS];
  }
};

// Helper function để search tags
export const searchTags = (keyword: string): string[] => {
  const lowerKeyword = keyword.toLowerCase();
  return [...CONTRACT_TAGS.filter(tag => 
    tag.toLowerCase().includes(lowerKeyword) ||
    getTagDisplayName(tag).toLowerCase().includes(lowerKeyword)
  )];
};
