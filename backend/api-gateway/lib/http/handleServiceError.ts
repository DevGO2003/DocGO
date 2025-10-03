import type { NextApiRequest } from 'next';
import { mapErrorToStatus, success204ToHttp200 } from './statusMap';

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function sanitizeData(data: any): any {
  if (!data || typeof data !== 'object') return null;
  const forbidden = ['stack', 'stacktrace', 'trace', 'details'];
  const clone: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    if (forbidden.includes(k.toLowerCase())) continue;
    clone[k] = v;
  }
  return Object.keys(clone).length ? clone : null;
}

function inferDescription(err: any): string | undefined {
  if (err?.response?.data?.description && typeof err.response.data.description === 'string') {
    return err.response.data.description;
  }
  if (typeof err?.message === 'string') return err.message;
  return undefined;
}

export function handleServiceError(err: any, req: NextApiRequest, preferredDesc?: string) {
  const mapped = mapErrorToStatus(err);
  const path = req.url || '';
  const requestId = (req.headers['x-correlation-id'] as string) || generateRequestId();
  const description = preferredDesc || inferDescription(err) || mapped.shortMessage;

  const body = {
    apiVersion: 'v1',
    statusCode: mapped.bodyStatus,
    shortMessage: mapped.shortMessage,
    description,
    data: sanitizeData(err?.response?.data) ?? null,
    timestamp: new Date().toISOString(),
    requestId,
    path
  };

  const httpStatus = success204ToHttp200(mapped.bodyStatus, mapped.httpStatus);
  return { httpStatus, body };
}



















































