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
      { source: '/dashboard/hop-dong', destination: '/dashboard/contracts', permanent: false },
      { source: '/dashboard/tao-hop-dong', destination: '/dashboard/create-contract', permanent: false },
      { source: '/dashboard/chu-ky-dien-tu', destination: '/dashboard/e-signature', permanent: false },
      { source: '/dashboard/binh-luan-cong-tac', destination: '/dashboard/collaboration-comments', permanent: false },
      { source: '/dashboard/phien-ban-hop-dong', destination: '/dashboard/contract-versions', permanent: false },
      { source: '/dashboard/luong-phe-duyet', destination: '/dashboard/approval-workflow', permanent: false },
      { source: '/dashboard/quyen-sua-theo-vai-tro', destination: '/dashboard/role-based-permissions', permanent: false },
      { source: '/dashboard/da-duyet', destination: '/dashboard/approved', permanent: false },
      { source: '/dashboard/thong-ke', destination: '/dashboard/analytics', permanent: false },
      { source: '/dashboard/bao-cao', destination: '/dashboard/reports', permanent: false },
      { source: '/dashboard/quan-ly-nguoi-dung', destination: '/dashboard/user-management', permanent: false },
      { source: '/dashboard/phe-duyet-tai-khoan', destination: '/dashboard/account-approval', permanent: false },
      { source: '/dashboard/thong-bao', destination: '/dashboard/notifications', permanent: false },
      { source: '/dashboard/lich', destination: '/dashboard/calendar', permanent: false },
      { source: '/dashboard/lich-su-hoat-dong', destination: '/dashboard/activity-history', permanent: false },
      { source: '/dashboard/tro-giup-ho-tro', destination: '/dashboard/help-support', permanent: false },
      { source: '/dashboard/cai-dat', destination: '/dashboard/settings', permanent: false },
      { source: '/dashboard/huong-dan', destination: '/dashboard/guide', permanent: false },
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
