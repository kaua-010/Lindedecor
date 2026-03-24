@echo off
echo LineDecor - Iniciando servidor...
echo.
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Baixe e instale o Node.js em: https://nodejs.org
    echo Depois feche e reabra este arquivo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Instalando dependencias... Aguarde.
    call npm install
    echo.
)

echo Iniciando servidor...
echo.
echo Acesse a loja em: http://localhost:3000/index.html
echo Admin em: http://localhost:3000/admin.html
echo.
node server.js

pause
