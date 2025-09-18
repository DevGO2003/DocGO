#!/usr/bin/env node

/**
 * Test Proxy Debug - Debug API Gateway proxy connections
 * Chạy: node test-proxy-debug.js
 */

const axios = require('axios');

// Test configuration
const SERVICES = [
  {
    name: 'ai-processing',
    url: 'http://localhost:8000/api/docs/ai-processing',
    expectedStatus: 200
  },
  {
    name: 'authentication', 
    url: 'http://localhost:8000/api/docs/authentication',
    expectedStatus: 200
  },
  {
    name: 'contract-management',
    url: 'http://localhost:8000/api/docs/contract-management', 
    expectedStatus: 200
  },
  {
    name: 'file-storage',
    url: 'http://localhost:8000/api/docs/file-storage',
    expectedStatus: 200
  }
];

// Direct service URLs for comparison
const DIRECT_SERVICES = [
  {
    name: 'ai-processing-direct',
    url: 'http://localhost:8003/openapi.json',
    expectedStatus: 200
  },
  {
    name: 'authentication-direct',
    url: 'http://localhost:8001/v3/api-docs',
    expectedStatus: 200
  },
  {
    name: 'contract-management-direct',
    url: 'http://localhost:8002/v3/api-docs',
    expectedStatus: 200
  },
  {
    name: 'file-storage-direct',
    url: 'http://localhost:8004/openapi.json',
    expectedStatus: 200
  }
];

async function testService(service) {
  console.log(`\n🔍 Testing ${service.name}...`);
  console.log(`   URL: ${service.url}`);
  
  try {
    const startTime = Date.now();
    const response = await axios.get(service.url, {
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Proxy-Debug-Test/1.0.0'
      }
    });
    const endTime = Date.now();
    
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   ⏱️  Time: ${endTime - startTime}ms`);
    console.log(`   📏 Content-Length: ${response.headers['content-length'] || 'unknown'}`);
    console.log(`   📄 Content-Type: ${response.headers['content-type'] || 'unknown'}`);
    
    // Check if response contains OpenAPI spec
    if (response.data) {
      if (typeof response.data === 'string') {
        console.log(`   📝 Response: ${response.data.substring(0, 200)}...`);
      } else if (response.data.openapi || response.data.swagger) {
        console.log(`   🎯 OpenAPI Spec Found: ${response.data.openapi || response.data.swagger}`);
        console.log(`   📊 Paths: ${Object.keys(response.data.paths || {}).length}`);
      } else {
        console.log(`   📝 Response: ${JSON.stringify(response.data).substring(0, 200)}...`);
      }
    }
    
    return {
      success: true,
      status: response.status,
      time: endTime - startTime,
      data: response.data
    };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   📊 Status: ${error.response.status}`);
      console.log(`   📝 Response: ${JSON.stringify(error.response.data).substring(0, 200)}...`);
    }
    if (error.code) {
      console.log(`   🔧 Error Code: ${error.code}`);
    }
    
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      code: error.code
    };
  }
}

async function testDockerNetwork() {
  console.log(`\n🐳 Testing Docker Network Connectivity...`);
  
  // Test internal Docker network URLs
  const internalUrls = [
    'http://docgo-local-ai-processing-service:8000/openapi.json',
    'http://docgo-local-authentication-identity-service:8000/v3/api-docs',
    'http://docgo-local-contract-management-service:8000/v3/api-docs',
    'http://docgo-local-file-storage-service:8000/openapi.json'
  ];
  
  for (const url of internalUrls) {
    try {
      console.log(`   🔗 Testing: ${url}`);
      const response = await axios.get(url, { timeout: 5000 });
      console.log(`   ✅ Status: ${response.status}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

async function runTests() {
  console.log(`🚀 Starting Proxy Debug Tests...`);
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  
  // Test direct service access
  console.log(`\n📡 Testing Direct Service Access...`);
  for (const service of DIRECT_SERVICES) {
    await testService(service);
  }
  
  // Test proxy access
  console.log(`\n🔄 Testing Proxy Access...`);
  for (const service of SERVICES) {
    await testService(service);
  }
  
  // Test Docker network
  await testDockerNetwork();
  
  console.log(`\n✅ Tests completed!`);
}

// Run tests
runTests().catch(console.error);
