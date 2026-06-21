# upload_to_github.ps1
# Telmor Praca PWA - synchronizacja z GitHub i publikacja GitHub Pages
# Repozytorium: https://github.com/tomalawsb/Telmor-Praca
#
# Co robi skrypt:
# 1. Sprawdza Node.js, npm i Git.
# 2. Robi npm ci oraz npm run build.
# 3. Synchronizuje kod projektu na branch main.
# 4. Usuwa z main stare pliki Firebase i katalog dist.
# 5. Czyści branch gh-pages i wrzuca tam gotowe pliki z dist.
#
# Po pierwszym uruchomieniu ustaw w GitHub:
# Settings -> Pages -> Deploy from a branch -> gh-pages -> / (root)

$ErrorActionPreference = "Stop"

$RepoUrl = "https://github.com/tomalawsb/Telmor-Praca.git"
$GitUserName = "Tomasz Wolak"
$GitUserEmail = "wolak82@gmail.com"
$PagesBranch = "gh-pages"

function Stop-WithMessage($Message) {
    Write-Host ""
    Write-Host "BLAD: $Message" -ForegroundColor Red
    Write-Host ""
    if ($script:ProjectPath) {
        Set-Location $script:ProjectPath -ErrorAction SilentlyContinue
    }
    exit 1
}

function Info($Message) { Write-Host $Message -ForegroundColor Cyan }
function Ok($Message) { Write-Host $Message -ForegroundColor Green }
function Warn($Message) { Write-Host $Message -ForegroundColor Yellow }

function Test-Command($CommandName, $ErrorMessage) {
    try {
        & $CommandName --version | Out-Null
    } catch {
        Stop-WithMessage $ErrorMessage
    }
}

function Resolve-ProjectPath {
    $CurrentPath = (Get-Location).Path

    if (Test-Path (Join-Path $CurrentPath "package.json")) {
        return $CurrentPath
    }

    $ScriptPath = $PSCommandPath
    if ([string]::IsNullOrWhiteSpace($ScriptPath)) {
        $ScriptPath = $MyInvocation.ScriptName
    }

    if (-not [string]::IsNullOrWhiteSpace($ScriptPath)) {
        $ScriptDir = Split-Path -Parent $ScriptPath

        if (Test-Path (Join-Path $ScriptDir "package.json")) {
            return $ScriptDir
        }

        $ParentDir = Split-Path -Parent $ScriptDir
        if (Test-Path (Join-Path $ParentDir "package.json")) {
            return $ParentDir
        }
    }

    Stop-WithMessage "Nie moge znalezc glownego folderu projektu. Uruchom skrypt z folderu, w ktorym jest package.json."
}

function Remove-AllExceptGit($Path) {
    Get-ChildItem -LiteralPath $Path -Force | Where-Object { $_.Name -ne ".git" } | ForEach-Object {
        Remove-Item -LiteralPath $_.FullName -Recurse -Force
    }
}

function Invoke-RobocopyMirror($Source, $Destination, $ExcludeDirs, $ExcludeFiles) {
    $RoboArgs = @(
        $Source,
        $Destination,
        "/MIR",
        "/R:2",
        "/W:1",
        "/XD"
    ) + $ExcludeDirs + @("/XF") + $ExcludeFiles

    robocopy @RoboArgs | Out-Null
    $RoboCode = $LASTEXITCODE

    if ($RoboCode -gt 7) {
        Stop-WithMessage "Robocopy nie skopiowal poprawnie plikow. Kod: $RoboCode"
    }
}

function Repair-PackageLockRegistry($ProjectPath) {
    $LockPath = Join-Path $ProjectPath "package-lock.json"
    if (!(Test-Path $LockPath)) {
        return
    }

    $OldRegistry = "https://packages.applied-caas-gateway1.internal.api.openai.org/artifactory/api/npm/npm-public/"
    $NewRegistry = "https://registry.npmjs.org/"
    $Content = Get-Content $LockPath -Raw -Encoding UTF8

    if ($Content.Contains($OldRegistry)) {
        Warn "package-lock.json zawieral wewnetrzny rejestr npm z paczki testowej. Poprawiam na publiczny registry.npmjs.org."
        $Content = $Content.Replace($OldRegistry, $NewRegistry)
        Set-Content -Path $LockPath -Value $Content -Encoding UTF8
    }
}

