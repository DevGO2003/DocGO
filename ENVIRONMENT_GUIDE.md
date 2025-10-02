# Environment Configuration Guide

## Overview
This project uses a hybrid environment configuration approach:
- **Production**: Real values in `.env` files (git-ignored)
- **Development**: Template values in `.env.template` files (git-tracked)

## File Structure
```
DocGO-private/
├── .env                    # Production values (git-ignored)
├── .env.template          # Development template (git-tracked)
└── backend/
    ├── api-gateway/
    │   ├── .env           # Production values (git-ignored)
    │   ├── .env.example   # Service-specific template (git-tracked)
    │   └── .env.template  # Development template (git-tracked)
    ├── user-management-service/
    │   ├── .env           # Production values (git-ignored)
    │   ├── .env.example   # Service-specific template (git-tracked)
    │   └── .env.template  # Development template (git-tracked)
    ├── document-management-service/
    │   ├── .env           # Production values (git-ignored)
    │   ├── .env.example   # Service-specific template (git-tracked)
    │   └── .env.template  # Development template (git-tracked)
    └── automation-service/
        ├── .env           # Production values (git-ignored)
        ├── .env.example   # Service-specific template (git-tracked)
        └── .env.template  # Development template (git-tracked)
```

## Usage

### For Production
1. Copy template files to `.env`:
   ```bash
   cp .env.template .env
   cp backend/api-gateway/.env.template backend/api-gateway/.env
   cp backend/user-management-service/.env.template backend/user-management-service/.env
   cp backend/document-management-service/.env.template backend/document-management-service/.env
   cp backend/automation-service/.env.template backend/automation-service/.env
   ```

2. Replace template values with real production values:
   ```bash
   nano .env
   nano backend/[service-name]/.env
   ```

### For Development
1. Use template files directly:
   ```bash
   cp .env.template .env
   cp backend/[service-name]/.env.template backend/[service-name]/.env
   ```

2. Update with your development values:
   ```bash
   nano .env
   nano backend/[service-name]/.env
   ```

## Security Notes
- **Never commit** `.env` files with real production values
- **Always use** `.env.template` files for development
- **Rotate secrets** regularly in production
- **Use different** credentials for development vs production

## Docker Compose
Docker Compose automatically loads environment variables from:
1. Root `.env` file (infrastructure + shared secrets)
2. Service-specific `.env` files (service-specific configs)

The order ensures service-specific configs can override shared configs when needed.

## Troubleshooting
- **Service not starting**: Check if `.env` file exists and has correct values
- **Database connection failed**: Verify MongoDB URI in `.env` files
- **API key not working**: Check if real API keys are in production `.env` files
- **Template values in production**: Ensure you're using `.env` not `.env.template`
