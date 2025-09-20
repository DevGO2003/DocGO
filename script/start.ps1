# DocGO Development Environment
Write-Host "🚀 Starting DocGO Development Environment..." -ForegroundColor Green
Write-Host ""

# Check Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Start services
Write-Host "🚀 Starting services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Show status
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✅ Development environment started!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Services:" -ForegroundColor Cyan
Write-Host "  - API Gateway BFF: http://localhost:8000" -ForegroundColor White
Write-Host "  - Frontend Web: http://localhost:3000" -ForegroundColor White
Write-Host "  - Authentication Service: http://localhost:8001" -ForegroundColor White
Write-Host "  - Contract Management: http://localhost:8002" -ForegroundColor White
Write-Host "  - AI Processing: http://localhost:8003" -ForegroundColor White
Write-Host "  - File Storage: http://localhost:8004" -ForegroundColor White
Write-Host "  - Redis: localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "📝 Logs: docker-compose logs -f" -ForegroundColor Gray
Write-Host "🛑 Stop: docker-compose down" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to continue"
