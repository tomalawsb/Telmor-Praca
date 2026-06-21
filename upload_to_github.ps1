param(
    [string]$RepoUrl = "https://github.com/tomalawsb/Telmor-Praca.git",
    [string]$MainBranch = "main",
    [string]$PagesBranch = "gh-pages"
)

$ErrorActionPreference = "Stop"

function Info($Text) {
    Write-Host $Text -ForegroundColor Cyan
}

function Ok($Text) {
    Write-Host $Text -ForegroundColor Green
}

function Warn($Text) {
    Write-Host $Text -ForegroundColor Yellow
}

function Fail($Text) {
    Write-Host "BLAD: $Text" -ForegroundColor Red
    exit 1
}

function Run-Git {
    param(
        [Parameter(Mandatory=$true)][string[]]$ArgsToRun,
        [string]$WorkingDirectory = $null
    )

    $oldLocation = Get-Location
    try {
        if ($WorkingDirectory) {
            Set-Location $WorkingDirectory
        }
        & git @ArgsToRun
        if ($LASTEXITCODE -ne 0) {
            throw "Git zakonczyl prace z kodem $LASTEXITCODE. Polecenie: git $($ArgsToRun -join ' ')"
        }
    }
    finally {
        Set-Location $oldLocation
    }
}

function Clear-FolderExceptGit($Path) {
    Get-ChildItem -LiteralPath $Path -Force | Where-Object { $_.Name -ne ".git" } | ForEach-Object {
        Remove-Item -LiteralPath $_.FullName -Recurse -Force
    }
}

function Should-SkipSourceItem($Name) {
    $skip = @(
        ".git",
        "node_modules",
        "dist",
        ".vite",
        ".cache",
        "tmp",
        "temp"
    )
    if ($skip -contains $Name) { return $true }
    if ($Name.ToLower().EndsWith(".zip")) { return $true }
    return $false
}

function Copy-SourceTree($From, $To) {
    Get-ChildItem -LiteralPath $From -Force | ForEach-Object {
        if (!(Should-SkipSourceItem $_.Name)) {
            Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $To $_.Name) -Recurse -Force
        }
    }
}

function Copy-PagesFiles($From, $To) {
    $items = @(
        "index.html",
        "app.js",
        "styles.css",
        "manifest.webmanifest",
        "service-worker.js",
        "offline.html",
        "404.html",
        ".nojekyll",
        "icons"
    )

    foreach ($item in $items) {
        $src = Join-Path $From $item
        if (Test-Path -LiteralPath $src) {
            Copy-Item -LiteralPath $src -Destination (Join-Path $To $item) -Recurse -Force
        }
    }
}

$SourceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$IndexPath = Join-Path $SourceRoot "index.html"
$AppPath = Join-Path $SourceRoot "app.js"
$StylePath = Join-Path $SourceRoot "styles.css"
$ManifestPath = Join-Path $SourceRoot "manifest.webmanifest"
$SwPath = Join-Path $SourceRoot "service-worker.js"

if (!(Test-Path -LiteralPath $IndexPath)) { Fail "Brak index.html w katalogu skryptu." }
if (!(Test-Path -LiteralPath $AppPath)) { Fail "Brak app.js w katalogu skryptu." }
if (!(Test-Path -LiteralPath $StylePath)) { Fail "Brak styles.css w katalogu skryptu." }
if (!(Test-Path -LiteralPath $ManifestPath)) { Fail "Brak manifest.webmanifest w katalogu skryptu." }
if (!(Test-Path -LiteralPath $SwPath)) { Fail "Brak service-worker.js w katalogu skryptu." }

try {
    & git --version | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Git nie odpowiada." }
}
catch {
    Fail "Nie znaleziono programu Git. Zainstaluj Git for Windows albo dodaj git.exe do PATH."
}

$Stamp = Get-Date -Format "ddMMyyHHmm"
$CommitMessage = "Telmor Praca PWA 16.0 - $Stamp"
$WorkRoot = Join-Path $env:TEMP ("telmor_praca_sync_" + [guid]::NewGuid().ToString("N"))
$RepoDir = Join-Path $WorkRoot "repo"

Info "Repozytorium: $RepoUrl"
Info "Opis commita: $CommitMessage"
Info "Tworze katalog roboczy: $WorkRoot"

New-Item -ItemType Directory -Path $WorkRoot -Force | Out-Null

try {
    Info "Klonuje repozytorium..."
    Run-Git -ArgsToRun @("clone", $RepoUrl, $RepoDir)

    Info "Przygotowuje branch ${MainBranch}..."
    try {
        Run-Git -ArgsToRun @("checkout", $MainBranch) -WorkingDirectory $RepoDir
    }
    catch {
        Warn "Branch ${MainBranch} nie istnieje lokalnie. Tworze go."
        Run-Git -ArgsToRun @("checkout", "-b", $MainBranch) -WorkingDirectory $RepoDir
    }

    Info "Czyszcze stare pliki na branchu ${MainBranch}..."
    Clear-FolderExceptGit $RepoDir

    Info "Kopiuje aktualna aplikacje do branchu ${MainBranch}..."
    Copy-SourceTree $SourceRoot $RepoDir

    Run-Git -ArgsToRun @("add", "-A") -WorkingDirectory $RepoDir
    $mainStatus = (& git -C $RepoDir status --porcelain)
    if ($mainStatus) {
        Info "Zapisuje zmiany na ${MainBranch}..."
        Run-Git -ArgsToRun @("commit", "-m", $CommitMessage) -WorkingDirectory $RepoDir
        Run-Git -ArgsToRun @("push", "origin", $MainBranch) -WorkingDirectory $RepoDir
    }
    else {
        Warn "Brak zmian na ${MainBranch}."
    }

    Info "Tworze czysty branch publikacyjny ${PagesBranch}..."
    Run-Git -ArgsToRun @("checkout", "--orphan", "__telmor_pages_tmp") -WorkingDirectory $RepoDir
    Clear-FolderExceptGit $RepoDir

    Info "Kopiuje tylko pliki potrzebne do GitHub Pages..."
    Copy-PagesFiles $SourceRoot $RepoDir

    Run-Git -ArgsToRun @("add", "-A") -WorkingDirectory $RepoDir
    Run-Git -ArgsToRun @("commit", "-m", $CommitMessage) -WorkingDirectory $RepoDir
    Run-Git -ArgsToRun @("push", "origin", "HEAD:${PagesBranch}", "--force") -WorkingDirectory $RepoDir

    Ok "Gotowe. Wyslano branch ${MainBranch} i czysty branch ${PagesBranch}."
    Ok "Adres aplikacji po ustawieniu Pages: https://tomalawsb.github.io/Telmor-Praca/"
    Warn "Na GitHub ustaw: Settings -> Pages -> Source: Deploy from a branch -> Branch: gh-pages -> Folder: /root."
}
catch {
    Fail $_.Exception.Message
}
finally {
    if (Test-Path -LiteralPath $WorkRoot) {
        Remove-Item -LiteralPath $WorkRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}
