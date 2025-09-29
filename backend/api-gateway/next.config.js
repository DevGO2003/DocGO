/** @type {import('next').NextConfig} */
// Load environment variables from env directory
require('./lib/env-loader');

const nextConfig = {
  experimental: {
<<<<<<< HEAD
    serverComponentsExternalPackages: ['kafkajs', 'winston', 'ioredis']
  },
  // output: 'standalone', // Comment out để tránh conflict trong development mode
  env: {
    USER_SERVICE_URL: process.env.USER_MANAGEMENT_SERVICE_URL,
    DOCUMENT_SERVICE_URL: process.env.DOCUMENT_MANAGEMENT_SERVICE_URL,
    AUTOMATION_SERVICE_URL: process.env.AUTOMATION_SERVICE_URL,
=======
    serverComponentsExternalPackages: ['kafkajs', 'winston']
  },
  // output: 'standalone', // Comment out để tránh conflict trong development mode
  env: {
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://authentication-identity-service:8000',
    CONTRACT_SERVICE_URL: process.env.CONTRACT_SERVICE_URL || 'http://contract-management-service:8000',
    AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://ai-processing-service:8000',
    FILE_SERVICE_URL: process.env.FILE_SERVICE_URL || 'http://file-storage-service:8000',
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e
  },
  async rewrites() {
    return [
      {
<<<<<<< HEAD
        source: '/api/users/:path*',
        destination: `${process.env.USER_SERVICE_URL || 'http://user-management-service:8001'}/api/v1/user-management-service/users/:path*`,
      },
      {
        source: '/api/documents/:path*',
        destination: `${process.env.DOCUMENT_SERVICE_URL || 'http://document-management-service:8002'}/api/v1/document-management-service/documents/:path*`,
      },
      {
        source: '/api/automation/:path*',
        destination: `${process.env.AUTOMATION_SERVICE_URL || 'http://automation-service:8003'}/api/v1/automation-service/:path*`,
=======
        source: '/api/auth/:path*',
        destination: `${process.env.AUTH_SERVICE_URL || 'http://authentication-identity-service:8000'}/api/v1/authentication-identity-service/auth/:path*`,
      },
      {
        source: '/oauth2/:path*',
        destination: `${process.env.AUTH_SERVICE_URL || 'http://authentication-identity-service:8000'}/oauth2/:path*`,
      },
      {
        source: '/login/oauth2/:path*',
        destination: `${process.env.AUTH_SERVICE_URL || 'http://authentication-identity-service:8000'}/login/oauth2/:path*`,
      },
      {
        source: '/api/contracts/:path*',
        destination: `${process.env.CONTRACT_SERVICE_URL || 'http://contract-management-service:8000'}/api/v1/contract-management-service/contracts/:path*`,
      },
      {
        source: '/api/ai/:path*',
        destination: `${process.env.AI_SERVICE_URL || 'http://ai-processing-service:8000'}/api/v1/ai-processing-service/:path*`,
      },
      {
        source: '/api/files/:path*',
        destination: `${process.env.FILE_SERVICE_URL || 'http://file-storage-service:8000'}/api/v1/file-storage-asset-service/:path*`,
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e
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
