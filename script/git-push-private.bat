@echo off
REM Git Push Private - Batch wrapper for PowerShell script
REM Usage: git-push-private.bat [additional-branch]

setlocal

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"

REM Change to project root (parent of script directory)
cd /d "%SCRIPT_DIR%.."

REM Run the PowerShell script with bypass execution policy
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%git-push-private-safe.ps1" %*

endlocal
