import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { handleServiceError } from './handleServiceError';

export function withApiHandler(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (err: any) {
      const { httpStatus, body } = handleServiceError(err, req);
      return res.status(httpStatus).json(body);
    }
  };
}


















































