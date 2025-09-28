import { NextApiRequest, NextApiResponse } from 'next'
import { fileService } from '../../../lib/services/fileService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../lib/utils/errorHandler'

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
      path: req.url || '/api/files'
    })
  }

  try {
    const token = req.headers['x-user-token'] as string

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
    const result = await fileService.getFiles(params, token)

    return res.status(200).json(result)

  } catch (error: any) {
    console.error('[Files List] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}