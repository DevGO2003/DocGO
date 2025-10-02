import { NextApiRequest, NextApiResponse } from 'next'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../lib/utils/errorHandler'
import { config as appConfig } from '../../../lib/config'

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
      path: req.url || '/api/ai/ocr'
    })
  }

  try {
    const token = req.headers['x-user-token'] as string

    // Get file from request
    const file = req.body.file || (req as any).file

    if (!file) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'File is required',
        requestId,
        '/api/ai/ocr'
      )
    }

    // Get optional Gemini API key
    const geminiApiKey = req.headers['gemini-api-key'] as string

    // Create OCR request
    const ocrRequest = {
      file,
      geminiApiKey,
      action: 'ocr' // Add action parameter to indicate OCR
    }

    // Call automation service directly
    const automationServiceUrl = appConfig.automationServiceUrl
    const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/document/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-token': token || '',
        'gemini-api-key': geminiApiKey || ''
      },
      body: JSON.stringify(ocrRequest)
    })

    if (!response.ok) {
      throw new Error(`Automation service error: ${response.statusText}`)
    }

    const result = await response.json()

    return res.status(200).json(result)

  } catch (error: any) {
    console.error('[AI OCR] Error:', error)
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
