import { NextApiRequest, NextApiResponse } from 'next'
import { fileService } from '../../../lib/services/fileService'
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
      path: req.url || '/api/files/upload'
    })
  }

  try {
    const token = req.headers['x-user-token'] as string

    // Get file from request (assuming it's already processed by multer or similar)
    const file = req.body.file || (req as any).file

    if (!file) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'File is required',
        requestId,
        '/api/files/upload'
      )
    }

    // Get optional metadata and tags
    const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : undefined
    const tags = req.body.tags ? JSON.parse(req.body.tags) : undefined

    // Create upload request
    const uploadRequest = {
      file,
      metadata,
      tags
    }

    // Call file service
    const result = await fileService.uploadFile(uploadRequest, token)

    return res.status(201).json(result)

  } catch (error: any) {
    console.error('[File Upload] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}

// Disable body parsing for this route to handle file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}
