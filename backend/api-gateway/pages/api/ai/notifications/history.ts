import { NextApiRequest, NextApiResponse } from 'next'
import { aiService } from '../../../../lib/services/aiService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../../lib/utils/errorHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      apiVersion: 'v1',
      statusCode: 405,
      shortMessage: 'Method Not Allowed',
      description: 'Only GET method is allowed',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: req.url || '/api/ai/notifications/history'
    })
  }

  try {
    const token = req.headers['x-user-token'] as string

    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      notification_type,
      status,
      start_date,
      end_date
    } = req.query

    // Call AI service
    const result = await aiService.getNotificationHistory(
      parseInt(page as string),
      parseInt(limit as string),
      notification_type as string,
      status as string,
      start_date as string,
      end_date as string,
      token
    )

    return res.status(200).json(result)

  } catch (error: any) {
    console.error('[AI Notifications History] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}
