import { NextApiRequest, NextApiResponse } from 'next';
import serviceManager from '@/lib/services';
import logger from '@/lib/logger';
import { withApiHandler } from '@/lib/http/withApiHandler';

export const config = {
  api: {
    bodyParser: false
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { path } = req.query;
    const fullPath = Array.isArray(path) ? path.join('/') : path || '';
    const method = req.method || 'GET';

  logger.info(`🔄 Proxy request: ${method} /${fullPath}`);

  // Determine service key and keep original endpoint
  const parts = fullPath.split('/').filter(Boolean);

  // Map of tokens to service keys
  const tokenToService: Record<string, string> = {
    // user
    'auth': 'user-management',
    'oauth2': 'user-management',
    'users': 'user-management',
    'user-management': 'user-management',
    'user-management-service': 'user-management',
    // document
    'documents': 'document-management',
    'contracts': 'document-management',
    'files': 'document-management',
    'assets': 'document-management',
    'document-management': 'document-management',
    'document-management-service': 'document-management',
    // automation
    'automation': 'automation',
    'ai': 'automation',
    'automation-service': 'automation'
  };

  // Prefer second segment when prefixed with v1
  const primaryToken = parts[0] === 'v1' && parts.length > 1 ? parts[1] : parts[0] || '';

  let serviceKey = tokenToService[primaryToken] || '';
  if (!serviceKey) {
    // Fallback: scan all segments for a known token
    for (const seg of parts) {
      if (tokenToService[seg]) {
        serviceKey = tokenToService[seg];
        break;
      }
    }
  }
  if (!serviceKey) {
    // Default to user-management if still unknown
    serviceKey = 'user-management';
  }

  // Keep original endpoint including /api/v1/...
  const endpoint = `/${fullPath}`;

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
      'Content-Type': (req.headers['content-type'] as string) || 'application/json'
    };

    // Forward critical headers
    if (req.headers['authorization']) {
      headers['Authorization'] = req.headers['authorization'] as string;
    }
    if (req.headers['content-length']) {
      headers['Content-Length'] = req.headers['content-length'] as string;
    }

    // Forward correlation headers
    if (req.headers['x-correlation-id']) {
      headers['X-Correlation-Id'] = req.headers['x-correlation-id'] as string;
    }
    if (req.headers['x-actor']) {
      headers['X-Actor'] = req.headers['x-actor'] as string;
    }

    // Sanitize query params: remove internal "path" and trim string values
    const rawQuery = { ...req.query } as Record<string, any>;
    delete (rawQuery as any).path;

    const sanitizedParams: Record<string, any> = {};
    Object.keys(rawQuery).forEach((key) => {
      const value = rawQuery[key];
      if (Array.isArray(value)) {
        const cleaned = value
          .map((v) => (typeof v === 'string' ? v.trim() : v))
          .filter((v) => v !== '' && v !== undefined && v !== null);
        if (cleaned.length > 0) sanitizedParams[key] = cleaned;
      } else if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== '') sanitizedParams[key] = trimmed;
      } else if (value !== undefined && value !== null) {
        sanitizedParams[key] = value;
      }
    });

    // Decide how to forward body (multipart vs json)
    const isMultipart = (headers['Content-Type'] || '').includes('multipart/form-data');

    // Make request to microservice
    const response = await service.request({
      method: method as any,
      url: endpoint,
      data: isMultipart ? (req as any) : req.body,
      headers,
      params: sanitizedParams,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      validateStatus: () => true // Don't throw on non-2xx status codes
    });

    // CORS headers are handled centrally in middleware

    logger.info(`✅ Proxy response: ${response.status}`);
      return res.status(response.status).json(response.data);

  } catch (error: any) {
    logger.error('❌ Proxy error:', error);
    
    // CORS headers are handled centrally in middleware
    
    return res.status(503).json({
      error: 'Service unavailable',
      message: `Service ${serviceKey} is not available`
    });
  }
}

export default withApiHandler(handler);