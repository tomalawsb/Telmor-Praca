$ErrorActionPreference = 'Stop'

Write-Host "=== Telmor Praca PWA - build GitHub Pages ===" -ForegroundColor Cyan

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "Nie znaleziono npm. Zainstaluj Node.js, potem uruchom skrypt ponownie."
}

if (-not (Test-Path "node_modules")) {
    npm install
}

npm run build
if ($LASTEXITCODE -ne 0) { throw "Build zakonczyl sie bledem $LASTEXITCODE." }

Write-Host "Gotowe. Pliki produkcyjne sa w katalogu dist." -ForegroundColor Green
