@echo off
REM Script para iniciar tanto Backend quanto Frontend do CMMS (Windows)

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%Cmms"
set "FRONTEND_DIR=%ROOT%frontend"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║        CMMS - Sistema de Gerenciamento de Equipamentos        ║
echo ║            Iniciando Backend e Frontend                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo [1/2] Iniciando Backend (Spring Boot)...
if exist "%BACKEND_DIR%\mvnw.cmd" (
    start "CMMS Backend" /d "%BACKEND_DIR%" cmd.exe /k mvnw.cmd spring-boot:run
) else (
    start "CMMS Backend" /d "%BACKEND_DIR%" cmd.exe /k mvn spring-boot:run
)

timeout /t 10 /nobreak

echo.
echo [2/2] Iniciando Frontend...
start "CMMS Frontend" /d "%FRONTEND_DIR%" cmd.exe /k python server.py

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  Backend:  http://localhost:8080                              ║
echo ║  Frontend: http://localhost:3000                              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

pause
