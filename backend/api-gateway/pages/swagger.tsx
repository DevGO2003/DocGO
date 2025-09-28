import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Dynamic import để tránh SSR issues với Swagger UI
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-sm border">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg animate-pulse">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Đang tải Swagger UI...</h3>
        <p className="text-gray-600 mb-4">Vui lòng chờ trong giây lát</p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500 text-sm">Đang khởi tạo...</span>
        </div>
      </div>
    </div>
  )
});

// Import Swagger CSS cho phiên bản mới
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerPage() {
  const router = useRouter();
  
  // Mapping giữa tên dịch vụ và thông tin kết nối (4 microservices chính)
  const serviceConnectionMapping = useMemo(() => ({
    'API Gateway': {
      port: 8000,
      container: 'api-gateway',
      description: 'API Gateway, tích hợp tất cả services',
      technology: 'Next.js',
      icon: '🚀',
      color: '#667eea',
      endpoints: [
        { method: 'GET', path: '/api/health', description: 'Health check' },
        { method: 'GET', path: '/api/swagger.json', description: 'Swagger spec' },
        { method: 'GET', path: '/swagger', description: 'Swagger UI' },
        { method: 'GET', path: '/api/users', description: 'Proxy to user service' },
        { method: 'GET', path: '/api/documents', description: 'Proxy to document service' }
      ]
    },
    'User Management Service': {
      port: 8001,
      container: 'user-management-service',
      description: 'Quản lý người dùng, xác thực, phân quyền',
      technology: 'Spring Boot',
      icon: '👥',
      color: '#f093fb',
      endpoints: [
        { method: 'GET', path: '/api/v1/user-management-service/users', description: 'List users' },
        { method: 'POST', path: '/api/v1/user-management-service/users', description: 'Create user' },
        { method: 'GET', path: '/api/v1/user-management-service/users/{id}', description: 'Get user' },
        { method: 'PUT', path: '/api/v1/user-management-service/users/{id}', description: 'Update user' },
        { method: 'GET', path: '/docs', description: 'Swagger UI' }
      ]
    },
    'Document Management Service': {
      port: 8002,
      container: 'document-management-service',
      description: 'Quản lý tài liệu, workflow, approval processes',
      technology: 'Spring Boot',
      icon: '📄',
      color: '#4facfe',
      endpoints: [
        { method: 'GET', path: '/api/v1/document-management-service/documents', description: 'List documents' },
        { method: 'POST', path: '/api/v1/document-management-service/documents', description: 'Create document' },
        { method: 'GET', path: '/api/v1/document-management-service/documents/{id}', description: 'Get document' },
        { method: 'PUT', path: '/api/v1/document-management-service/documents/{id}', description: 'Update document' },
        { method: 'GET', path: '/docs', description: 'Swagger UI' }
      ]
    },
    'Automation Service': {
      port: 8003,
      container: 'automation-service',
      description: 'Xử lý tự động, AI, machine learning, NLP',
      technology: 'FastAPI',
      icon: '🤖',
      color: '#43e97b',
      endpoints: [
        { method: 'POST', path: '/api/v1/automation-service/process', description: 'Process document' },
        { method: 'POST', path: '/api/v1/automation-service/validate', description: 'Validate document' },
        { method: 'GET', path: '/api/v1/automation-service/health', description: 'Health check' },
        { method: 'GET', path: '/openapi.json', description: 'OpenAPI spec' },
        { method: 'GET', path: '/docs', description: 'Swagger UI' }
      ]
    }
  }), []);

  const [selectedService, setSelectedService] = useState<string>('API Gateway');
  const [spec, setSpec] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSpec, setIsLoadingSpec] = useState<boolean>(false);

  // Hàm xử lý click vào service card
  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setError(null);
    setSpec(null);
    setIsLoadingSpec(true);
    
    const serviceInfo = serviceConnectionMapping[serviceName as keyof typeof serviceConnectionMapping];
    if (serviceInfo) {
      // Scroll xuống phần API documentation
      setTimeout(() => {
        const apiSection = document.getElementById('api-documentation');
        if (apiSection) {
          apiSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Hàm mở docs trực tiếp từ service
  const handleOpenServiceDocs = (serviceName: string) => {
    const serviceInfo = serviceConnectionMapping[serviceName as keyof typeof serviceConnectionMapping];
    if (serviceInfo) {
      // Kiểm tra xem có đang chạy trên Docker không
      const isDocker = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      
      let targetUrl: string;
      
      if (isDocker) {
        // Nếu chạy trên Docker, sử dụng tên container
        targetUrl = `http://${serviceInfo.container}/docs`;
      } else {
        // Nếu chạy trên localhost, sử dụng port
        targetUrl = `http://localhost:${serviceInfo.port}/docs`;
      }
      
      // Mở trong tab mới
      window.open(targetUrl, '_blank');
    }
  };

  // Load spec khi service được chọn
  useEffect(() => {
    const serviceInfo = serviceConnectionMapping[selectedService as keyof typeof serviceConnectionMapping];
    if (!serviceInfo) return;

    let specUrl: string;
    
    if (selectedService === 'API Gateway') {
      specUrl = '/api/swagger.json';
    } else if (selectedService === 'User Management Service') {
      specUrl = '/api/docs/user-management';
    } else if (selectedService === 'Document Management Service') {
      specUrl = '/api/docs/document-management';
    } else if (selectedService === 'Automation Service') {
      specUrl = '/api/docs/automation';
    } else {
      return;
    }

    setIsLoadingSpec(true);
    fetch(specUrl)
      .then(async r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => {
        setSpec(json);
        setIsLoadingSpec(false);
      })
      .catch(e => {
        setError(`Không tải được spec từ ${selectedService}: ${e.message}`);
        setIsLoadingSpec(false);
      });
  }, [selectedService, serviceConnectionMapping]);

  return (
    <>
      <Head>
        <title>DocGO - API Documentation Hub</title>
        <meta name="description" content="Tổng hợp tài liệu API cho tất cả microservices của DocGO" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="swagger-container">
        {/* Header */}
        <div className="swagger-header">
          <h1>🚀 DocGO - API Documentation Hub</h1>
          <p>Tổng hợp tài liệu API cho tất cả microservices</p>
          
          {/* Service Cards Navigation */}
          <div className="service-cards-nav">
            {Object.entries(serviceConnectionMapping).map(([serviceName, serviceInfo]) => (
              <div
                key={serviceName}
                className={`service-card ${selectedService === serviceName ? 'active' : ''}`}
                onClick={() => handleServiceClick(serviceName)}
                style={{ '--card-color': serviceInfo.color } as React.CSSProperties}
              >
                <div className="service-card-header">
                  <span className="service-icon">{serviceInfo.icon}</span>
                  <h3>{serviceName}</h3>
                    </div>
                <div className="service-card-body">
                  <p className="service-description">{serviceInfo.description}</p>
                  <div className="service-meta">
                    <span className="service-tech">{serviceInfo.technology}</span>
                    <span className="service-port">Port {serviceInfo.port}</span>
                  </div>
                </div>
                <div className="service-card-footer">
                  <button 
                    className="view-docs-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenServiceDocs(serviceName);
                    }}
                  >
                    📖 Xem Docs
                  </button>
                    </div>
                  </div>
            ))}
              </div>
              
          {error && (
            <div className="error-message">
              ⚠️ {error}
                    </div>
          )}
              </div>
              
        {/* API Documentation Section */}
        <div id="api-documentation" className="api-documentation-section">
          <div className="api-section-header">
            <h2>📚 API Documentation - {selectedService}</h2>
            <p>Chi tiết API endpoints và schemas cho {selectedService}</p>
              </div>
              
          {/* Service Status Notice - Tạm thời tắt để Contract Management Service hoạt động bình thường */}
          {false && (
            <div className="service-status-notice">
              <div className="notice-icon">⚠️</div>
              <div className="notice-content">
                <h3>Service đang bảo trì</h3>
                <p>API endpoints preview tạm thời không khả dụng cho service này.</p>
                <p>Vui lòng sử dụng nút <strong>"📖 Xem Docs"</strong> để truy cập tài liệu trực tiếp từ service.</p>
              </div>
            </div>
          )}

          {/* Swagger UI */}
          <div className="swagger-ui-container">
            {isLoadingSpec ? (
              <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-sm border">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg animate-pulse">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Đang tải API spec...</h3>
                  <p className="text-gray-600 mb-4">Đang lấy thông tin từ {selectedService}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500 text-sm">Đang xử lý...</span>
                  </div>
                </div>
              </div>
            ) : (
              <SwaggerUI 
                spec={spec || { openapi: '3.0.3', info: { title: 'Loading...', version: '1.0.0' } }}
                docExpansion="list"
                defaultModelsExpandDepth={2}
                defaultModelExpandDepth={2}
                displayOperationId={false}
                displayRequestDuration={true}
                filter={true}
                showExtensions={true}
                showCommonExtensions={true}
                tryItOutEnabled={true}
                requestInterceptor={(request: any) => {
                  return request;
                }}
                responseInterceptor={(response: any) => {
                  console.log('Swagger Response:', response);
                  return response;
                }}
              />
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .swagger-container {
          padding: 20px;
          max-width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .swagger-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        
        .swagger-header h1 {
          margin: 0 0 15px 0;
          font-size: 3rem;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .swagger-header p {
          margin: 0 0 30px 0;
          font-size: 1.3rem;
          opacity: 0.9;
        }
        
        /* Service Cards Navigation */
        .service-cards-nav {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .service-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid transparent;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-color);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-card.active {
          border-color: var(--card-color);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .service-card.active::before {
          transform: scaleX(1);
        }

        .service-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .service-icon {
          font-size: 2rem;
          margin-right: 15px;
        }
        
        .service-card h3 {
          margin: 0;
          color: #333;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .service-card-body {
          margin-bottom: 15px;
        }

        .service-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.4;
          margin: 0 0 10px 0;
        }

        .service-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .service-tech, .service-port {
          background: #f0f0f0;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          color: #555;
        }

        .service-card-footer {
          display: flex;
          justify-content: center;
        }

        .view-docs-btn {
          background: var(--card-color);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .view-docs-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        }

        .error-message {
          background: rgba(255, 255, 255, 0.9);
          color: #d32f2f;
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
          font-weight: 500;
        }

        /* API Documentation Section */
        .api-documentation-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .api-section-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .api-section-header h2 {
          color: #333;
          margin: 0 0 10px 0;
          font-size: 2rem;
        }

        .api-section-header p {
          color: #666;
          margin: 0;
          font-size: 1.1rem;
        }

        /* API Endpoints Preview */
        .api-endpoints-preview {
          margin-bottom: 30px;
        }

        .api-endpoints-preview h3 {
          color: #333;
          margin: 0 0 20px 0;
          font-size: 1.5rem;
        }

        /* Service Status Notice */
        .service-status-notice {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .notice-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .notice-content h3 {
          color: #856404;
          margin: 0 0 10px 0;
          font-size: 1.3rem;
        }

        .notice-content p {
          color: #856404;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }
        
        .notice-content p:last-child {
          margin-bottom: 0;
        }

        .endpoints-grid {
          display: grid;
          gap: 15px;
        }

        .endpoint-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }

        .method-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
          color: white;
          min-width: 60px;
          text-align: center;
        }

        .method-get { background: #61affe; }
        .method-post { background: #49cc90; }
        .method-put { background: #fca130; }
        .method-delete { background: #f93e3e; }

        .endpoint-path {
          font-family: 'Courier New', monospace;
          background: #e9ecef;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9rem;
          flex: 1;
        }

        .endpoint-description {
          color: #666;
          font-size: 0.9rem;
        }

        /* Swagger UI Container */
        .swagger-ui-container {
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .swagger-header h1 {
            font-size: 2rem;
          }
          
          .service-cards-nav {
            grid-template-columns: 1fr;
          }
          
          .endpoint-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .endpoint-path {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
