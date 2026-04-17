@echo off
REM Script para iniciar tanto Backend quanto Frontend do CMMS (Windows)

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║        CMMS - Sistema de Gerenciamento de Equipamentos        ║
echo ║            Iniciando Backend e Frontend                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Iniciando Backend em uma nova janela
echo [1/2] Iniciando Backend (Spring Boot)...
cd Cmms
if exist mvnw.cmd (
    echo ✓ Maven Wrapper encontrado
    start "CMMS Backend" cmd.exe /k mvnw.cmd spring-boot:run
) else (
    echo ⚠ Maven Wrapper não encontrado. Tentando com mvn...
    start "CMMS Backend" cmd.exe /k mvn spring-boot:run
)

cd ..

REM Aguardar um pouco para o backend iniciar
timeout /t 10 /nobreak

REM Iniciando Frontend em uma nova janela
echo.
echo [2/2] Iniciando Frontend (HTML/CSS/JavaScript)...
cd frontend

echo ✓ Iniciando servidor HTTP na porta 3000...
start "CMMS Frontend" cmd.exe /k python server.py

cd ..

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ✓  PRONTO!                                                  ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║  Backend:  http://localhost:8080                              ║
echo ║  Frontend: http://localhost:3000                              ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║  - Abra http://localhost:3000 em seu navegador                ║
echo ║  - Verifique o console para mensagens de erro                 ║
echo ║  - Para parar, feche as janelas do Prompt de Comando          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

pause
