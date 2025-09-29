import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Busboy from 'busboy';
import FormData from 'form-data';
import { Buffer } from 'buffer';
import { applyMiddleware } from '@/lib/middleware';
import serviceManager from '@/lib/services';
import kafkaService from '@/lib/kafka';
import logger from '@/lib/logger';
import { withApiHandler } from '@/lib/http/withApiHandler';

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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const fullPath = Array.isArray(path) ? path.join('/') : path || '';
  const method = req.method || 'GET';

  logger.info(`🔄 Proxying request: ${method} /${fullPath}`);

  // Determine which service to route to
  let serviceKey: string;
  let endpoint: string;

  // Centralized prefix mapping (full aliases)
  const prefixMappings: Array<{ prefix: string; serviceKey: string; base: string }> = [
    // User Management aliases
    { prefix: 'auth/', serviceKey: 'user-management', base: '/api/v1/user-management-service/' },
    { prefix: 'oauth2/', serviceKey: 'user-management', base: '/api/v1/user-management-service/' },
    { prefix: 'users/', serviceKey: 'user-management', base: '/api/v1/user-management-service/' },
    { prefix: 'roles/', serviceKey: 'user-management', base: '/api/v1/user-management-service/' },
    { prefix: 'permissions/', serviceKey: 'user-management', base: '/api/v1/user-management-service/' },
    { prefix: 'profiles/', serviceKey: 'user-management', base: '/api/v1/user-management-service/' },
    { prefix: 'sessions/', serviceKey: 'user-management', base: '/api/v1/user-management-service/' },
    { prefix: 'tokens/', serviceKey: 'user-management', base: '/api/v1/user-management-service/' },

    // Document Management aliases
    { prefix: 'documents/', serviceKey: 'document-management', base: '/api/v1/document-management-service/' },
    { prefix: 'attachments/', serviceKey: 'document-management', base: '/api/v1/document-management-service/' },
    { prefix: 'workflows/', serviceKey: 'document-management', base: '/api/v1/document-management-service/' },
    { prefix: 'contracts/', serviceKey: 'document-management', base: '/api/v1/document-management-service/' },

    // Automation aliases
    { prefix: 'automation/', serviceKey: 'automation', base: '/api/v1/automation-service/' }
  ];

  let mapped = false;
  for (const m of prefixMappings) {
    if (fullPath.startsWith(m.prefix)) {
      serviceKey = m.serviceKey;
      endpoint = `${m.base}${fullPath}`;
      mapped = true;
      logger.info(`🎯 Mapped ${fullPath} to service: ${serviceKey}, endpoint: ${endpoint}`);
      break;
    }
  }

  if (!mapped) {
    // Legacy service-name based routing
    // Support both forms:
    // 1) <service-name>/...
    // 2) v1/<service-name>/... (full API prefix requested via gateway)
    if (fullPath.startsWith('v1/authentication-identity-service')) {
      serviceKey = 'authentication';
      // fullPath already contains "v1/..." → prefix with "/api/" only
      endpoint = `/api/${fullPath}`;
    } else if (fullPath.startsWith('v1/user-management-service')) {
      serviceKey = 'user-management';
      endpoint = `/api/${fullPath}`;
    } else if (fullPath.startsWith('v1/contract-management-service')) {
      serviceKey = 'contract-management';
      endpoint = `/api/${fullPath}`;
    } else if (fullPath.startsWith('v1/ai-processing-service')) {
      serviceKey = 'ai-processing';
      endpoint = `/api/${fullPath}`;
    } else if (fullPath.startsWith('v1/file-storage-asset-service')) {
      serviceKey = 'file-storage';
      endpoint = `/api/${fullPath}`;
    } else if (fullPath.startsWith('v1/general-file-management-service')) {
      serviceKey = 'general-file-management';
      endpoint = `/api/${fullPath}`;
    } else if (fullPath.startsWith('authentication-identity-service')) {
      serviceKey = 'authentication';
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
      endpoint = `/api/v1/${fullPath}`;
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
      return res.status(404).json({
        error: 'Service not found',
        message: `No service configured for path: ${fullPath}. Available services: authentication-identity-service, user-management-service, contract-management-service, ai-processing-service, file-storage-asset-service, general-file-management-service`
      });
    }
  }

  const service = serviceManager.getService(serviceKey);
  if (!service) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    return res.status(503).json({
      error: 'Service unavailable',
      message: `Service ${serviceKey} is not available`
    });
  }

  const { path: pathParam, ...queryParams } = req.query as Record<string, any>;

  const contentTypeHeader = (req.headers['content-type'] || '').toLowerCase();
  const isMultipart = contentTypeHeader.startsWith('multipart/');

  if (isMultipart) {
    const busboy = Busboy({ headers: req.headers });
    const form = new FormData();

    const fieldPromises: Promise<void>[] = [];

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const chunks: Buffer[] = [];
      file.on('data', (data: Buffer) => chunks.push(data));
      file.on('end', () => {
        const buffer = Buffer.concat(chunks);
        form.append(fieldname, buffer, { filename: filename, contentType: mimetype });
      });
    });

    busboy.on('field', (fieldname, val) => {
      form.append(fieldname, val);
    });

    const done = new Promise<void>((resolve, reject) => {
      busboy.on('finish', () => resolve());
      busboy.on('error', (err) => reject(err));
    });

    req.pipe(busboy);
    await done;

    const upstreamUrl = new URL(service.defaults.baseURL || '');
    const response = await axios.post(
      `${upstreamUrl.origin}${endpoint}`,
      form,
      {
        params: queryParams,
        headers: {
          ...form.getHeaders(),
          ...(req.headers['authorization'] ? { Authorization: req.headers['authorization'] as string } : {}),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: () => true,
      }
    );

    if (typeof (res as any).setHeader === 'function') {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    }
    return res.status(response.status).json(response.data);
  }

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
      response = await service.get(endpoint, { params: queryParams, headers: fwdHeaders, validateStatus: () => true });
      break;
    case 'POST':
      response = await service.post(endpoint, parsedBody, {
        params: queryParams,
        headers: { 'Content-Type': req.headers['content-type'] as string, ...fwdHeaders },
        validateStatus: () => true
      });
      break;
    case 'PUT':
      response = await service.put(endpoint, parsedBody, {
        params: queryParams,
        headers: { 'Content-Type': req.headers['content-type'] as string, ...fwdHeaders },
        validateStatus: () => true
      });
      break;
    case 'DELETE':
      response = await service.delete(endpoint, { params: queryParams, headers: fwdHeaders, validateStatus: () => true });
      break;
    case 'OPTIONS':
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

  logger.info(`✅ Proxy response: ${response.status} from ${serviceKey} service`);
  
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  return res.status(response.status).json(response.data);
}

export default withApiHandler(handler);

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};