function Invoke-NpmInstallAndBuild($ProjectPath) {
    Push-Location $ProjectPath

    $env:NPM_CONFIG_REGISTRY = "https://registry.npmjs.org/"

    Info "Ustawiam publiczny rejestr npm: https://registry.npmjs.org/"
    npm config set registry "https://registry.npmjs.org/" | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Pop-Location
        Stop-WithMessage "Nie udalo sie ustawic publicznego rejestru npm."
    }

    Repair-PackageLockRegistry $ProjectPath

    Info "Instaluje zaleznosci zgodnie z package-lock.json..."
    npm ci --registry "https://registry.npmjs.org/"
    if ($LASTEXITCODE -ne 0) {
        Warn "npm ci zakonczyl sie bledem. Najczesciej blokuje to node_modules, Dropbox, VS Code albo antywirus. Probuje mniej agresywne npm install."
        npm install --registry "https://registry.npmjs.org/"
        if ($LASTEXITCODE -ne 0) {
            Pop-Location
            Stop-WithMessage "npm install tez zakonczyl sie bledem. Zamknij edytory, zatrzymaj synchronizacje Dropbox dla tego folderu albo wypakuj projekt poza Dropbox i uruchom skrypt ponownie."
        }
    }

    Info "Buduje gotowa aplikacje..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Pop-Location
        Stop-WithMessage "npm run build zakonczyl sie bledem. Nie wysylam uszkodzonego projektu na GitHub."
    }

    Pop-Location
}

Write-Host "======================================================"
Write-Host " Telmor Praca PWA - GitHub + GitHub Pages"
Write-Host "======================================================"

$script:ProjectPath = Resolve-ProjectPath
$TempRoot = Join-Path $env:TEMP "telmor_praca_git_sync"
$RepoMainPath = Join-Path $TempRoot "main"
$RepoPagesPath = Join-Path $TempRoot "pages"

Info "Folder projektu: $ProjectPath"
Info "Repozytorium: $RepoUrl"

Test-Command "git" "Git nie jest zainstalowany albo nie jest dostepny w PATH."
Test-Command "node" "Node.js nie jest zainstalowany albo nie jest dostepny w PATH."
Test-Command "npm" "npm nie jest dostepny w PATH."

$RequiredFiles = @(
    "index.html",
    "package.json",
    "package-lock.json",
    "vite.config.js",
    "public\manifest.webmanifest",
    "public\service-worker.js",
    "src\main.js",
    "src\app.js",
    "src\router.js"
)

Info "Sprawdzam wymagane pliki projektu..."
foreach ($File in $RequiredFiles) {
    $FullPath = Join-Path $ProjectPath $File
    if (!(Test-Path $FullPath)) {
        Stop-WithMessage "Brak wymaganego pliku: $File. To nie wyglada na kompletna paczke Telmor Praca PWA."
    }
}
Ok "Wymagane pliki sa na miejscu."

try {
    $PackageJson = Get-Content (Join-Path $ProjectPath "package.json") -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Stop-WithMessage "Nie mozna odczytac package.json: $($_.Exception.Message)"
}

$AppVersion = [string]$PackageJson.version
if ([string]::IsNullOrWhiteSpace($AppVersion)) {
    $AppVersion = "bez-wersji"
}

$Timestamp = Get-Date -Format "ddMMyyHHmm"
$CommitMessage = "Telmor Praca PWA $AppVersion - $Timestamp"

Info "Wersja programu: $AppVersion"
Info "Opis commita: $CommitMessage"

Invoke-NpmInstallAndBuild $ProjectPath

$DistPath = Join-Path $ProjectPath "dist"
if (!(Test-Path (Join-Path $DistPath "index.html"))) {
    Stop-WithMessage "Build zakonczyl sie bez pliku dist\index.html."
}
Ok "Build przeszedl poprawnie."

