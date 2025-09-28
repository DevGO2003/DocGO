import { NextApiRequest, NextApiResponse } from 'next'
import { contractService } from '../../../../lib/services/contractService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../../lib/utils/errorHandler'

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
      path: req.url || '/api/contracts/[id]/versions'
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
        '/api/contracts/[id]/versions'
      )
    }

    // Call contract service
    const result = await contractService.getContractVersions(id, token)

    return res.status(200).json(result)

  } catch (error: any) {
    console.error('[Contract Versions] Error:', error)
    return res.status(200).json(createErrorResponse(error, req as any))
  }
}
