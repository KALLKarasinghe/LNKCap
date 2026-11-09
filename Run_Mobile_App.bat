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

echo [1/3] Detecting Local Wi-Fi IP address...
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi*','Ethernet*' | Where-Object { $_.IPAddress -notlike '169.254*' } | Select-Object -First 1).IPAddress"`) do set LOCAL_IP=%%i

if "%LOCAL_IP%"=="" set LOCAL_IP=localhost

echo.
echo =====================================================================
echo   Local PC Access   : http://localhost:5173/
echo   Mobile Phone URL  : http://%LOCAL_IP%:5173/
echo =====================================================================
echo.
echo * Open the Mobile Phone URL above on your Android phone (Chrome / Brave)
echo   while connected to the same Wi-Fi network!
echo.
echo   Then tap "Install App" or "Add to Home screen" to install LNKcap
echo   directly as an App on your Android phone!
echo.
echo [2/3] Opening Browser...
start "" "http://localhost:5173"

echo.
echo [3/3] Starting LNKcap Mobile Server...
call npm run dev

pause
