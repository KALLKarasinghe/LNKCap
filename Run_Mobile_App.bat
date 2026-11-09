@echo off
title LNKcap Mobile Studio
color 0B
cls
echo =====================================================================
echo                     LNKcap Mobile Studio
echo           Sinhala AI Caption Studio for Mobile Creators
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js and dependencies...
if not exist "node_modules\" (
    echo Installing dependencies for the first time...
    call npm install
)

echo.
echo [2/3] Detecting Local Wi-Fi IP address for your Mobile Phone...
for /f "tokens=4" %%a in ('route print^|find " 0.0.0.0"') do set LOCAL_IP=%%a
echo.
echo =====================================================================
echo   Local PC Access   : http://localhost:5173/
echo   Mobile Phone URL  : http://%LOCAL_IP%:5173/
echo =====================================================================
echo.
echo * Open the Mobile Phone URL above on your phone (Chrome / Safari)
echo   while connected to the same Wi-Fi network!
echo.
echo [3/3] Starting LNKcap Mobile Server...
start "" "http://localhost:5173"
call npm run dev

pause
