import { NextApiRequest, NextApiResponse } from 'next'
import { handleDocumentRequest } from '../../../src/controllers/DocumentController'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return await handleDocumentRequest(req, res)
}


// Disable body parsing for this route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
