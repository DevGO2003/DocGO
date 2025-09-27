import { NextApiRequest, NextApiResponse } from 'next';
import healthMonitoringService from '../../../lib/services/healthMonitoringService';
import { generateRequestId } from '../../../lib/utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
