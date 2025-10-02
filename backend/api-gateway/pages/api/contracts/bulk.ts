import { NextApiRequest, NextApiResponse } from 'next'
import { contractService } from '../../../lib/services/contractService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../lib/utils/errorHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method
  const token = req.headers['x-user-token'] as string

  try {
    switch (method) {
      case 'DELETE':
        return await handleBulkDeleteContracts(req, res, token)
      default:
        return res.status(405).json({
          apiVersion: 'v1',
          statusCode: 405,
          shortMessage: 'Method Not Allowed',
          description: `Method ${method} not allowed for this endpoint`,
          data: null,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: req.url
        })
    }
  } catch (error: any) {
    console.error('Error in contracts/bulk handler:', error)
    return res.status(500).json(createErrorResponse(error, req as any))
  }
}

async function handleBulkDeleteContracts(req: NextApiRequest, res: NextApiResponse, token?: string) {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      const requestId = generateRequestId()
      return res.status(200).json(createErrorResponse(
        new ValidationError('Contract IDs array is required and cannot be empty', requestId, '/api/contracts/bulk'),
        req as any
      ))
    }

    if (ids.length > 100) {
      const requestId = generateRequestId()
      return res.status(200).json(createErrorResponse(
        new ValidationError('Cannot delete more than 100 contracts at once', requestId, '/api/contracts/bulk'),
        req as any
      ))
    }

    const result = await contractService.bulkDeleteContracts(ids, token)
    
    return res.status(200).json(result)
  } catch (error: any) {
    console.error('Error in handleBulkDeleteContracts:', error)
    return res.status(500).json(createErrorResponse(error, req as any))
  }
}
