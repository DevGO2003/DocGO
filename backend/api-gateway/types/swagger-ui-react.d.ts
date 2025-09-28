declare module 'swagger-ui-react' {
  interface SwaggerUIProps {
    spec?: any;
    url?: string;
    docExpansion?: string;
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    displayRequestDuration?: boolean;
    displayOperationId?: boolean;
    filter?: boolean;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    tryItOutEnabled?: boolean;
    requestInterceptor?: (request: any) => any;
    responseInterceptor?: (response: any) => any;
  }
  
  const SwaggerUI: React.ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}
