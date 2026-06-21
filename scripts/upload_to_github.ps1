$ErrorActionPreference = 'Stop'

$DefaultCommitMessage = "Aktualizacja Telmor Praca PWA"

Write-Host "=== Wysyłanie projektu na GitHub ===" -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Nie znaleziono git. Zainstaluj Git i uruchom ponownie."
}

if (-not (Test-Path ".git")) {
    git init
}

git add .
git commit -m $DefaultCommitMessage

$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "Brak zdalnego repozytorium origin." -ForegroundColor Yellow
    Write-Host "Ustaw je poleceniem:" -ForegroundColor Yellow
    Write-Host "git remote add origin ADRES_REPOZYTORIUM" -ForegroundColor Yellow
    exit 1
}

git branch -M main
git push -u origin main
