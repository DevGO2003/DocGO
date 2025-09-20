// Test script for Tags API
const axios = require('axios');

const BASE_URL = 'http://localhost:8003'; // contract-management-service port

async function testTagsAPI() {
  console.log('🧪 Testing Tags API...\n');

  try {
    // Test 1: Get popular tags
    console.log('1️⃣ Testing GET /api/v1/contract-management-service/tags/popular');
    const popularResponse = await axios.get(`${BASE_URL}/api/v1/contract-management-service/tags/popular`);
    console.log('✅ Status:', popularResponse.status);
    console.log('📊 Response:', JSON.stringify(popularResponse.data, null, 2));
    console.log('');

    // Test 2: Get all tags
    console.log('2️⃣ Testing GET /api/v1/contract-management-service/tags/all');
    const allResponse = await axios.get(`${BASE_URL}/api/v1/contract-management-service/tags/all`);
    console.log('✅ Status:', allResponse.status);
    console.log('📊 Response:', JSON.stringify(allResponse.data, null, 2));
    console.log('');

    // Test 3: Search tags
    console.log('3️⃣ Testing GET /api/v1/contract-management-service/tags/search?searchTerm=ưu');
    const searchResponse = await axios.get(`${BASE_URL}/api/v1/contract-management-service/tags/search`, {
      params: { searchTerm: 'ưu' }
    });
    console.log('✅ Status:', searchResponse.status);
    console.log('📊 Response:', JSON.stringify(searchResponse.data, null, 2));
    console.log('');

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📊 Error response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the test
testTagsAPI();
