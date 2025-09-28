import { NextApiRequest, NextApiResponse } from 'next';
import { swaggerSpec } from '@/lib/swagger';

/**
 * @swagger
 * /api/swagger.json:
 *   get:
 *     summary: Lấy OpenAPI specification
 *     description: |
 *       ## 📋 OpenAPI Specification
 *       
 *       Endpoint này trả về OpenAPI 3.0.3 specification cho API Gateway BFF.
 *       Sử dụng để hiển thị Swagger UI hoặc tích hợp với các công cụ khác.
 *       
 *       ### 🔹 Đầu vào
 *       🚫 Không có tham số đầu vào
 *       
 *       ### 🔹 Đầu ra
 *       📄 **OpenAPI Specification**
 *       Loại: application/json
 *       Mô tả: OpenAPI 3.0.3 specification document
 *       
 *       ### 📋 Response Codes
 *       - **200 OK**: Specification được trả về thành công
 *       
 *       ### 🔗 Related Endpoints
 *       - `GET /swagger` - Swagger UI page
 *       - `GET /api/health` - Health check endpoint
 *       
 *     tags: [API Gateway BFF]
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: OpenAPI 3.0.3 specification
 *       500:
 *         description: Lỗi trong quá trình tạo specification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only GET method is allowed for this endpoint'
    });
  }

  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Set content type
    res.setHeader('Content-Type', 'application/json');
    
    // Return swagger specification
    return res.status(200).json(swaggerSpec);
    
  } catch (error) {
    console.error('❌ Error generating Swagger spec:', error);
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate OpenAPI specification',
      statusCode: 500
    });
  }
}
