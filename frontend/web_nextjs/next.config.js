/** @type {import('next').NextConfig} */
// const { i18n } = require('./next-i18next.config')

const nextConfig = {
  // i18n, // Disabled to prevent 404 with /en/ prefix
  // Hot reload optimization for Docker
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  async redirects() {
    return [
      // Redirects từ cấu trúc cũ sang cấu trúc mới
      { source: '/dashboard/analytics', destination: '/analytics', permanent: false },
      { source: '/dashboard/user-management', destination: '/admin/users', permanent: false },
      { source: '/dashboard/role-based-permissions', destination: '/admin/permissions', permanent: false },
      { source: '/dashboard/approval-workflow', destination: '/workflow/approval', permanent: false },
      { source: '/dashboard/e-signature', destination: '/workflow/signature', permanent: false },
      { source: '/dashboard/collaboration-comments', destination: '/workflow/collaboration', permanent: false },
      { source: '/dashboard/notifications', destination: '/workflow/notifications', permanent: false },
      { source: '/dashboard/backup-restore', destination: '/tools/backup', permanent: false },
      { source: '/ai-processing', destination: '/tools/ai-processing', permanent: false },
      
      // Redirects từ tiếng Việt (giữ nguyên)
      { source: '/dashboard/hop-dong', destination: '/contracts', permanent: false },
      { source: '/dashboard/tao-hop-dong', destination: '/contracts/create', permanent: false },
      { source: '/dashboard/tao-nhanh', destination: '/dashboard/quick-create', permanent: false },
      { source: '/dashboard/chu-ky-dien-tu', destination: '/workflow/signature', permanent: false },
      { source: '/dashboard/binh-luan-cong-tac', destination: '/workflow/collaboration', permanent: false },
      { source: '/dashboard/phien-ban-hop-dong', destination: '/contracts/versions', permanent: false },
      { source: '/dashboard/luong-phe-duyet', destination: '/workflow/approval', permanent: false },
      { source: '/dashboard/quyen-sua-theo-vai-tro', destination: '/admin/permissions', permanent: false },
      { source: '/dashboard/da-duyet', destination: '/dashboard/approved', permanent: false },
      { source: '/dashboard/thong-ke', destination: '/analytics', permanent: false },
      { source: '/dashboard/bao-cao', destination: '/analytics/reports', permanent: false },
      { source: '/dashboard/quan-ly-nguoi-dung', destination: '/admin/users', permanent: false },
      { source: '/dashboard/phe-duyet-tai-khoan', destination: '/admin/users/approval', permanent: false },
      { source: '/dashboard/thong-bao', destination: '/workflow/notifications', permanent: false },
      { source: '/dashboard/lich', destination: '/workflow/calendar', permanent: false },
      { source: '/dashboard/lich-su-hoat-dong', destination: '/admin/audit', permanent: false },
      { source: '/dashboard/tro-giup-ho-tro', destination: '/dashboard/help-support', permanent: false },
      { source: '/dashboard/cai-dat', destination: '/settings', permanent: false },
      { source: '/dashboard/huong-dan', destination: '/dashboard/guide', permanent: false },
      { source: '/dashboard/tai-len', destination: '/dashboard/quick-create', permanent: false },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
