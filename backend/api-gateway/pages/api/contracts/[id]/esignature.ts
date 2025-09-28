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
      path: req.url || '/api/contracts/[id]/esignature'
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
        '/api/contracts/[id]/esignature'
      )
    }

    // Validate request body
    const { signerEmail, signerName, position } = req.body

    if (!signerEmail || !signerName) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Signer email and name are required',
        requestId,
        `/api/contracts/${id}/esignature`
      )
    }

    // Create e-signature request
    const esignatureRequest = {
      signerEmail,
      signerName,
      position: position || ''
    }

    // Call contract service
    const result = await contractService.requestESignature(id, esignatureRequest, token)

    return res.status(201).json(result)

  } catch (error: any) {
    console.error('[Contract E-Signature] Error:', error)
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
