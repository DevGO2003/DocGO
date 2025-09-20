[INFO]  Git Push Private - Safe Version
[INFO]  Current branch: 
[INFO]  Backup .env files...
[SUCCESS]  Backup 
[INFO]  Remove .env files from Git tracking...
rm 'backend/ai-processing-service/env/.env'
[SUCCESS]  Removed from tracking: 
rm 'backend/ai-processing-service/env/.env.example'
[SUCCESS]  Removed from tracking: 
rm 'backend/api-gateway-bff/env/.env'
[SUCCESS]  Removed from tracking: 
rm 'backend/api-gateway-bff/env/.env.example'
[SUCCESS]  Removed from tracking: 
rm 'backend/authentication-identity-service/env/.env'
[SUCCESS]  Removed from tracking: 
rm 'backend/authentication-identity-service/env/.env.example'
[SUCCESS]  Removed from tracking: 
rm 'backend/contract-management-service/env/.env'
[SUCCESS]  Removed from tracking: 
rm 'backend/contract-management-service/env/.env.example'
[SUCCESS]  Removed from tracking: 
rm 'backend/file-storage-asset-service/env/.env'
[SUCCESS]  Removed from tracking: 
rm 'backend/file-storage-asset-service/env/.env.example'
[SUCCESS]  Removed from tracking: 
rm 'frontend/web/env/.env'
[SUCCESS]  Removed from tracking: 
rm 'frontend/web/env/.env.example'
[SUCCESS]  Removed from tracking: 
rm 'frontend/web_nextjs/env/.env'
[SUCCESS]  Removed from tracking: 
rm 'frontend/web_nextjs/env/.env.example'
[SUCCESS]  Removed from tracking: 
rm 'mcp-server/google-cloud/env/.env'
[SUCCESS]  Removed from tracking: 
rm 'mcp-server/google-cloud/env/.env.example'
[SUCCESS]  Removed from tracking: 
rm 'mcp-server/mongodb/env/.env'
[SUCCESS]  Removed from tracking: 
rm 'mcp-server/mongodb/env/.env.example'
[SUCCESS]  Removed from tracking: 
rm 'mcp-server/oauth2/env/.env'
[SUCCESS]  Removed from tracking: 
rm 'mcp-server/oauth2/env/.env.example'
[SUCCESS]  Removed from tracking: 
rm 'mcp-server/postgresql/env/.env'
[SUCCESS]  Removed from tracking: 
[INFO]  Commit changes...
[thaiGO 646c36f] Code changes - Auto push by git-push-private-safe.ps1 - Branch: thaiGO
 21 files changed, 30 insertions(+), 343 deletions(-)
 delete mode 100644 backend/ai-processing-service/env/.env
 delete mode 100644 backend/api-gateway-bff/env/.env
 delete mode 100644 backend/api-gateway-bff/env/.env.example
 delete mode 100644 backend/authentication-identity-service/env/.env
 delete mode 100644 backend/contract-management-service/env/.env
 delete mode 100644 backend/file-storage-asset-service/env/.env
 delete mode 100644 backend/file-storage-asset-service/env/.env.example
 delete mode 100644 frontend/web/env/.env
 delete mode 100644 frontend/web/env/.env.example
 delete mode 100644 frontend/web_nextjs/env/.env
 delete mode 100644 frontend/web_nextjs/env/.env.example
 delete mode 100644 mcp-server/google-cloud/env/.env
 delete mode 100644 mcp-server/google-cloud/env/.env.example
 delete mode 100644 mcp-server/mongodb/env/.env
 delete mode 100644 mcp-server/mongodb/env/.env.example
 delete mode 100644 mcp-server/oauth2/env/.env
 delete mode 100644 mcp-server/oauth2/env/.env.example
 delete mode 100644 mcp-server/postgresql/env/.env
 create mode 100644 script/git-push-private-safe.ps1
