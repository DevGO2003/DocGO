import { Octokit } from '@octokit/rest';
import { z } from 'zod';

// GitHub service for handling API operations
export class GitHubService {
  private octokit: Octokit;

  constructor() {
    // Initialize with token from environment
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }

    this.octokit = new Octokit({
      auth: token,
    });
  }

  // Create pull request
  async createPullRequest(args: any) {
    const schema = z.object({
      title: z.string(),
      body: z.string().optional(),
      head: z.string(),
      base: z.string(),
      owner: z.string(),
      repo: z.string(),
    });

    const { title, body, head, base, owner, repo } = schema.parse(args);

    try {
      const response = await this.octokit.rest.pulls.create({
        owner,
        repo,
        title,
        body: body || '',
        head,
        base,
      });

      return {
        content: [
          {
            type: 'text',
            text: `✅ Pull request created successfully!\n\n` +
                  `PR #${response.data.number}: ${response.data.title}\n` +
                  `URL: ${response.data.html_url}\n` +
                  `Status: ${response.data.state}\n` +
                  `Head: ${response.data.head.ref} → Base: ${response.data.base.ref}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to create PR: ${error.message}`);
    }
  }

  // Merge pull request
  async mergePullRequest(args: any) {
    const schema = z.object({
      owner: z.string(),
      repo: z.string(),
      pull_number: z.number(),
      merge_method: z.enum(['merge', 'squash', 'rebase']).optional(),
    });

    const { owner, repo, pull_number, merge_method = 'merge' } = schema.parse(args);

    try {
      const response = await this.octokit.rest.pulls.merge({
        owner,
        repo,
        pull_number,
        merge_method,
      });

      return {
        content: [
          {
            type: 'text',
            text: `✅ Pull request #${pull_number} merged successfully!\n\n` +
                  `Merge method: ${merge_method}\n` +
                  `Merged commit: ${response.data.sha}\n` +
                  `Message: ${response.data.message}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to merge PR: ${error.message}`);
    }
  }

  // Get pull request details
  async getPullRequest(args: any) {
    const schema = z.object({
      owner: z.string(),
      repo: z.string(),
      pull_number: z.number(),
    });

    const { owner, repo, pull_number } = schema.parse(args);

    try {
      const response = await this.octokit.rest.pulls.get({
        owner,
        repo,
        pull_number,
      });

      const pr = response.data;
      return {
        content: [
          {
            type: 'text',
            text: `📋 Pull Request #${pr.number}: ${pr.title}\n\n` +
                  `Status: ${pr.state}\n` +
                  `Head: ${pr.head.ref} → Base: ${pr.base.ref}\n` +
                  `Author: ${pr.user?.login}\n` +
                  `Created: ${pr.created_at}\n` +
                  `Updated: ${pr.updated_at}\n` +
                  `URL: ${pr.html_url}\n\n` +
                  `Description:\n${pr.body || 'No description'}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get PR: ${error.message}`);
    }
  }

  // List pull requests
  async listPullRequests(args: any) {
    const schema = z.object({
      owner: z.string(),
      repo: z.string(),
      state: z.enum(['open', 'closed', 'all']).optional(),
      head: z.string().optional(),
      base: z.string().optional(),
    });

    const { owner, repo, state = 'open', head, base } = schema.parse(args);

    try {
      const response = await this.octokit.rest.pulls.list({
        owner,
        repo,
        state,
        head,
        base,
        per_page: 10,
      });

      const prs = response.data;
      if (prs.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No pull requests found for ${owner}/${repo}`,
            },
          ],
        };
      }

      const prList = prs.map(pr => 
        `#${pr.number}: ${pr.title} (${pr.state})\n` +
        `  Head: ${pr.head.ref} → Base: ${pr.base.ref}\n` +
        `  Author: ${pr.user?.login}\n` +
        `  URL: ${pr.html_url}`
      ).join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text: `📋 Pull Requests for ${owner}/${repo}:\n\n${prList}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to list PRs: ${error.message}`);
    }
  }

  // Create branch
  async createBranch(args: any) {
    const schema = z.object({
      owner: z.string(),
      repo: z.string(),
      branch: z.string(),
      sha: z.string().optional(),
    });

    const { owner, repo, branch, sha } = schema.parse(args);

    try {
      // Get default branch if sha not provided
      let targetSha = sha;
      if (!targetSha) {
        const repoInfo = await this.octokit.rest.repos.get({ owner, repo });
        const defaultBranch = repoInfo.data.default_branch;
        const ref = await this.octokit.rest.git.getRef({
          owner,
          repo,
          ref: `heads/${defaultBranch}`,
        });
        targetSha = ref.data.object.sha;
      }

      // Create new branch
      await this.octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha: targetSha,
      });

      return {
        content: [
          {
            type: 'text',
            text: `✅ Branch '${branch}' created successfully!\n\n` +
                  `Repository: ${owner}/${repo}\n` +
                  `Based on: ${targetSha}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to create branch: ${error.message}`);
    }
  }

  // Get repository information
  async getRepository(args: any) {
    const schema = z.object({
      owner: z.string(),
      repo: z.string(),
    });

    const { owner, repo } = schema.parse(args);

    try {
      const response = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      const repoInfo = response.data;
      return {
        content: [
          {
            type: 'text',
            text: `📁 Repository: ${repoInfo.full_name}\n\n` +
                  `Description: ${repoInfo.description || 'No description'}\n` +
                  `Default branch: ${repoInfo.default_branch}\n` +
                  `Private: ${repoInfo.private ? 'Yes' : 'No'}\n` +
                  `Stars: ${repoInfo.stargazers_count}\n` +
                  `Forks: ${repoInfo.forks_count}\n` +
                  `URL: ${repoInfo.html_url}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to get repository: ${error.message}`);
    }
  }
}
