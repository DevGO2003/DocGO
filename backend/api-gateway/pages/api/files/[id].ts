import { NextApiRequest, NextApiResponse } from 'next'
import { fileService } from '../../../lib/services/fileService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../lib/utils/errorHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method
  const { id } = req.query
  const token = req.headers['x-user-token'] as string

  if (!id || typeof id !== 'string') {
    const requestId = generateRequestId()
    return res.status(200).json(createErrorResponse(
      new ValidationError('File ID is required', requestId, '/api/files/[id]'),
      req as any
    ))
  }

  try {
    switch (method) {
      case 'GET':
        return await handleGetFile(req, res, id, token)
      case 'DELETE':
        return await handleDeleteFile(req, res, id, token)
      default:
        return res.status(405).json({
          apiVersion: 'v1',
          statusCode: 405,
          shortMessage: 'Method Not Allowed',
          description: `Method ${method} not allowed`,
          data: null,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: req.url || `/api/files/${id}`
        })
    }
  } catch (error: any) {
    console.error('[File API] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}

async function handleGetFile(req: NextApiRequest, res: NextApiResponse, id: string, token?: string) {
  try {
    // Call file service
    const result = await fileService.getFile(id, token)

    return res.status(200).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch file')
  }
}

async function handleDeleteFile(req: NextApiRequest, res: NextApiResponse, id: string, token?: string) {
  try {
    // Call file service
    const result = await fileService.deleteFile(id, token)

    return res.status(200).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete file')
  }
}
