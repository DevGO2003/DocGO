#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { GitHubService } from './github-service.js';
import { z } from 'zod';

// GitHub MCP Server for DocGO
class GitHubMCPServer {
  private server: Server;
  private githubService: GitHubService;

  constructor() {
    this.server = new Server(
      {
        name: 'github-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.githubService = new GitHubService();
    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_pull_request',
            description: 'Create a pull request on GitHub',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'PR title',
                },
                body: {
                  type: 'string',
                  description: 'PR description',
                },
                head: {
                  type: 'string',
                  description: 'Source branch name',
                },
                base: {
                  type: 'string',
                  description: 'Target branch name',
                },
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
              },
              required: ['title', 'head', 'base', 'owner', 'repo'],
            },
          },
          {
            name: 'merge_pull_request',
            description: 'Merge a pull request on GitHub',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                pull_number: {
                  type: 'number',
                  description: 'Pull request number',
                },
                merge_method: {
                  type: 'string',
                  enum: ['merge', 'squash', 'rebase'],
                  description: 'Merge method',
                },
              },
              required: ['owner', 'repo', 'pull_number'],
            },
          },
          {
            name: 'get_pull_request',
            description: 'Get pull request details',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                pull_number: {
                  type: 'number',
                  description: 'Pull request number',
                },
              },
              required: ['owner', 'repo', 'pull_number'],
            },
          },
          {
            name: 'list_pull_requests',
            description: 'List pull requests for a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                state: {
                  type: 'string',
                  enum: ['open', 'closed', 'all'],
                  description: 'PR state filter',
                },
                head: {
                  type: 'string',
                  description: 'Filter by source branch',
                },
                base: {
                  type: 'string',
                  description: 'Filter by target branch',
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'create_branch',
            description: 'Create a new branch on GitHub',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                branch: {
                  type: 'string',
                  description: 'New branch name',
                },
                sha: {
                  type: 'string',
                  description: 'SHA to create branch from (default: main)',
                },
              },
              required: ['owner', 'repo', 'branch'],
            },
          },
          {
            name: 'get_repository',
            description: 'Get repository information',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
              },
              required: ['owner', 'repo'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_pull_request':
            return await this.githubService.createPullRequest(args);
          
          case 'merge_pull_request':
            return await this.githubService.mergePullRequest(args);
          
          case 'get_pull_request':
            return await this.githubService.getPullRequest(args);
          
          case 'list_pull_requests':
            return await this.githubService.listPullRequests(args);
          
          case 'create_branch':
            return await this.githubService.createBranch(args);
          
          case 'get_repository':
            return await this.githubService.getRepository(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub MCP Server running on stdio');
  }
}

// Start server
const server = new GitHubMCPServer();
server.run().catch(console.error);
