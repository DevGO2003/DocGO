import { NextApiRequest, NextApiResponse } from 'next';
import integrationService from '../../../lib/services/integrationService';
import { generateRequestId } from '../../../lib/utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { status } = req.query;

      if (status === 'true') {
        // Get all integrations with status
        const integrationsStatus = await integrationService.getAllIntegrationsStatus();
        
        return res.status(200).json({
          apiVersion: 'v1',
          statusCode: 200,
          shortMessage: 'Success',
          description: 'All integrations status',
          data: integrationsStatus,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: '/api/integrations?status=true'
        });
      } else {
        // Get all integrations configuration
        const integrations = integrationService.getAllIntegrations();
        
        return res.status(200).json({
          apiVersion: 'v1',
          statusCode: 200,
          shortMessage: 'Success',
          description: 'All integrations configuration',
          data: integrations,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: '/api/integrations'
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        apiVersion: 'v1',
        statusCode: 500,
        shortMessage: 'Internal Server Error',
        description: `Failed to get integrations: ${error.message}`,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: '/api/integrations'
      });
    }
  } else if (req.method === 'POST') {
    try {
      const integration = req.body;
      
      if (!integration.name || !integration.type || !integration.endpoint) {
        return res.status(400).json({
          apiVersion: 'v1',
          statusCode: 400,
          shortMessage: 'Bad Request',
          description: 'Missing required fields: name, type, endpoint',
          data: null,
          timestamp: new Date().toISOString(),
          requestId: generateRequestId(),
          path: '/api/integrations'
        });
      }

      integrationService.addIntegration(integration);
      
      return res.status(201).json({
        apiVersion: 'v1',
        statusCode: 201,
        shortMessage: 'Created',
        description: 'Integration added successfully',
        data: integration,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: '/api/integrations'
      });
    } catch (error: any) {
      return res.status(500).json({
        apiVersion: 'v1',
        statusCode: 500,
        shortMessage: 'Internal Server Error',
        description: `Failed to add integration: ${error.message}`,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: '/api/integrations'
      });
    }
  } else {
    return res.status(405).json({
      apiVersion: 'v1',
      statusCode: 405,
      shortMessage: 'Method Not Allowed',
      description: 'Only GET and POST methods are allowed',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: '/api/integrations'
    });
  }
}
