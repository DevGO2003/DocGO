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
      // Get specific service metrics
      const metrics = await healthMonitoringService.getServiceMetrics(service);
      
      return res.status(200).json({
        apiVersion: 'v1',
        statusCode: 200,
        shortMessage: 'Success',
        description: `Metrics for ${service}`,
        data: metrics,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: `/api/health/metrics?service=${service}`
      });
    } else {
      // Get system metrics
      const systemMetrics = await healthMonitoringService.getSystemMetrics();
      
      return res.status(200).json({
        apiVersion: 'v1',
        statusCode: 200,
        shortMessage: 'Success',
        description: 'System metrics overview',
        data: systemMetrics,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: '/api/health/metrics'
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      apiVersion: 'v1',
      statusCode: 500,
      shortMessage: 'Internal Server Error',
      description: `Metrics retrieval failed: ${error.message}`,
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: '/api/health/metrics'
    });
  }
}