Info "Czyszcze katalog tymczasowy..."
if (Test-Path $TempRoot) {
    Remove-Item $TempRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $TempRoot | Out-Null

# ---------------------------
# 1. Synchronizacja kodu na main
# ---------------------------
Info "Pobieram branch main..."
git clone --branch main $RepoUrl $RepoMainPath
if ($LASTEXITCODE -ne 0) {
    Stop-WithMessage "Nie udalo sie pobrac branch main. Sprawdz adres repozytorium albo logowanie do GitHuba."
}

Set-Location $RepoMainPath
git config user.name "$GitUserName"
git config user.email "$GitUserEmail"
git config core.autocrlf false

Info "Synchronizuje kod z branch main..."
$ExcludeDirsMain = @(
    ".git",
    "node_modules",
    "dist",
    ".vite",
    ".cache",
    ".firebase",
    "coverage",
    ".idea",
    ".vscode"
)

$ExcludeFilesMain = @(
    "*.zip",
    "*.7z",
    "*.rar",
    "*.log",
    "*.tmp",
    "*.bak",
    ".env",
    ".env.local",
    "firebase-debug.log",
    "npm-debug.log*",
    "Thumbs.db",
    "desktop.ini"
)

Invoke-RobocopyMirror $ProjectPath $RepoMainPath $ExcludeDirsMain $ExcludeFilesMain

$ObsoletePathsMain = @(
    "dist",
    "node_modules",
    ".firebase",
    "firebase.json",
    ".firebaserc",
    "firestore.rules",
    "firestore.indexes.json",
    "storage.rules",
    "database.rules.json",
    "functions",
    "src\firebase",
    "src\sync",
    "src\pages\SyncPage.js",
    "src\pages\TelmorSyncPage.js",
    "src\data\repositorySyncHelpers.js",
    "firebase-debug.log"
)

foreach ($Item in $ObsoletePathsMain) {
    $Target = Join-Path $RepoMainPath $Item
    if (Test-Path $Target) {
        Remove-Item $Target -Recurse -Force
        Warn "Usunieto z main: $Item"
    }
}

git add -A
$MainStatus = git status --porcelain
if (-not [string]::IsNullOrWhiteSpace($MainStatus)) {
    Info "Zmiany na main:"
    git status --short
    git commit -m "$CommitMessage"
    if ($LASTEXITCODE -ne 0) {
        Stop-WithMessage "Nie udalo sie utworzyc commita na main."
    }
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Stop-WithMessage "Nie udalo sie wyslac branch main."
    }
    Ok "Branch main zaktualizowany."
} else {
    Warn "Branch main bez zmian."
}

# ---------------------------
# 2. Publikacja gotowej aplikacji na gh-pages
# ---------------------------
Info "Przygotowuje branch $PagesBranch z gotowa aplikacja..."
git clone $RepoUrl $RepoPagesPath
if ($LASTEXITCODE -ne 0) {
    Stop-WithMessage "Nie udalo sie pobrac repozytorium do publikacji Pages."
}

Set-Location $RepoPagesPath
git config user.name "$GitUserName"
git config user.email "$GitUserEmail"
git config core.autocrlf false

git fetch origin
$RemotePagesBranch = git ls-remote --heads origin $PagesBranch
if ([string]::IsNullOrWhiteSpace($RemotePagesBranch)) {
    Info "Branch $PagesBranch nie istnieje. Tworze nowy branch publikacyjny."
    git checkout --orphan $PagesBranch
    git rm -rf . 2>$null
} else {
    Info "Branch $PagesBranch istnieje. Przelaczam sie i czyszcze stare pliki."
    git checkout $PagesBranch
}

Remove-AllExceptGit $RepoPagesPath

Info "Kopiuje zawartosc dist na branch $PagesBranch..."
$EmptyDirs = @()
$EmptyFiles = @()
Invoke-RobocopyMirror $DistPath $RepoPagesPath $EmptyDirs $EmptyFiles

New-Item -ItemType File -Path (Join-Path $RepoPagesPath ".nojekyll") -Force | Out-Null

git add -A
$PagesStatus = git status --porcelain
if (-not [string]::IsNullOrWhiteSpace($PagesStatus)) {
    Info "Zmiany na ${PagesBranch}:"
    git status --short
    git commit -m "Publikacja GitHub Pages $AppVersion - $Timestamp"
    if ($LASTEXITCODE -ne 0) {
        Stop-WithMessage "Nie udalo sie utworzyc commita na $PagesBranch."
    }
    git push -u origin $PagesBranch
    if ($LASTEXITCODE -ne 0) {
        Stop-WithMessage "Nie udalo sie wyslac branch $PagesBranch."
    }
    Ok "Branch $PagesBranch zaktualizowany."
} else {
    Warn "Branch $PagesBranch bez zmian."
}

Set-Location $ProjectPath

Write-Host "======================================================"
Ok "Gotowe. Kod jest na main, a gotowa aplikacja na branch $PagesBranch."
Write-Host ""
Write-Host "TERAZ USTAW NA GITHUB:" -ForegroundColor Yellow
Write-Host "Settings -> Pages -> Build and deployment -> Source: Deploy from a branch"
Write-Host "Branch: gh-pages"
Write-Host "Folder: / (root)"
Write-Host ""
Write-Host "Adres aplikacji po odswiezeniu Pages:"
Write-Host "https://tomalawsb.github.io/Telmor-Praca/"
Write-Host "======================================================"
