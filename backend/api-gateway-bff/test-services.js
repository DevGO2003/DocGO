#!/usr/bin/env node

/**
 * Test script để kiểm tra tất cả các service đã được cấu hình trong API Gateway
 * Chạy: node test-services.js
 */

const axios = require('axios');

const services = [
  {
    name: 'Authentication Service',
    url: 'http://localhost:8001',
    healthCheck: '/actuator/health',
    port: 8001
  },
  {
    name: 'User Management Service',
    url: 'http://localhost:8002',
    healthCheck: '/health',
    port: 8002
  },
  {
    name: 'Contract Management Service',
    url: 'http://localhost:8003',
    healthCheck: '/actuator/health',
    port: 8003
  },
  {
    name: 'AI Processing Service',
    url: 'http://localhost:8017',
    healthCheck: '/health',
    port: 8017
  },
  {
    name: 'File Storage Service',
    url: 'http://localhost:8012',
    healthCheck: '/health',
    port: 8012
  }
];

async function testService(service) {
  try {
    console.log(`🔍 Testing ${service.name} (${service.url})...`);
    
    // Test health check
    const healthResponse = await axios.get(`${service.url}${service.healthCheck}`, {
      timeout: 5000
    });
    
    if (healthResponse.status === 200) {
      console.log(`✅ ${service.name} - HEALTHY (${healthResponse.status})`);
      return true;
    } else {
      console.log(`⚠️  ${service.name} - UNEXPECTED STATUS (${healthResponse.status})`);
      return false;
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`❌ ${service.name} - CONNECTION REFUSED (Port ${service.port} not accessible)`);
    } else if (error.code === 'ENOTFOUND') {
      console.log(`❌ ${service.name} - HOST NOT FOUND`);
    } else if (error.response) {
      console.log(`⚠️  ${service.name} - HTTP ERROR (${error.response.status})`);
    } else {
      console.log(`❌ ${service.name} - ERROR: ${error.message}`);
    }
    return false;
  }
}

async function testAPIGateway() {
  try {
    console.log('🔍 Testing API Gateway BFF...');
    
    const response = await axios.get('http://localhost:8000/api/health', {
      timeout: 5000
    });
    
    if (response.status === 200) {
      console.log('✅ API Gateway BFF - HEALTHY');
      console.log('📊 Services Status:', response.data.services);
      return true;
    } else {
      console.log(`⚠️  API Gateway BFF - UNEXPECTED STATUS (${response.status})`);
      return false;
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ API Gateway BFF - CONNECTION REFUSED (Port 8000 not accessible)');
    } else {
      console.log(`❌ API Gateway BFF - ERROR: ${error.message}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Service Health Tests...\n');
  
  // Test individual services
  const serviceResults = [];
  for (const service of services) {
    const result = await testService(service);
    serviceResults.push({ ...service, healthy: result });
    console.log(''); // Empty line for readability
  }
  
  // Test API Gateway
  console.log('🔍 Testing API Gateway Integration...\n');
  const gatewayResult = await testAPIGateway();
  
  // Summary
  console.log('📊 TEST SUMMARY');
  console.log('================');
  
  const healthyServices = serviceResults.filter(s => s.healthy).length;
  const totalServices = services.length;
  
  console.log(`Services: ${healthyServices}/${totalServices} healthy`);
  console.log(`API Gateway: ${gatewayResult ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
  
  if (healthyServices === totalServices && gatewayResult) {
    console.log('\n🎉 All services are healthy and API Gateway is working!');
  } else {
    console.log('\n⚠️  Some services are not healthy. Check the logs above.');
  }
}

// Run tests
runTests().catch(console.error);
