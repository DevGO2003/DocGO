import { NextApiRequest, NextApiResponse } from 'next'
import { serviceClients } from '../../lib/utils/apiClient'
import { createErrorResponse, generateRequestId } from '../../lib/utils/errorHandler'

interface ServiceHealth {
  name: string
  status: 'healthy' | 'unhealthy' | 'unknown'
  responseTime?: number
  lastCheck: string
  error?: string
}

interface HealthResponse {
  apiVersion: string
  statusCode: number
  shortMessage: string
  description: string
  data: {
    overall: 'healthy' | 'degraded' | 'unhealthy'
    services: ServiceHealth[]
    timestamp: string
    uptime: number
  }
  timestamp: string
  requestId: string
  path: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(200).json({
      apiVersion: 'v1',
      statusCode: 405,
      shortMessage: 'Method Not Allowed',
      description: 'Only GET method is allowed',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: req.url || '/api/health'
    })
  }

  try {
    const startTime = Date.now()
    const services: ServiceHealth[] = []

    // Check each service health
    const serviceChecks = await Promise.allSettled([
      checkServiceHealth('auth', serviceClients.auth),
      checkServiceHealth('contract', serviceClients.contract),
      checkServiceHealth('ai', serviceClients.ai),
      checkServiceHealth('file', serviceClients.file)
    ])

    // Process results
    serviceChecks.forEach((result, index) => {
      const serviceNames = ['auth', 'contract', 'ai', 'file']
      const serviceName = serviceNames[index]

      if (result.status === 'fulfilled') {
        services.push(result.value)
      } else {
        services.push({
          name: serviceName,
          status: 'unhealthy',
          lastCheck: new Date().toISOString(),
          error: result.reason?.message || 'Unknown error'
        })
      }
    })

    // Determine overall health
    const healthyServices = services.filter(s => s.status === 'healthy').length
    const totalServices = services.length
    const overall = healthyServices === totalServices ? 'healthy' : 
                   healthyServices > 0 ? 'degraded' : 'unhealthy'

    const response: HealthResponse = {
      apiVersion: 'v1',
      statusCode: overall === 'healthy' ? 200 : overall === 'degraded' ? 200 : 503,
      shortMessage: overall === 'healthy' ? 'Healthy' : 
                   overall === 'degraded' ? 'Degraded' : 'Unhealthy',
      description: `API Gateway health check completed. ${healthyServices}/${totalServices} services healthy.`,
      data: {
        overall,
        services,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      },
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: req.url || '/api/health'
    }

    return res.status(200).json(response)

  } catch (error: any) {
    console.error('[Health Check] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}

async function checkServiceHealth(name: string, client: any): Promise<ServiceHealth> {
  const startTime = Date.now()
  
  try {
    const isHealthy = await client.healthCheck()
    const responseTime = Date.now() - startTime

    return {
      name,
      status: isHealthy ? 'healthy' : 'unhealthy',
      responseTime,
      lastCheck: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      name,
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: error.message || 'Health check failed'
    }
  }
}