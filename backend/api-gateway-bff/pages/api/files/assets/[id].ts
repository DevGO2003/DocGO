import { NextApiRequest, NextApiResponse } from 'next'
import { fileService } from '../../../../lib/services/fileService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../../lib/utils/errorHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method
  const { id } = req.query
  const token = req.headers['x-user-token'] as string

  if (!id || typeof id !== 'string') {
    const requestId = generateRequestId()
    return res.status(200).json(createErrorResponse(
      new ValidationError('Asset ID is required', requestId, '/api/files/assets/[id]'),
      req as any
    ))
  }

  try {
    switch (method) {
      case 'GET':
        return await handleGetAsset(req, res, id, token)
      case 'PUT':
        return await handleUpdateAsset(req, res, id, token)
      case 'DELETE':
        return await handleDeleteAsset(req, res, id, token)
      default:
        return res.status(405).json({
          apiVersion: 'v1',
          statusCode: 405,
          shortMessage: 'Method Not Allowed',
          description: `Method ${method} not allowed`,
          data: null,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: req.url || `/api/files/assets/${id}`
        })
    }
  } catch (error: any) {
    console.error('[Asset API] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}

async function handleGetAsset(req: NextApiRequest, res: NextApiResponse, id: string, token?: string) {
  try {
    // Call file service
    const result = await fileService.getAsset(id, token)

    return res.status(200).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch asset')
  }
}

async function handleUpdateAsset(req: NextApiRequest, res: NextApiResponse, id: string, token?: string) {
  try {
    // Validate request body
    const updates = req.body

    if (!updates) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Update data is required',
        requestId,
        `/api/files/assets/${id}`
      )
    }

    // Call file service
    const result = await fileService.updateAsset(id, updates, token)

    return res.status(200).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to update asset')
  }
}

async function handleDeleteAsset(req: NextApiRequest, res: NextApiResponse, id: string, token?: string) {
  try {
    // Call file service
    const result = await fileService.deleteAsset(id, token)

    return res.status(200).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete asset')
  }
}

// Disable body parsing for this route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
