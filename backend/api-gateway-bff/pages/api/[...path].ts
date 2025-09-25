import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { applyMiddleware } from '@/lib/middleware';
import serviceManager from '@/lib/services';
import kafkaService from '@/lib/kafka';
import logger from '@/lib/logger';

/**
 * @swagger
 * /api/v1/{service-name}/{path}:
 *   get:
 *     summary: Proxy GET request đến microservice
 *     description: |
 *       ## 🔄 Proxy GET Request
 *       
 *       Định tuyến GET request đến microservice tương ứng dựa trên path.
 *       
 *       ### 🔹 Đầu vào
 *       🛣️ **service-name** (bắt buộc, path)
 *       Loại: string
 *       Mô tả: Tên của microservice (authentication-identity-service, user-management-service, etc.)
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
 *       - `authentication-identity-service` - Authentication & Identity Management
 *       - `user-management-service` - User Profile & Approval Management
 *       - `contract-management-service` - Contract & Workflow Management
 *       - `ai-processing-service` - AI Document Processing
 *       - `file-storage-asset-service` - File & Asset Management
 *       
 *     tags: [API Gateway BFF]
 *     parameters:
 *       - in: path
 *         name: service-name
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên của microservice
 *         example: authentication-identity-service
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Đường dẫn trong microservice
 *         example: auth/login
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
 *             example:
 *               error: "Service not found"
 *               message: "No service configured for path: unknown-service. Available services: authentication-identity-service, user-management-service, contract-management-service, ai-processing-service, file-storage-asset-service"
 *       503:
 *         description: Service không khả dụng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Service unavailable"
 *               message: "Service authentication is not available"
 *       500:
 *         description: Lỗi trong quá trình xử lý
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Service error"
 *               message: "An error occurred while processing the request"
 *   
 *   post:
 *     summary: Proxy POST request đến microservice
 *     description: |
 *       ## 🔄 Proxy POST Request
 *       
 *       Định tuyến POST request đến microservice tương ứng.
 *       
 *       ### 🔹 Đầu vào
 *       🛣️ **service-name** (bắt buộc, path)
 *       Loại: string
 *       Mô tả: Tên của microservice
 *       
 *       🛣️ **path** (bắt buộc, path)
 *       Loại: string
 *       Mô tả: Đường dẫn trong microservice
 *       
 *       📝 **body** (tùy chọn, body)
 *       Loại: object
 *       Mô tả: Request body sẽ được forward đến microservice
 *       
 *       🔍 **query parameters** (tùy chọn, query)
 *       Loại: object
 *       Mô tả: Query parameters
 *       
 *       ### 🔹 Đầu ra
 *       📊 **RestResponse<T>**
 *       Loại: object
 *       Mô tả: Response từ microservice
 *       
 *     tags: [API Gateway BFF]
 *     parameters:
 *       - in: path
 *         name: service-name
 *         required: true
 *         schema:
 *           type: string
 *         example: authentication-identity-service
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         example: auth/register
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
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
 *     summary: Proxy PUT request đến microservice
 *     description: |
 *       ## 🔄 Proxy PUT Request
 *       
 *       Định tuyến PUT request để cập nhật resource.
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
 *     tags: [API Gateway BFF]
 *     parameters:
 *       - in: path
 *         name: service-name
 *         required: true
 *         schema:
 *           type: string
 *         example: user-management-service
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
 *     summary: Proxy DELETE request đến microservice
 *     description: |
 *       ## 🔄 Proxy DELETE Request
 *       
 *       Định tuyến DELETE request để xóa resource.
 *       
 *       ### 🔹 Đầu vào
 *       🛣️ **service-name** (bắt buộc, path)
 *       🛣️ **path** (bắt buộc, path)
 *       🔍 **query parameters** (tùy chọn, query)
 *       
 *       ### 🔹 Đầu ra
 *       📊 **RestResponse<T>**
 *       
 *     tags: [API Gateway BFF]
 *     parameters:
 *       - in: path
 *         name: service-name
 *         required: true
 *         schema:
 *           type: string
 *         example: contract-management-service
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         example: contracts/456
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

    logger.info(`🔄 Proxying request: ${method} /${fullPath}`);

    // Determine which service to route to
    let serviceKey: string;
    let endpoint: string;

    if (fullPath.startsWith('authentication-identity-service')) {
      serviceKey = 'authentication';
      // Remove service name from path and add proper API prefix
      const pathWithoutService = fullPath.replace('authentication-identity-service/', '');
      endpoint = `/api/v1/authentication-identity-service/${pathWithoutService}`;
    } else if (fullPath.startsWith('user-management-service')) {
      serviceKey = 'user-management';
      endpoint = `/api/v1/${fullPath}`;
    } else if (fullPath.startsWith('contract-management-service')) {
      serviceKey = 'contract-management';
      endpoint = `/api/v1/${fullPath}`;
    } else if (fullPath.startsWith('ai-processing-service')) {
      serviceKey = 'ai-processing';
      endpoint = `/api/v1/${fullPath}`;
    } else if (fullPath.startsWith('file-storage-asset-service')) {
      serviceKey = 'file-storage';
      endpoint = `/api/v1/${fullPath}`;
    } else if (fullPath.startsWith('general-file-management-service')) {
      serviceKey = 'general-file-management';
      // Forward with API version prefix expected by the service
      endpoint = `/api/v1/${fullPath}`;
    } else {
      // CORS for early return
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
      return res.status(404).json({
        error: 'Service not found',
        message: `No service configured for path: ${fullPath}. Available services: authentication-identity-service, user-management-service, contract-management-service, ai-processing-service, file-storage-asset-service, general-file-management-service`
      });
    }

    // Get service instance
    const service = serviceManager.getService(serviceKey);
    if (!service) {
      // CORS for early return
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
      return res.status(503).json({
        error: 'Service unavailable',
        message: `Service ${serviceKey} is not available`
      });
    }

    // Filter out path parameters from query params
    const { path: pathParam, ...queryParams } = req.query;

    // Make request to microservice
    try {
      const contentTypeHeader = (req.headers['content-type'] || '').toLowerCase();
      const isMultipart = contentTypeHeader.startsWith('multipart/');

      if (isMultipart) {
        const upstreamUrl = new URL(service.defaults.baseURL || '');
        // Stream raw request to upstream to preserve multipart boundary
        const upstreamResponse = await axios.request({
          method,
          url: `${upstreamUrl.origin}${endpoint}`,
          params: queryParams,
          headers: {
            ...req.headers,
          },
          data: req as any,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          // Do not transform request body
          transformRequest: [(data) => data],
          // Important for streaming in Node
          responseType: 'stream',
          validateStatus: () => true
        });

        // Pipe upstream response back to client
        res.status(upstreamResponse.status);
        for (const [key, value] of Object.entries(upstreamResponse.headers)) {
          if (value !== undefined) {
            res.setHeader(key, value as any);
          }
        }
        // Ensure correct CORS on proxied streaming response
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        (upstreamResponse.data as any).pipe(res);
        return;
      }

      // JSON/x-www-form-urlencoded flows
      // Vì đã tắt bodyParser, cần tự đọc body đối với JSON/x-www-form-urlencoded
      let parsedBody: any = undefined;
      if (method !== 'GET' && method !== 'DELETE') {
        const rawBody: string = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', (chunk) => { data += chunk; });
          req.on('end', () => resolve(data));
          req.on('error', (err) => reject(err));
        });

        if (rawBody && contentTypeHeader.includes('application/json')) {
          try {
            parsedBody = JSON.parse(rawBody);
          } catch {
            parsedBody = rawBody;
          }
        } else if (rawBody && contentTypeHeader.includes('application/x-www-form-urlencoded')) {
          // Trường hợp form urlencoded
          const params = new URLSearchParams(rawBody);
          parsedBody = Object.fromEntries(params.entries());
        } else if (rawBody) {
          parsedBody = rawBody;
        }
      }

      let response;
      const fwdHeaders: any = {};
      if (req.headers['authorization']) {
        fwdHeaders['Authorization'] = req.headers['authorization'] as string;
      }
      switch (method.toUpperCase()) {
        case 'GET':
          response = await service.get(endpoint, { params: queryParams, headers: fwdHeaders });
          break;
        case 'POST':
          response = await service.post(endpoint, parsedBody, {
            params: queryParams,
            headers: { 'Content-Type': req.headers['content-type'] as string, ...fwdHeaders }
          });
          break;
        case 'PUT':
          response = await service.put(endpoint, parsedBody, {
            params: queryParams,
            headers: { 'Content-Type': req.headers['content-type'] as string, ...fwdHeaders }
          });
          break;
        case 'DELETE':
          response = await service.delete(endpoint, { params: queryParams, headers: fwdHeaders });
          break;
        case 'OPTIONS':
          // Handle CORS preflight requests
          res.status(200);
          res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400');
          return res.end();
        default:
          return res.status(405).json({
            error: 'Method not allowed',
            message: `HTTP method ${method} is not supported`
          });
      }

      // Ensure CORS for success responses
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
      return res.status(response.status).json(response.data);

    } catch (error: any) {
      logger.error(`❌ Error calling ${serviceKey} service:`, error);

      // Return error response with CORS
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({
          error: 'Service error',
          message: error.message || 'An error occurred while processing the request'
        });
      }
    }

  } catch (error: any) {
    logger.error('❌ Unhandled error in API gateway:', error);

    // Ensure CORS on unhandled error
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

export const config = {
  api: {
    // Disable bodyParser to allow streaming multipart/form-data
    bodyParser: false,
    responseLimit: false,
  },
};
