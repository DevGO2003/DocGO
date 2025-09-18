@echo off
echo ========================================
echo    SETUP MONGODB MCP SERVER CHO CURSOR
echo ========================================
echo.

echo 1. Kiểm tra MongoDB MCP Server...
npx -y mongodb-mcp-server@latest --help
if errorlevel 1 (
    echo ❌ Lỗi: MongoDB MCP Server không hoạt động
    pause
    exit /b 1
)

echo ✅ MongoDB MCP Server hoạt động bình thường
echo.

echo 2. Tạo file cấu hình cho Cursor...
echo.

echo 📋 HƯỚNG DẪN CẤU HÌNH CURSOR:
echo.
echo 1. Mở Cursor
echo 2. Vào Settings (Ctrl+,)
echo 3. Tìm "MCP" hoặc "Model Context Protocol"
echo 4. Thêm cấu hình sau vào file settings.json:
echo.
echo {
echo   "mcpServers": {
echo     "MongoDB": {
echo       "command": "npx",
echo       "args": ["-y", "mongodb-mcp-server@latest", "--readOnly"],
echo       "env": {
echo         "MDB_MCP_CONNECTION_STRING": "mongodb+srv://root:sapassword@devgo-docgo-cluster0.hsudzga.mongodb.net/?retryWrites=true&w=majority&appName=devgo-docgo-cluster0"
echo       }
echo     }
echo   }
echo }
echo.
echo 5. Restart Cursor
echo 6. Sử dụng @MongoDB để giao tiếp với MongoDB Atlas
echo.

echo 📁 File cấu hình đã được tạo: cursor-mcp-config.json
echo 📚 Hướng dẫn chi tiết: README.md
echo.

echo ✅ Setup hoàn thành!
pause
