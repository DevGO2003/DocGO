const fs = require('fs');
const path = require('path');

/**
 * Load environment variables from env directory
 * Priority: .env > default
 */
function loadEnvFiles() {
  // Load .env from root directory
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    loadEnvFile(envPath);
    console.log('✅ Loaded .env from', envPath);
  }
  
  // Also try env directory for backward compatibility
  const envDir = path.join(__dirname, '..', 'env');
  const envDirPath = path.join(envDir, '.env');
  if (fs.existsSync(envDirPath)) {
    loadEnvFile(envDirPath);
    console.log('✅ Loaded .env from', envDirPath);
  }
}

function loadEnvFile(filePath) {
  try {
    const envContent = fs.readFileSync(filePath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          // Only set if not already set (respect priority)
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    });
  } catch (error) {
    console.error('❌ Failed to load environment file:', filePath, error.message);
  }
}

// Load env files when this module is imported
loadEnvFiles();

module.exports = { loadEnvFiles, loadEnvFile };
