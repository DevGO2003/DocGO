import { NextApiRequest, NextApiResponse } from 'next';
import { loadBalancer } from '@/lib/loadBalancer';
import { enhancedServiceManager } from '@/lib/enhancedServiceManager';
import logger from '@/lib/logger';

/**
 * @swagger
 * /api/loadbalancer/stats:
 *   get:
 *     summary: Lấy thống kê load balancer
 *     description: |
 *       ## ⚖️ Load Balancer Statistics
 *       
 *       Lấy thông tin chi tiết về trạng thái và hiệu suất của load balancer.
 *       
 *       ### 🔹 Đầu ra
 *       📊 **LoadBalancerStats**
 *       Loại: object
 *       Mô tả: Thống kê chi tiết về load balancer system
 *       
 *       ### 📋 Response Codes
 *       - **200 OK**: Thống kê được lấy thành công
 *       - **500 Internal Server Error**: Lỗi khi lấy thống kê
 *       
 *     tags: [Load Balancer Management]
 *     responses:
 *       200:
 *         description: Thống kê load balancer thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: object
 *                   description: Thống kê từng service
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       totalInstances:
 *                         type: number
 *                         description: Tổng số instances
 *                       healthyInstances:
 *                         type: number
 *                         description: Số instances healthy
 *                       unhealthyInstances:
 *                         type: number
 *                         description: Số instances unhealthy
 *                       averageResponseTime:
 *                         type: number
 *                         description: Thời gian phản hồi trung bình (ms)
 *                       instances:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: ID của instance
 *                             url:
 *                               type: string
 *                               description: URL của instance
 *                             healthy:
 *                               type: boolean
 *                               description: Trạng thái healthy
 *                             responseTime:
 *                               type: number
 *                               description: Thời gian phản hồi (ms)
 *                             lastCheck:
 *                               type: number
 *                               description: Lần check cuối (timestamp)
 *       500:
 *         description: Lỗi khi lấy thống kê load balancer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    logger.info('⚖️ Fetching load balancer statistics');
    
    const lbStats = loadBalancer.getStats();
    const healthStatus = await enhancedServiceManager.checkAllServicesHealth();
    
    // Kết hợp thống kê load balancer với health status
    const combinedStats = {
      loadBalancer: lbStats,
      healthStatus,
      timestamp: new Date().toISOString()
    };
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(200).json({
      apiVersion: 'v1',
      statusCode: 200,
      shortMessage: 'Success',
      description: 'Load balancer statistics retrieved successfully',
      data: combinedStats,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      path: '/api/loadbalancer/stats'
    });

  } catch (error: any) {
    logger.error('❌ Error fetching load balancer stats:', error);
    
    return res.status(500).json({
      apiVersion: 'v1',
      statusCode: 500,
      shortMessage: 'Internal Server Error',
      description: 'Failed to fetch load balancer statistics',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      path: '/api/loadbalancer/stats'
    });
  }
}






