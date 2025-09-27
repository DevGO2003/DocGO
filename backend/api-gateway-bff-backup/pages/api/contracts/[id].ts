import { NextApiRequest, NextApiResponse } from 'next'
import { contractService } from '../../../lib/services/contractService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../lib/utils/errorHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method
  const { id } = req.query
  const token = req.headers['x-user-token'] as string

  if (!id || typeof id !== 'string') {
    const requestId = generateRequestId()
    return res.status(200).json(createErrorResponse(
      new ValidationError('Contract ID is required', requestId, '/api/contracts/[id]'),
      req as any
    ))
  }

  try {
    switch (method) {
      case 'GET':
        return await handleGetContract(req, res, id, token)
      case 'PUT':
        return await handleUpdateContract(req, res, id, token)
      case 'DELETE':
        return await handleDeleteContract(req, res, id, token)
      default:
        return res.status(405).json({
          apiVersion: 'v1',
          statusCode: 405,
          shortMessage: 'Method Not Allowed',
          description: `Method ${method} not allowed`,
          data: null,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: req.url || `/api/contracts/${id}`
        })
    }
  } catch (error: any) {
    console.error('[Contract API] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}

async function handleGetContract(req: NextApiRequest, res: NextApiResponse, id: string, token?: string) {
  try {
    // Call contract service
    const result = await contractService.getContract(id, token)

    return res.status(200).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch contract')
  }
}

async function handleUpdateContract(req: NextApiRequest, res: NextApiResponse, id: string, token?: string) {
  try {
    // Validate request body
    const contractData = req.body

    if (!contractData) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Contract data is required',
        requestId,
        `/api/contracts/${id}`
      )
    }

    // Call contract service
    const result = await contractService.updateContract(id, contractData, token)

    return res.status(200).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to update contract')
  }
}

async function handleDeleteContract(req: NextApiRequest, res: NextApiResponse, id: string, token?: string) {
  try {
    // Call contract service
    const result = await contractService.deleteContract(id, token)

    return res.status(200).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete contract')
  }
}

// Disable body parsing for this route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
