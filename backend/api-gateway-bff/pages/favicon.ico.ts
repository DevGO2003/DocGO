import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple SVG favicon
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#2563eb"/>
    <text x="50" y="70" text-anchor="middle" fill="white" font-size="60" font-family="Arial">📄</text>
  </svg>`

  res.setHeader('Content-Type', 'image/svg+xml')
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  res.status(200).send(faviconSvg)
}

