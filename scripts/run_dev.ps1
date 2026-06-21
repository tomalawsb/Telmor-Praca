$ErrorActionPreference = 'Stop'

Write-Host "=== Telmor Praca PWA - tryb DEV ===" -ForegroundColor Cyan

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "Nie znaleziono npm. Zainstaluj Node.js, potem uruchom skrypt ponownie."
}

if (-not (Test-Path "node_modules")) {
    npm install
}

npm run dev
