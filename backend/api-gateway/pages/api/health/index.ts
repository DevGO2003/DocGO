import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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