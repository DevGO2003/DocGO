import { NextApiRequest, NextApiResponse } from 'next';
import serviceManager from '@/lib/services';

// Proxy OpenAPI docs từ các microservice về một endpoint thống nhất
// Spring Boot (SpringDoc): /v3/api-docs
// FastAPI: /openapi.json

const SPRING_SERVICES = new Set<string>([
  'authentication',
  'contract-management', // Đã có SpringDoc OpenAPI
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { service } = req.query;

  if (!service) {
    return res.status(400).json({ error: 'service param is required' });
  }

  const serviceKey = Array.isArray(service) ? service[0] : service;
  
  console.log(`[DEBUG] 🔍 Proxy request for service: ${serviceKey}`);
  console.log(`[DEBUG] 📍 Request URL: ${req.url}`);
  console.log(`[DEBUG] 📋 Headers:`, JSON.stringify(req.headers, null, 2));

  try {
    const axiosInstance = serviceManager.getService(serviceKey);
    if (!axiosInstance) {
      console.log(`[DEBUG] ❌ Service ${serviceKey} not found in serviceManager`);
      return res.status(404).json({ error: `Service ${serviceKey} not found` });
    }

    const path = SPRING_SERVICES.has(serviceKey) ? '/v3/api-docs' : '/openapi.json';
    const targetUrl = `${axiosInstance.defaults.baseURL}${path}`;
    
    console.log(`[DEBUG] 🎯 Target URL: ${targetUrl}`);
    console.log(`[DEBUG] 📂 Path: ${path}`);
    console.log(`[DEBUG] 🔧 Service Type: ${SPRING_SERVICES.has(serviceKey) ? 'Spring Boot' : 'FastAPI'}`);
    
    const startTime = Date.now();
    const response = await axiosInstance.get(path, { 
      headers: { 
        Accept: 'application/json',
        'User-Agent': 'API-Gateway-BFF/1.0.0'
      },
      timeout: 30000
    });
    const endTime = Date.now();
    
    console.log(`[DEBUG] ✅ Response received in ${endTime - startTime}ms`);
    console.log(`[DEBUG] 📊 Status: ${response.status}`);
    console.log(`[DEBUG] 📏 Content-Length: ${response.headers['content-length'] || 'unknown'}`);
    console.log(`[DEBUG] 📄 Content-Type: ${response.headers['content-type'] || 'unknown'}`);
    
    const spec = response.data;
    
    // Debug spec content
    if (spec) {
      console.log(`[DEBUG] 📝 Spec type: ${typeof spec}`);
      if (typeof spec === 'object') {
        console.log(`[DEBUG] 🎯 OpenAPI version: ${spec.openapi || spec.swagger || 'unknown'}`);
        console.log(`[DEBUG] 📊 Paths count: ${Object.keys(spec.paths || {}).length}`);
        console.log(`[DEBUG] 🏷️  Tags count: ${spec.tags?.length || 0}`);
        console.log(`[DEBUG] 📋 Available paths:`, Object.keys(spec.paths || {}).slice(0, 5));
      } else {
        console.log(`[DEBUG] 📝 Spec content preview: ${String(spec).substring(0, 200)}...`);
      }
    } else {
      console.log(`[DEBUG] ⚠️  Spec is null or undefined`);
    }
    
    // Rewrite servers của spec về Gateway để Try it out đi qua 8000
    const gwUrl = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host || 'localhost:8000'}`;
    if (spec && typeof spec === 'object') {
      spec.servers = [{ url: gwUrl }];
      console.log(`[DEBUG] 🔄 Rewritten servers to: ${gwUrl}`);
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(`[DEBUG] ✅ Returning spec successfully`);
    return res.status(200).json(spec);
    
  } catch (error: any) {
    console.log(`[DEBUG] ❌ Error occurred:`, error.message);
    console.log(`[DEBUG] 🔧 Error code:`, error.code);
    console.log(`[DEBUG] 📊 Response status:`, error.response?.status);
    console.log(`[DEBUG] 📝 Response data:`, error.response?.data);
    console.log(`[DEBUG] 🔗 Request URL:`, error.config?.url);
    console.log(`[DEBUG] ⏱️  Timeout:`, error.config?.timeout);
    
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: 'Failed to fetch OpenAPI spec' };
    
    console.log(`[DEBUG] 📤 Returning error response:`, { status, message });
    return res.status(status).json(message);
  }
}


