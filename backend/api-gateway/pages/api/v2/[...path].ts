import { NextApiRequest, NextApiResponse } from 'next';
import { enhancedServiceManager } from '@/lib/enhancedServiceManager';
import logger from '@/lib/logger';

/**
 * @swagger
 * /api/v2/{service-name}/{path}:
 *   get:
 *     summary: Enhanced Proxy GET request với Load Balancing và Caching
 *     description: |
 *       ## 🔄 Enhanced Proxy GET Request
 *       
 *       Định tuyến GET request đến microservice với Load Balancing và Caching.
 *       
 *       ### 🔹 Đầu vào
 *       🛣️ **service-name** (bắt buộc, path)
 *       Loại: string
 *       Mô tả: Tên của microservice (user-management, document-management, automation)
 *       
 *       🛣️ **path** (bắt buộc, path)
 *       Loại: string
 *       Mô tả: Đường dẫn cụ thể trong microservice
 *       
 *       🔍 **query parameters** (tùy chọn, query)
 *       Loại: object
 *       Mô tả: Query parameters sẽ được forward đến microservice
 *       
 *       ### 🔹 Đầu ra
 *       📊 **RestResponse<T>**
 *       Loại: object
 *       Mô tả: Response từ microservice được bọc trong RestResponse envelope
 *       
 *       ### 📋 Response Codes
 *       - **200 OK**: Request thành công
 *       - **404 Not Found**: Service không tồn tại
 *       - **503 Service Unavailable**: Service không khả dụng
 *       - **500 Internal Server Error**: Lỗi trong quá trình xử lý
 *       
 *       ### 🔗 Available Services
 *       - `user-management` - User Profile & Management
 *       - `document-management` - Document & Workflow Management
 *       - `automation` - AI Document Processing
 *       
 *     tags: [Enhanced API Gateway]
 *     parameters:
 *       - in: path
 *         name: service-name
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên của microservice
 *         example: user-management
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Đường dẫn trong microservice
 *         example: users
 *     responses:
 *       200:
 *         description: Request thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestResponse'
 *       404:
 *         description: Service không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       503:
 *         description: Service không khả dụng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi trong quá trình xử lý
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   
 *   post:
 *     summary: Enhanced Proxy POST request với Load Balancing
 *     description: |
 *       ## 🔄 Enhanced Proxy POST Request
 *       
 *       Định tuyến POST request đến microservice với Load Balancing.
 *       
 *       ### 🔹 Đầu vào
 *       🛣️ **service-name** (bắt buộc, path)
 *       🛣️ **path** (bắt buộc, path)
 *       📝 **body** (tùy chọn, body)
 *       🔍 **query parameters** (tùy chọn, query)
 *       
 *       ### 🔹 Đầu ra
 *       📊 **RestResponse<T>**
 *       
 *     tags: [Enhanced API Gateway]
 *     parameters:
 *       - in: path
 *         name: service-name
 *         required: true
 *         schema:
 *           type: string
 *         example: user-management
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         example: users
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             username: "user@example.com"
 *             password: "securepassword123"
 *     responses:
 *       200:
 *         description: Request thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestResponse'
 *       201:
 *         description: Resource được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Service không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi trong quá trình xử lý
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   
 *   put:
 *     summary: Enhanced Proxy PUT request với Load Balancing
 *     description: |
 *       ## 🔄 Enhanced Proxy PUT Request
 *       
 *       Định tuyến PUT request để cập nhật resource với Load Balancing.
 *       
 *       ### 🔹 Đầu vào
 *       🛣️ **service-name** (bắt buộc, path)
 *       🛣️ **path** (bắt buộc, path)
 *       📝 **body** (tùy chọn, body)
 *       🔍 **query parameters** (tùy chọn, query)
 *       
 *       ### 🔹 Đầu ra
 *       📊 **RestResponse<T>**
 *       
 *     tags: [Enhanced API Gateway]
 *     parameters:
 *       - in: path
 *         name: service-name
 *         required: true
 *         schema:
 *           type: string
 *         example: user-management
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         example: users/123
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             firstName: "John"
 *             lastName: "Doe"
 *             email: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestResponse'
 *       404:
 *         description: Resource không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi trong quá trình xử lý
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   
 *   delete:
 *     summary: Enhanced Proxy DELETE request với Load Balancing
 *     description: |
 *       ## 🔄 Enhanced Proxy DELETE Request
 *       
 *       Định tuyến DELETE request để xóa resource với Load Balancing.
 *       
 *       ### 🔹 Đầu vào
 *       🛣️ **service-name** (bắt buộc, path)
 *       🛣️ **path** (bắt buộc, path)
 *       🔍 **query parameters** (tùy chọn, query)
 *       
 *       ### 🔹 Đầu ra
 *       📊 **RestResponse<T>**
 *       
 *     tags: [Enhanced API Gateway]
 *     parameters:
 *       - in: path
 *         name: service-name
 *         required: true
 *         schema:
 *           type: string
 *         example: user-management
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         example: users/123
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RestResponse'
 *       204:
 *         description: Không có nội dung (No Content)
 *       404:
 *         description: Resource không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi trong quá trình xử lý
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { path } = req.query;
    const fullPath = Array.isArray(path) ? path.join('/') : path || '';
    const method = req.method || 'GET';

    logger.info(`🔄 Enhanced proxy request: ${method} /${fullPath}`);

    // Parse service name và endpoint
    const pathParts = fullPath.split('/');
    const serviceName = pathParts[0];
    const endpoint = pathParts.slice(1).join('/');

    if (!serviceName || !endpoint) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      
      return res.status(400).json({
        apiVersion: 'v1',
        statusCode: 400,
        shortMessage: 'Bad Request',
        description: 'Invalid path format. Expected: /api/v2/{service-name}/{endpoint}',
        data: null,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        path: `/api/v2/${fullPath}`
      });
    }

    // Lấy service instance từ enhanced service manager
    const service = enhancedServiceManager.getService(serviceName);
    if (!service) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      
      return res.status(404).json({
        apiVersion: 'v1',
        statusCode: 404,
        shortMessage: 'Service Not Found',
        description: `Service '${serviceName}' not found. Available services: user-management, document-management, automation`,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        path: `/api/v2/${fullPath}`
      });
    }

    // Parse query parameters
    const queryParams = { ...req.query };
    delete queryParams.path; // Remove path from query params

    // Parse request body
    let parsedBody = req.body;
    if (typeof parsedBody === 'string') {
      try {
        parsedBody = JSON.parse(parsedBody);
      } catch (error) {
        // Keep as string if not valid JSON
      }
    }

    // Forward headers
    const fwdHeaders: Record<string, string> = {};
    const headersToForward = ['authorization', 'x-correlation-id', 'x-actor', 'content-type'];
    headersToForward.forEach(header => {
      if (req.headers[header]) {
        fwdHeaders[header] = req.headers[header] as string;
      }
    });

    // Make request to service
    let response;
    const fullEndpoint = `/api/v1/${serviceName}-service/${endpoint}`;

    switch (method.toUpperCase()) {
      case 'GET':
        response = await service.get(fullEndpoint, { 
          params: queryParams, 
          headers: fwdHeaders 
        });
        break;
      case 'POST':
        response = await service.post(fullEndpoint, parsedBody, {
          params: queryParams,
          headers: { 'Content-Type': req.headers['content-type'] as string, ...fwdHeaders }
        });
        break;
      case 'PUT':
        response = await service.put(fullEndpoint, parsedBody, {
          params: queryParams,
          headers: { 'Content-Type': req.headers['content-type'] as string, ...fwdHeaders }
        });
        break;
      case 'DELETE':
        response = await service.delete(fullEndpoint, { 
          params: queryParams, 
          headers: fwdHeaders 
        });
        break;
      case 'OPTIONS':
        // Handle CORS preflight requests
        res.status(200);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Max-Age', '86400');
        return res.end();
      default:
        return res.status(405).json({
          apiVersion: 'v1',
          statusCode: 405,
          shortMessage: 'Method Not Allowed',
          description: `HTTP method ${method} is not supported`,
          data: null,
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          path: `/api/v2/${fullPath}`
        });
    }

    // Set CORS headers for success responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    return res.status(response.status).json(response.data);

  } catch (error: any) {
    logger.error(`❌ Enhanced proxy error:`, error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    return res.status(500).json({
      apiVersion: 'v1',
      statusCode: 500,
      shortMessage: 'Internal Server Error',
      description: 'An error occurred while processing the request',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      path: `/api/v2/${req.query.path}`
    });
  }
}
