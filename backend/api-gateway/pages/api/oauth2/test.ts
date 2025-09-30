import type { NextApiRequest, NextApiResponse } from 'next'

function createEnvelope(data: any, statusCode: number, shortMessage: string, description: string, path: string) {
  return {
    apiVersion: 'v1',
    statusCode,
    shortMessage,
    description,
    data,
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).slice(2),
    path,
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = req.url || '/api/oauth2/test'

  if (req.method !== 'GET') {
    return res.status(200).json(createEnvelope(null, 400, 'Bad Request', 'Only GET is supported', path))
  }

  const authServiceUrl = (process.env.USER_MANAGEMENT_SERVICE_URL as string) || 'http://user-management-service:8001'

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    let status: number | null = null
    let note = ''

    try {
      const resp = await fetch(`${authServiceUrl}/oauth2/authorization/google`, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
      })
      status = resp.status
    } finally {
      clearTimeout(timeout)
    }

    let enabled = false
    if (status !== null) {
      if (status === 302) {
        enabled = true
        note = 'Auth service returned redirect; OAuth2 likely enabled.'
      } else if (status === 401 || status === 403 || status === 200) {
        enabled = true
        note = `Auth service responded ${status}; endpoint reachable.`
      } else if (status === 404) {
        enabled = false
        note = 'Auth service responded 404; OAuth2 not configured.'
      } else {
        enabled = false
        note = `Auth service responded ${status}; treating as disabled.`
      }
    } else {
      enabled = false
      note = 'Cannot reach auth service.'
    }

    return res.status(200).json(createEnvelope(enabled, 200, 'Success', note, path))
  } catch (error: any) {
    return res.status(200).json(
      createEnvelope(false, 500, 'Internal Server Error', error?.message || 'Unexpected error', path)
    )
  }
}


