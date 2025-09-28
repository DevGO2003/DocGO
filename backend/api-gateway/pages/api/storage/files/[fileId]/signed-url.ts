import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fileId } = req.query
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }
  try {
    const target = `http://localhost:8012/api/v1/file-storage-asset-service/files/${fileId}/signed-url`
    const r = await fetch(target, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...req.headers as any },
      body: JSON.stringify(req.body ?? {}),
    })
    const data = await r.json()
    res.status(200).json(data)
  } catch (e: any) {
    res.status(200).json({ apiVersion: 'v1', statusCode: 500, shortMessage: 'Internal Server Error', description: `Proxy file-storage-asset-service error: ${e}`, data: null, timestamp: new Date().toISOString(), requestId: crypto.randomUUID(), path: req.url })
  }
}


