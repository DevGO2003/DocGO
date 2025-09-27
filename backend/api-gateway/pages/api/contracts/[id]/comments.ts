import { NextApiRequest, NextApiResponse } from 'next'
import { contractService } from '../../../../lib/services/contractService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../../lib/utils/errorHandler'

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
      path: req.url || '/api/contracts/[id]/comments'
    })
  }

  try {
    const { id } = req.query
    const token = req.headers['x-user-token'] as string

    if (!id || typeof id !== 'string') {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Contract ID is required',
        requestId,
        '/api/contracts/[id]/comments'
      )
    }

    // Validate request body
    const { content, author } = req.body

    if (!content || !author) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Content and author are required',
        requestId,
        `/api/contracts/${id}/comments`
      )
    }

    // Create comment request
    const commentRequest = {
      content,
      author
    }

    // Call contract service
    const result = await contractService.addComment(id, commentRequest, token)

    return res.status(201).json(result)

  } catch (error: any) {
    console.error('[Contract Comments] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
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
