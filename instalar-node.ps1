# Instala Node.js automaticamente via winget
# Execute como Administrador: clique direito -> Executar com PowerShell

Write-Host "Instalando Node.js..." -ForegroundColor Green
winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements

Write-Host ""
Write-Host "Pronto! Feche o Cursor e abra de novo. Depois execute INICIAR.bat" -ForegroundColor Yellow
