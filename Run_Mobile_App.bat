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

echo [1/2] Detecting Network...
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi*','Ethernet*' | Where-Object { $_.IPAddress -notlike '169.254*' } | Select-Object -First 1).IPAddress"`) do set LOCAL_IP=%%i

if "%LOCAL_IP%"=="" set LOCAL_IP=localhost

echo.
echo =====================================================================
echo   Local PC Access   : http://localhost:5173/
echo   Mobile Phone URL  : http://%LOCAL_IP%:5173/
echo =====================================================================
echo.
echo * IMPORTANT: If the page does not load on your phone:
echo   Make sure your PC's Wi-Fi network profile is set to "Private network"
echo   (Windows Settings -^> Network ^& internet -^> Wi-Fi -^> Private network).
echo.
echo [2/2] Starting LNKcap Mobile Server...
start "" "http://localhost:5173"
call npm run dev

pause
