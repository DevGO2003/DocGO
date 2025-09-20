# DocGO MCP Servers

This directory contains Model Context Protocol (MCP) servers for the DocGO project.

## Available MCP Servers

### 1. MongoDB MCP Server (Port 8005)
- **Purpose**: Database operations with MongoDB Atlas
- **Connection**: `mongodb+srv://root:sapassword@devgo-docgo-cluster0.hsudzga.mongodb.net/`
- **Features**: CRUD operations, query execution, schema management

### 2. Google Cloud MCP Server (Port 8006)
- **Purpose**: Google Cloud Platform integration
- **Account**: `congty.devgo2003@gmail.com`
- **Project**: `docgoauthen`
- **Features**: GCP APIs, BigQuery, Cloud Storage, OAuth2

### 3. OAuth2 MCP Server (Port 8007)
- **Purpose**: OAuth2 authentication flows
- **Provider**: Google OAuth2
- **Client ID**: `183573622288-0tu123mj11i40sgr7i0l1jsuqppnolkn.apps.googleusercontent.com`
- **Features**: Authentication, token management, user info

### 4. PostgreSQL MCP Server (Port 8008)
- **Purpose**: PostgreSQL database operations
- **Database**: `docgo_db`
- **User**: `docgo_user`
- **Features**: SQL queries, schema management, data operations

### 5. Filesystem MCP Server (Port 8009)
- **Purpose**: Secure file system access
- **Allowed Directory**: `/app/docgo` (DocGO project root)
- **Features**: File read/write, directory listing, file operations

## Configuration

Each MCP server is configured in `docker-compose.local.yml` with:
- Environment variables
- Volume mounts
- Network access
- Health checks

## Usage

Start all MCP servers:
```bash
docker-compose -f docker-compose.local.yml up -d
```

Check server status:
```bash
docker-compose -f docker-compose.local.yml ps
```

View server logs:
```bash
docker-compose -f docker-compose.local.yml logs [server-name]
```

## Security Notes

- Google Cloud credentials are mounted from `./credentials/` directory
- OAuth2 secrets are configured via environment variables
- Filesystem access is restricted to DocGO project directory
- Database connections use secure connection strings

## Development

Each server has its own `package.json` for dependency management:
- Install dependencies: `npm install`
- Start server: `npm start`
- Debug mode: `npm run dev`