[SUCCESS]  Committed changes
[INFO]  Push to origin...
[SUCCESS]  Pushed to origin/
[INFO]  Push .env files to private...
[thaiGO 254059b] Environment files - Private sync - Added 42 .env files - Branch: thaiGO
 39 files changed, 680 insertions(+)
 create mode 100644 .git-backup/env/20250920_212301/backend/ai-processing-service/env/.env
 create mode 100644 .git-backup/env/20250920_212301/backend/ai-processing-service/env/.env.example
 create mode 100644 .git-backup/env/20250920_212301/backend/api-gateway-bff/env/.env
 create mode 100644 .git-backup/env/20250920_212301/backend/api-gateway-bff/env/.env.example
 create mode 100644 .git-backup/env/20250920_212301/backend/authentication-identity-service/env/.env
 create mode 100644 .git-backup/env/20250920_212301/backend/authentication-identity-service/env/.env.example
 create mode 100644 .git-backup/env/20250920_212301/backend/contract-management-service/env/.env
 create mode 100644 .git-backup/env/20250920_212301/backend/contract-management-service/env/.env.example
 create mode 100644 .git-backup/env/20250920_212301/backend/file-storage-asset-service/env/.env
 create mode 100644 .git-backup/env/20250920_212301/backend/file-storage-asset-service/env/.env.example
 create mode 100644 .git-backup/env/20250920_212301/frontend/web/env/.env
 create mode 100644 .git-backup/env/20250920_212301/frontend/web/env/.env.example
 create mode 100644 .git-backup/env/20250920_212301/frontend/web_nextjs/env/.env
 create mode 100644 .git-backup/env/20250920_212301/frontend/web_nextjs/env/.env.example
 create mode 100644 .git-backup/env/20250920_212301/mcp-server/google-cloud/env/.env
 create mode 100644 .git-backup/env/20250920_212301/mcp-server/google-cloud/env/.env.example
 create mode 100644 .git-backup/env/20250920_212301/mcp-server/mongodb/env/.env
 create mode 100644 .git-backup/env/20250920_212301/mcp-server/mongodb/env/.env.example
 create mode 100644 .git-backup/env/20250920_212301/mcp-server/oauth2/env/.env
 create mode 100644 .git-backup/env/20250920_212301/mcp-server/oauth2/env/.env.example
 create mode 100644 .git-backup/env/20250920_212301/mcp-server/postgresql/env/.env
 create mode 100644 backend/ai-processing-service/env/.env
 create mode 100644 backend/api-gateway-bff/env/.env
 create mode 100644 backend/api-gateway-bff/env/.env.example
 create mode 100644 backend/authentication-identity-service/env/.env
 create mode 100644 backend/contract-management-service/env/.env
 create mode 100644 backend/file-storage-asset-service/env/.env
 create mode 100644 backend/file-storage-asset-service/env/.env.example
 create mode 100644 frontend/web/env/.env
 create mode 100644 frontend/web/env/.env.example
 create mode 100644 frontend/web_nextjs/env/.env
 create mode 100644 frontend/web_nextjs/env/.env.example
 create mode 100644 mcp-server/google-cloud/env/.env
 create mode 100644 mcp-server/google-cloud/env/.env.example
 create mode 100644 mcp-server/mongodb/env/.env
 create mode 100644 mcp-server/mongodb/env/.env.example
 create mode 100644 mcp-server/oauth2/env/.env
 create mode 100644 mcp-server/oauth2/env/.env.example
 create mode 100644 mcp-server/postgresql/env/.env
[SUCCESS]  Committed .env files
[SUCCESS]  Pushed to private/
[INFO]  Safe cleanup (keeping .env files)...
Unstaged changes after reset:
M	script/git-push-private-safe.ps1
[SUCCESS]  Cleaned up local history (kept .env files)
[INFO]  Verifying .env files...
[SUCCESS]  Verified 
[SUCCESS]  Git Push Private completed successfully!
[INFO]  Summary:
[INFO]    - Origin: origin/
[INFO]    - Private: private/
[INFO]    - .env files: PRESERVED
