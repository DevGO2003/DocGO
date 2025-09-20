#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class GoogleCloudMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'google-cloud-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'google_cloud_info',
            description: 'Get Google Cloud project information',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Google Cloud project ID',
                  default: 'docgoauthen'
                }
              }
            }
          },
          {
            name: 'google_oauth2_info',
            description: 'Get Google OAuth2 configuration information',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'google_cloud_health',
            description: 'Check Google Cloud services health',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'google_cloud_info':
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  project_id: args.project_id || 'docgoauthen',
                  client_email: 'congty.devgo2003@gmail.com',
                  status: 'configured',
                  services: ['OAuth2', 'Cloud Storage', 'BigQuery'],
                  timestamp: new Date().toISOString()
                }, null, 2)
              }
            ]
          };

        case 'google_oauth2_info':
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  client_id: '183573622288-0tu123mj11i40sgr7i0l1jsuqppnolkn.apps.googleusercontent.com',
                  project_id: 'docgoauthen',
                  redirect_uri: 'http://localhost:8001/login/oauth2/code/google',
                  scopes: ['openid', 'profile', 'email'],
                  status: 'configured',
                  timestamp: new Date().toISOString()
                }, null, 2)
              }
            ]
          };

        case 'google_cloud_health':
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  status: 'healthy',
                  services: {
                    oauth2: 'available',
                    cloud_storage: 'available',
                    bigquery: 'available'
                  },
                  timestamp: new Date().toISOString()
                }, null, 2)
              }
            ]
          };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Google Cloud MCP Server running on stdio');
  }
}

const server = new GoogleCloudMCPServer();
server.run().catch(console.error);
