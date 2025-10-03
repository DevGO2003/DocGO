export type MappedStatus = {
  httpStatus: number;
  bodyStatus: number;
  shortMessage: string;
};

function shortOf(status: number): string {
  const map: Record<number, string> = {
    200: 'Success',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout'
  };
  return map[status] || 'Internal Server Error';
}

export function mapErrorToStatus(err: any): MappedStatus {
  // Axios error with response
  const status = err?.response?.status as number | undefined;
  if (typeof status === 'number') {
    if (status === 204) {
      return { httpStatus: 200, bodyStatus: 204, shortMessage: shortOf(204) };
    }
    if ([400, 401, 403, 404, 409, 422, 429].includes(status)) {
      return { httpStatus: status, bodyStatus: status, shortMessage: shortOf(status) };
    }
    if (status >= 500) {
      return { httpStatus: status, bodyStatus: status, shortMessage: shortOf(status) };
    }
    // fallback for 2xx/3xx non-204
    return { httpStatus: status, bodyStatus: status, shortMessage: shortOf(200) };
  }

  const code = err?.code as string | undefined;
  if (code === 'ECONNREFUSED' || code === 'ENOTFOUND') {
    return { httpStatus: 503, bodyStatus: 503, shortMessage: shortOf(503) };
  }
  if (code === 'ETIMEDOUT' || code === 'ECONNABORTED') {
    return { httpStatus: 504, bodyStatus: 504, shortMessage: shortOf(504) };
  }

  return { httpStatus: 500, bodyStatus: 500, shortMessage: shortOf(500) };
}

export function success204ToHttp200(bodyStatus: number, httpStatus: number): number {
  return bodyStatus === 204 ? 200 : httpStatus;
}



















































