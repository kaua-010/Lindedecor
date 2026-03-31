@echo off
title LineDecor - Abrindo Site
cd /d "%~dp0"

echo.
echo Abrindo a loja LineDecor no navegador...
echo.
echo Se o servidor Node nao estiver rodando, a loja funcionara
echo em modo demonstracao (produtos e carrinho funcionam).
echo.
echo Para o sistema completo com banco de dados e emails,
echo instale o Node.js e execute INICIAR.bat
echo.

start "" "%~dp0public\index.html"

timeout /t 2 >nul
