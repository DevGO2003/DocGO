import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosInstance } from 'axios';
import logger from '@/lib/logger';
import { withApiHandler } from '@/lib/http/withApiHandler';
import { config } from '@/lib/config';

// Simple service configuration without Redis using centralized config
const services: Record<string, { url: string; timeout: number }> = {
  'user-management': {
    url: config.services['user-management'].url,
    timeout: config.services['user-management'].timeout
  },
  'document-management': {
    url: config.services['document-management'].url,
    timeout: config.services['document-management'].timeout
  },
  'automation': {
    url: config.services['automation'].url,
    timeout: config.services['automation'].timeout
  }
};

/**
 * @swagger
 * /api/v2/simple/{service-name}/{path}:
 *   get:
 *     summary: Simple Enhanced Proxy GET request
 *     description: |
 *       ## 🔄 Simple Enhanced Proxy GET Request
 *       
 *       Định tuyến GET request đến microservice với Load Balancing đơn giản.
 *       
 *       ### 🔹 Đầu vào
 *       🛣️ **service-name** (bắt buộc, path)
 *       Loại: string
 *       Mô tả: Tên của microservice (user-management, document-management, automation)
 *       
 *       🛣️ **path** (bắt buộc, path)
 *       Loại: string
 *       Mô tả: Đường dẫn cụ thể trong microservice
 *       
 *       ### 🔹 Đầu ra
 *       📊 **RestResponse<T>**
 *       
 *     tags: [Simple Enhanced API Gateway]
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const fullPath = Array.isArray(path) ? path.join('/') : path || '';
  const method = req.method || 'GET';

  logger.info(`🔄 Simple enhanced proxy request: ${method} /${fullPath}`);

  // Parse service name và endpoint
  const pathParts = fullPath.split('/');
  const serviceName = pathParts[0];
  const endpoint = pathParts.slice(1).join('/');

  if (!serviceName || !endpoint) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    return res.status(400).json({
      apiVersion: 'v1',
      statusCode: 400,
      shortMessage: 'Bad Request',
      description: 'Invalid path format. Expected: /api/v2/simple/{service-name}/{endpoint}',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      path: `/api/v2/simple/${fullPath}`
    });
  }

  // Lấy service config
  const serviceConfig = services[serviceName];
  if (!serviceConfig) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    return res.status(404).json({
      apiVersion: 'v1',
      statusCode: 404,
      shortMessage: 'Service Not Found',
      description: `Service '${serviceName}' not found. Available services: ${Object.keys(services).join(', ')}`,
      data: null,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      path: `/api/v2/simple/${fullPath}`
    });
  }

  // Tạo axios instance
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: serviceConfig.url,
    timeout: serviceConfig.timeout,
    headers: {
      'User-Agent': 'API-Gateway-Simple/1.0.0'
    }
  });

  // Parse query parameters
  const queryParams = { ...req.query } as Record<string, any>;
  delete (queryParams as any).path;

  // Parse request body
  let parsedBody: any = req.body;
  if (typeof parsedBody === 'string') {
    try {
      parsedBody = JSON.parse(parsedBody);
    } catch {
      // keep string
    }
  }

  // Forward headers
  const fwdHeaders: Record<string, string> = {};
  const headersToForward = ['authorization', 'x-correlation-id', 'x-actor', 'content-type'];
  headersToForward.forEach(header => {
    const value = req.headers[header];
    if (typeof value === 'string') fwdHeaders[header] = value;
  });

  // Compose endpoint
  let fullEndpoint: string;
  if (serviceName === 'automation') {
    fullEndpoint = `/${endpoint}`;
  } else {
    fullEndpoint = `/api/v1/${serviceName}-service/${endpoint}`;
  }

  const startTime = Date.now();

  let response;
  switch (method.toUpperCase()) {
    case 'GET':
      response = await axiosInstance.get(fullEndpoint, { params: queryParams, headers: fwdHeaders });
      break;
    case 'POST':
      response = await axiosInstance.post(fullEndpoint, parsedBody, { params: queryParams, headers: { 'Content-Type': req.headers['content-type'] as string, ...fwdHeaders } });
      break;
    case 'PUT':
      response = await axiosInstance.put(fullEndpoint, parsedBody, { params: queryParams, headers: { 'Content-Type': req.headers['content-type'] as string, ...fwdHeaders } });
      break;
    case 'DELETE':
      response = await axiosInstance.delete(fullEndpoint, { params: queryParams, headers: fwdHeaders });
      break;
    case 'OPTIONS':
      res.status(200);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Max-Age', '86400');
      return res.end();
    default:
      return res.status(405).json({
        apiVersion: 'v1',
        statusCode: 405,
        shortMessage: 'Method Not Allowed',
        description: `HTTP method ${method} is not supported`,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        path: `/api/v2/simple/${fullPath}`
      });
  }

  const duration = Date.now() - startTime;
  logger.info(`✅ Simple proxy ${method} ${fullPath} - ${response.status} (${duration}ms)`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  return res.status(response.status).json(response.data);
}

export default withApiHandler(handler);
