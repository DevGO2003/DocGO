import { NextApiRequest, NextApiResponse } from 'next'
import { aiService } from '../../../lib/services/aiService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../lib/utils/errorHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      apiVersion: 'v1',
      statusCode: 405,
      shortMessage: 'Method Not Allowed',
      description: 'Only POST method is allowed',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: req.url || '/api/ai/summarize'
    })
  }

  try {
    const token = req.headers['x-user-token'] as string

    // Get file or text from request
    const file = req.body.file || (req as any).file
    const text = req.body.text

    if (!file && !text) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Either file or text is required',
        requestId,
        '/api/ai/summarize'
      )
    }

    // Get optional Gemini API key
    const geminiApiKey = req.headers['gemini-api-key'] as string

    // Create summarize request
    const summarizeRequest = {
      file,
      text,
      geminiApiKey
    }

    // Call AI service
    const result = await aiService.summarize(summarizeRequest, token)

    return res.status(200).json(result)

  } catch (error: any) {
    console.error('[AI Summarize] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}

// Disable body parsing for this route to handle file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}