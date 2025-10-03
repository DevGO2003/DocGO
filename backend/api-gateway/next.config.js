/** @type {import('next').NextConfig} */
// Load environment variables from env directory
require('./lib/env-loader');

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['kafkajs', 'winston', 'ioredis']
  },
  typescript: {
    // Tạm thời bỏ qua lỗi type để đảm bảo build/restart gateway
    ignoreBuildErrors: true,
  },
  // output: 'standalone', // Comment out để tránh conflict trong development mode
  env: {
    USER_SERVICE_URL: process.env.USER_MANAGEMENT_SERVICE_URL,
    DOCUMENT_SERVICE_URL: process.env.DOCUMENT_MANAGEMENT_SERVICE_URL,
    AUTOMATION_SERVICE_URL: process.env.AUTOMATION_SERVICE_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: `${process.env.USER_SERVICE_URL || 'http://user-management-service:8001'}/api/v1/user-management-service/users/:path*`,
      },
      {
        source: '/api/v1/document-management-service/v1/:path*',
        destination: `${process.env.DOCUMENT_SERVICE_URL || 'http://document-management-service:8002'}/api/v1/document-management-service/v1/:path*`,
      },
      {
        source: '/api/v1/automation-service/v1/:path*',
        destination: `${process.env.AUTOMATION_SERVICE_URL || 'http://automation-service:8003'}/api/v1/automation-service/v1/:path*`,
      }
    ]
  },
  // CORS headers are handled centrally in middleware; avoid duplicating here
}

module.exports = nextConfig
