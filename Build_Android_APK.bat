@echo off
title LNKcap Mobile - Build Android APK
color 0A
cls
echo =====================================================================
echo                 LNKcap Mobile - Android APK Builder
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Setting Java JDK 21 Environment...
set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.10"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo.
echo [2/3] Building Web Assets & Syncing to Android project...
call npm run build
call npx cap sync android

echo.
echo [3/3] Building Android APK with Gradle...
cd android

if exist "local.properties" (
    goto :BUILD_GRADLE
)

if not "%ANDROID_HOME%"=="" (
    goto :BUILD_GRADLE
)

if exist "%LOCALAPPDATA%\Android\Sdk" (
    echo sdk.dir=%LOCALAPPDATA:\=\\%\\Android\\Sdk> local.properties
    goto :BUILD_GRADLE
)

echo.
echo [NOTICE] Android SDK path was not automatically detected.
echo Opening the native Android project in Android Studio...
cd ..
call npx cap open android
goto :END

:BUILD_GRADLE
echo Running Gradle assembleDebug...
call gradlew.bat assembleDebug

if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo =====================================================================
    echo [SUCCESS] Android APK built successfully!
    echo.
    copy /y "app\build\outputs\apk\debug\app-debug.apk" "..\LNKcap-Mobile.apk"
    echo Saved to: %~dp0LNKcap-Mobile.apk
    echo Transfer this .apk file to your Android phone to install!
    echo =====================================================================
) else (
    echo.
    echo Gradle build completed or needs Android Studio. Opening project...
    cd ..
    call npx cap open android
)

:END
echo.
pause
