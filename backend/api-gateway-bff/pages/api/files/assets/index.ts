import { NextApiRequest, NextApiResponse } from 'next'
import { fileService } from '../../../../lib/services/fileService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../../lib/utils/errorHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method
  const token = req.headers['x-user-token'] as string

  try {
    switch (method) {
      case 'GET':
        return await handleGetAssets(req, res, token)
      case 'POST':
        return await handleCreateAsset(req, res, token)
      default:
        return res.status(405).json({
          apiVersion: 'v1',
          statusCode: 405,
          shortMessage: 'Method Not Allowed',
          description: `Method ${method} not allowed`,
          data: null,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: req.url || '/api/files/assets'
        })
    }
  } catch (error: any) {
    console.error('[Assets API] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}

async function handleGetAssets(req: NextApiRequest, res: NextApiResponse, token?: string) {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      search,
      mimeType,
      tags,
      sortBy,
      sortDirection
    } = req.query

    const params = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
      mimeType: mimeType as string,
      tags: tags ? (tags as string).split(',') : undefined,
      sortBy: sortBy as string,
      sortDirection: sortDirection as 'asc' | 'desc'
    }

    // Call file service
    const result = await fileService.getAssets(params, token)

    return res.status(200).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch assets')
  }
}

async function handleCreateAsset(req: NextApiRequest, res: NextApiResponse, token?: string) {
  try {
    // Validate request body
    const { name, description, type, fileId, metadata, tags } = req.body

    if (!name || !type || !fileId) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Name, type, and fileId are required',
        requestId,
        '/api/files/assets'
      )
    }

    // Create asset request
    const assetRequest = {
      name,
      description,
      type,
      fileId,
      metadata,
      tags
    }

    // Call file service
    const result = await fileService.createAsset(assetRequest, token)

    return res.status(201).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to create asset')
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
