import { NextApiRequest, NextApiResponse } from 'next'
import { contractService } from '../../../lib/services/contractService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../lib/utils/errorHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method
  const token = req.headers['x-user-token'] as string

  try {
    switch (method) {
      case 'GET':
        return await handleGetContracts(req, res, token)
      case 'POST':
        return await handleCreateContract(req, res, token)
      default:
        return res.status(200).json({
          apiVersion: 'v1',
          statusCode: 405,
          shortMessage: 'Method Not Allowed',
          description: `Method ${method} not allowed`,
          data: null,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: req.url || '/api/contracts'
        })
    }
  } catch (error: any) {
    console.error('[Contracts API] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}

async function handleGetContracts(req: NextApiRequest, res: NextApiResponse, token?: string) {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy,
      sortDirection
    } = req.query

    const params = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
      status: status as string,
      sortBy: sortBy as string,
      sortDirection: sortDirection as 'asc' | 'desc'
    }

    // Call contract service
    const result = await contractService.getContracts(params, token)

    return res.status(200).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch contracts')
  }
}

async function handleCreateContract(req: NextApiRequest, res: NextApiResponse, token?: string) {
  try {
    // Validate request body
    const contractData = req.body

    if (!contractData || !contractData.title || !contractData.content) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Title and content are required',
        requestId,
        '/api/contracts'
      )
    }

    // Call contract service
    const result = await contractService.createContract(contractData, token)

    return res.status(201).json(result)

  } catch (error: any) {
    throw new Error(error.message || 'Failed to create contract')
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
