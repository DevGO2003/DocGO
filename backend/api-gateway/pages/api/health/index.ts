import { NextApiRequest, NextApiResponse } from 'next';
<<<<<<< HEAD

export default function handler(req: NextApiRequest, res: NextApiResponse) {
=======
import healthMonitoringService from '../../../lib/services/healthMonitoringService';
import { generateRequestId } from '../../../lib/utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

<<<<<<< HEAD
  return res.status(200).json({
    apiVersion: 'v1',
    statusCode: 200,
    shortMessage: 'Success',
    description: 'Service đang hoạt động bình thường',
    data: {
      status: 'healthy',
      service: 'API Gateway BFF',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString(),
    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    path: '/health'
  });
}
=======
  try {
    const { service } = req.query;

    if (service && typeof service === 'string') {
      // Check specific service health
      const healthStatus = await healthMonitoringService.checkServiceHealth(service);
      
      return res.status(200).json({
        apiVersion: 'v1',
        statusCode: 200,
        shortMessage: 'Success',
        description: `Health status for ${service}`,
        data: healthStatus,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: `/api/health?service=${service}`
      });
    } else {
      // Check all services health
      const systemHealth = await healthMonitoringService.checkAllServicesHealth();
      
      return res.status(200).json({
        apiVersion: 'v1',
        statusCode: 200,
        shortMessage: 'Success',
        description: 'System health overview',
        data: systemHealth,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: '/api/health'
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      apiVersion: 'v1',
      statusCode: 500,
      shortMessage: 'Internal Server Error',
      description: `Health check failed: ${error.message}`,
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: '/api/health'
    });
  }
}
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e
