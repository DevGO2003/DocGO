import { NextApiRequest, NextApiResponse } from 'next';
import serviceManager from '@/lib/services';
import logger from '@/lib/logger';
import { withApiHandler } from '@/lib/http/withApiHandler';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { path } = req.query;
    const fullPath = Array.isArray(path) ? path.join('/') : path || '';
    const method = req.method || 'GET';

  logger.info(`🔄 Proxy request: ${method} /${fullPath}`);

  // Service mapping based on path prefixes
  const servicePrefixMap: Record<string, string> = {
    'auth': 'user-management',
    'oauth2': 'user-management',
    'users': 'user-management',
    'documents': 'document-management',
    'contracts': 'document-management',
    'automation': 'automation',
    'ai': 'automation'
  };

  // Determine service key from path
  let serviceKey = '';
  let endpoint = '';

  const pathParts = fullPath.split('/');
  const firstPart = pathParts[0];

  if (servicePrefixMap[firstPart]) {
    serviceKey = servicePrefixMap[firstPart];
    endpoint = `/${pathParts.slice(1).join('/')}`;
  } else {
    // Default to user-management for unknown paths
      serviceKey = 'user-management';
    endpoint = `/${fullPath}`;
    }

    // Get service instance
    const service = serviceManager.getService(serviceKey);
    if (!service) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: `Service ${serviceKey} is not available`
      });
    }

  // Build target URL
  const targetUrl = `${service.defaults.baseURL}${endpoint}`;
  logger.info(`🎯 Target URL: ${targetUrl}`);

  try {
    // Prepare headers
    const headers: Record<string, string> = {
      'User-Agent': 'API-Gateway/1.0.0',
      'Content-Type': req.headers['content-type'] || 'application/json'
    };

    // Forward correlation headers
    if (req.headers['x-correlation-id']) {
      headers['X-Correlation-Id'] = req.headers['x-correlation-id'] as string;
    }
    if (req.headers['x-actor']) {
      headers['X-Actor'] = req.headers['x-actor'] as string;
    }

    // Make request to microservice
    const response = await service.request({
      method: method as any,
      url: endpoint,
      data: req.body,
      headers,
      params: req.query,
      validateStatus: () => true // Don't throw on non-2xx status codes
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    logger.info(`✅ Proxy response: ${response.status} (${Date.now() - Date.now()}ms)`);
      return res.status(response.status).json(response.data);

  } catch (error: any) {
    logger.error('❌ Proxy error:', error);
    
    // Set CORS headers for error response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    return res.status(503).json({
      error: 'Service unavailable',
      message: `Service ${serviceKey} is not available`
    });
  }
}

export default withApiHandler(handler);