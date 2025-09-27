import { NextApiRequest, NextApiResponse } from 'next';
import integrationService from '../../../lib/services/integrationService';
import { generateRequestId } from '../../../lib/utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (typeof name !== 'string') {
    return res.status(400).json({
      apiVersion: 'v1',
      statusCode: 400,
      shortMessage: 'Bad Request',
      description: 'Integration name is required',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: `/api/integrations/${name}`
    });
  }

  if (req.method === 'GET') {
    try {
      const { status } = req.query;

      if (status === 'true') {
        // Get integration status
        const integrationStatus = await integrationService.testConnection(name);
        
        return res.status(200).json({
          apiVersion: 'v1',
          statusCode: 200,
          shortMessage: 'Success',
          description: `Status for integration ${name}`,
          data: integrationStatus,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: `/api/integrations/${name}?status=true`
        });
      } else {
        // Get integration configuration
        const integration = integrationService.getIntegration(name);
        
        if (!integration) {
          return res.status(404).json({
            apiVersion: 'v1',
            statusCode: 404,
            shortMessage: 'Not Found',
            description: `Integration ${name} not found`,
            data: null,
            timestamp: new Date().toISOString(),
            requestId: generateRequestId(),
            path: `/api/integrations/${name}`
          });
        }

        return res.status(200).json({
          apiVersion: 'v1',
          statusCode: 200,
          shortMessage: 'Success',
          description: `Configuration for integration ${name}`,
          data: integration,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: `/api/integrations/${name}`
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        apiVersion: 'v1',
        statusCode: 500,
        shortMessage: 'Internal Server Error',
        description: `Failed to get integration ${name}: ${error.message}`,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: `/api/integrations/${name}`
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const integration = req.body;
      integration.name = name; // Ensure name matches URL parameter
      
      integrationService.addIntegration(integration);
      
      return res.status(200).json({
        apiVersion: 'v1',
        statusCode: 200,
        shortMessage: 'Success',
        description: `Integration ${name} updated successfully`,
        data: integration,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: `/api/integrations/${name}`
      });
    } catch (error: any) {
      return res.status(500).json({
        apiVersion: 'v1',
        statusCode: 500,
        shortMessage: 'Internal Server Error',
        description: `Failed to update integration ${name}: ${error.message}`,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: `/api/integrations/${name}`
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleted = integrationService.removeIntegration(name);
      
      if (!deleted) {
        return res.status(404).json({
          apiVersion: 'v1',
          statusCode: 404,
          shortMessage: 'Not Found',
          description: `Integration ${name} not found`,
          data: null,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: `/api/integrations/${name}`
        });
      }

      return res.status(200).json({
        apiVersion: 'v1',
        statusCode: 200,
        shortMessage: 'Success',
        description: `Integration ${name} deleted successfully`,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: `/api/integrations/${name}`
      });
    } catch (error: any) {
      return res.status(500).json({
        apiVersion: 'v1',
        statusCode: 500,
        shortMessage: 'Internal Server Error',
        description: `Failed to delete integration ${name}: ${error.message}`,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: `/api/integrations/${name}`
      });
    }
  } else {
    return res.status(405).json({
      apiVersion: 'v1',
      statusCode: 405,
      shortMessage: 'Method Not Allowed',
      description: 'Only GET, PUT, and DELETE methods are allowed',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: `/api/integrations/${name}`
    });
  }
}
