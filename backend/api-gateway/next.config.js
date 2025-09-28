/** @type {import('next').NextConfig} */
// Load environment variables from env directory
require('./lib/env-loader');

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['kafkajs', 'winston', 'ioredis']
  },
  // output: 'standalone', // Comment out để tránh conflict trong development mode
  env: {
    USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://user-management-service:8000',
    DOCUMENT_SERVICE_URL: process.env.DOCUMENT_SERVICE_URL || 'http://document-management-service:8000',
    AUTOMATION_SERVICE_URL: process.env.AUTOMATION_SERVICE_URL || 'http://automation-service:8000',
  },
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: `${process.env.USER_SERVICE_URL || 'http://user-management-service:8000'}/api/v1/user-management-service/users/:path*`,
      },
      {
        source: '/api/documents/:path*',
        destination: `${process.env.DOCUMENT_SERVICE_URL || 'http://document-management-service:8000'}/api/v1/document-management-service/documents/:path*`,
      },
      {
        source: '/api/automation/:path*',
        destination: `${process.env.AUTOMATION_SERVICE_URL || 'http://automation-service:8000'}/api/v1/automation-service/:path*`,
      },
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
