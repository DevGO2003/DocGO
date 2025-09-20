# Git Push Private with GitHub MCP Integration

Enhanced version of git-push-private workflow with GitHub MCP server integration for automated PR creation and management.

## Prerequisites

1. **GitHub MCP Server Setup**:
   - GitHub MCP server must be running
   - Valid `GITHUB_TOKEN` configured
   - Cursor MCP configuration updated

2. **Environment Variables**:
   ```bash
   GITHUB_TOKEN=your_github_token_here
   DEFAULT_OWNER=DevGO2003
   DEFAULT_REPO=DocGO
   ```

## Enhanced Workflow

### 1. Standard Git Operations (Same as before)
- Backup env files
- Push code to origin (exclude env)
- Force-add env and push to private

### 2. GitHub MCP Integration
- **Auto-create PR**: Automatically create PR from `private/thaiGO` to `private/main`
- **Auto-merge PR**: Optionally auto-merge after validation
- **Status monitoring**: Check PR status and provide feedback

## Usage

### Basic Usage (with MCP)
```bash
/git-push-private-github
```

### With Auto-merge
```bash
/git-push-private-github --auto-merge
```

### With Custom PR Details
```bash
/git-push-private-github --title "Custom PR Title" --body "Custom description"
```

## MCP Tools Available

### 1. create_pull_request
- **Purpose**: Create PR from current branch to target branch
- **Auto-parameters**: Uses current branch as head, main as base
- **Custom parameters**: title, body, head, base, owner, repo

### 2. merge_pull_request
- **Purpose**: Merge PR after validation
- **Parameters**: owner, repo, pull_number, merge_method

### 3. get_pull_request
- **Purpose**: Get PR details and status
- **Use case**: Verify PR was created successfully

### 4. list_pull_requests
- **Purpose**: List PRs for monitoring
- **Filters**: state, head, base

## Error Handling

### GitHub API Errors
- **Rate limiting**: Automatic retry with exponential backoff
- **Authentication**: Clear error messages for token issues
- **Network**: Fallback to manual workflow

### MCP Server Issues
- **Server down**: Fallback to manual PR creation
- **Tool errors**: Detailed error reporting
- **Timeout**: Graceful degradation

## Workflow Steps

1. **Pre-flight checks**:
   - Verify GitHub MCP server is running
   - Check GitHub token validity
   - Validate repository access

2. **Standard Git operations**:
   - Backup env files
   - Push code to origin
   - Push env to private

3. **GitHub MCP operations**:
   - Create PR from `private/thaiGO` to `private/main`
   - Get PR details for verification
   - Optionally merge PR

4. **Post-processing**:
   - Clean up local history
   - Report success/failure
   - Provide PR links

## Configuration

### Cursor MCP Config
```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["mcp-server/github-mcp-server/dist/esm/index.js"],
      "env": {
        "GITHUB_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Environment Variables
```bash
# Required
GITHUB_TOKEN=ghp_your_token_here

# Optional
DEFAULT_OWNER=DevGO2003
DEFAULT_REPO=DocGO
```

## Troubleshooting

### Common Issues

1. **MCP Server Not Running**:
   ```bash
   cd mcp-server/github-mcp-server
   npm start
   ```

2. **Invalid GitHub Token**:
   - Check token permissions (repo, workflow, admin:org)
   - Verify token is not expired
   - Test with GitHub API directly

3. **Repository Access Issues**:
   - Verify token has access to target repository
   - Check repository permissions
   - Ensure repository exists

4. **PR Creation Fails**:
   - Check if PR already exists
   - Verify branch names are correct
   - Check for merge conflicts

### Debug Mode
```bash
# Enable debug logging
export DEBUG=github-mcp:*
/git-push-private-github
```

## Benefits

1. **Automation**: Reduces manual steps in PR creation
2. **Consistency**: Standardized PR titles and descriptions
3. **Error Handling**: Better error reporting and recovery
4. **Integration**: Seamless integration with Cursor AI
5. **Monitoring**: Real-time status updates

## Future Enhancements

1. **Auto-review**: Integration with code review tools
2. **Auto-deploy**: Trigger deployment after merge
3. **Notifications**: Slack/Teams notifications
4. **Metrics**: Track PR creation and merge statistics
5. **Templates**: Customizable PR templates
