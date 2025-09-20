# GitHub MCP Server for DocGO

Model Context Protocol server for GitHub operations, designed specifically for DocGO workflow automation.

## Features

- Create pull requests
- Merge pull requests
- List pull requests
- Get pull request details
- Create branches
- Get repository information

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your GitHub token
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Run the server**:
   ```bash
   npm start
   ```

## GitHub Token Setup

Create a Personal Access Token with the following scopes:
- `repo` - Full control of private repositories
- `workflow` - Update GitHub Action workflows
- `admin:org` - Full control of orgs and teams (if working with org repos)

## Usage with Cursor

Add to your Cursor MCP configuration:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["path/to/github-mcp-server/dist/esm/index.js"],
      "env": {
        "GITHUB_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Available Tools

### create_pull_request
Create a new pull request.

**Parameters**:
- `title` (string): PR title
- `body` (string, optional): PR description
- `head` (string): Source branch name
- `base` (string): Target branch name
- `owner` (string): Repository owner
- `repo` (string): Repository name

### merge_pull_request
Merge a pull request.

**Parameters**:
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `pull_number` (number): Pull request number
- `merge_method` (string, optional): 'merge', 'squash', or 'rebase'

### get_pull_request
Get pull request details.

**Parameters**:
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `pull_number` (number): Pull request number

### list_pull_requests
List pull requests for a repository.

**Parameters**:
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `state` (string, optional): 'open', 'closed', or 'all'
- `head` (string, optional): Filter by source branch
- `base` (string, optional): Filter by target branch

### create_branch
Create a new branch.

**Parameters**:
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `branch` (string): New branch name
- `sha` (string, optional): SHA to create branch from

### get_repository
Get repository information.

**Parameters**:
- `owner` (string): Repository owner
- `repo` (string): Repository name

## Error Handling

The server includes comprehensive error handling for:
- Authentication issues
- Rate limiting
- Network connectivity
- Invalid parameters
- GitHub API errors

## Development

```bash
# Run tests
npm test

# Check code quality
npm run check

# Fix code issues
npm run fix
```
