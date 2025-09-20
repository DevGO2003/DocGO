@echo off
echo 🚀 Starting DocGO Development Environment...
echo.

REM Check Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Start services
echo 🚀 Starting services...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 15 /nobreak >nul

REM Show status
echo 📊 Service Status:
docker-compose ps

echo.
echo ✅ Development environment started!
echo.
echo 🌐 Services:
echo   - API Gateway BFF: http://localhost:8000
echo   - Frontend Web: http://localhost:3000
echo   - Authentication Service: http://localhost:8001
echo   - Contract Management: http://localhost:8002
echo   - AI Processing: http://localhost:8003
echo   - File Storage: http://localhost:8004
echo   - Redis: localhost:6379
echo.
echo 📝 Logs: docker-compose logs -f
echo 🛑 Stop: docker-compose down
echo.
pause
