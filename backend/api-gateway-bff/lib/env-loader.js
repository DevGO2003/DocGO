const fs = require('fs');
const path = require('path');

/**
 * Load environment variables from env directory
 * Priority: .env.local > .env > default
 */
function loadEnvFiles() {
  const envDir = path.join(__dirname, '..', 'env');
  
  // Load .env.local first (highest priority)
  const envLocalPath = path.join(envDir, '.env.local');
  if (fs.existsSync(envLocalPath)) {
    loadEnvFile(envLocalPath);
    console.log('✅ Loaded .env.local from', envLocalPath);
  }
  
  // Then load .env
  const envPath = path.join(envDir, '.env');
  if (fs.existsSync(envPath)) {
    loadEnvFile(envPath);
    console.log('✅ Loaded .env from', envPath);
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
