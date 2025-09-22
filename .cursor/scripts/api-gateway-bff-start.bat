@echo off
echo ========================================
echo    DocGO API Gateway BFF
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18.0.0 or higher
    pause
    exit /b 1
)

echo Checking if .env file exists...
if not exist ".env" (
    echo Creating .env file from template...
    copy "env_example.txt" ".env"
    echo.
    echo Please edit .env file with your configuration
    echo Press any key to continue...
    pause
)

echo.
echo Installing dependencies...
call npm install

echo.
echo Starting API Gateway BFF...
echo.
echo Service will be available at:
echo - Homepage: http://localhost:8000
echo - Health Check: http://localhost:8000/api/health
echo - API Base: http://localhost:8000/api/v1/
echo.
echo Press Ctrl+C to stop the service
echo.

call npm run dev
