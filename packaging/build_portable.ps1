$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$BundledPython = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$Python = if (Test-Path $BundledPython) { $BundledPython } else { "python" }

Set-Location $Root

Write-Host "Using Python: $Python"
Write-Host "Ensuring PyInstaller is installed..."
& $Python -m pip install pyinstaller
if ($LASTEXITCODE -ne 0) {
  throw "Failed to install PyInstaller."
}

Remove-Item -Recurse -Force build, dist, release -ErrorAction SilentlyContinue

& $Python -m PyInstaller `
  --noconfirm `
  --clean `
  --name PortfolioGenerator `
  --onefile `
  --console `
  --add-data "index.html;." `
  --add-data "styles.css;." `
  --add-data "script.js;." `
  --hidden-import pypdf `
  --hidden-import docx `
  --hidden-import lxml `
  --hidden-import lxml.etree `
  --hidden-import lxml._elementpath `
  portfolio_generator\generator_app.py
if ($LASTEXITCODE -ne 0) {
  throw "PyInstaller build failed."
}

$PackageDir = Join-Path $Root "release\PortfolioGeneratorPortable"
New-Item -ItemType Directory -Force -Path $PackageDir | Out-Null
Copy-Item -LiteralPath (Join-Path $Root "dist\PortfolioGenerator.exe") -Destination $PackageDir -Force
Copy-Item -LiteralPath (Join-Path $Root "packaging\customer_README.txt") -Destination (Join-Path $PackageDir "README.txt") -Force
Remove-Item -Recurse -Force (Join-Path $PackageDir "generated_sites") -ErrorAction SilentlyContinue

$ZipPath = Join-Path $Root "release\PortfolioGeneratorPortable.zip"
Remove-Item -LiteralPath $ZipPath -Force -ErrorAction SilentlyContinue
$ZipItems = Get-ChildItem -LiteralPath $PackageDir
Compress-Archive -LiteralPath $ZipItems.FullName -DestinationPath $ZipPath -Force

if (-not (Test-Path $ZipPath)) {
  throw "Zip package was not created."
}

Write-Host "Portable package created:"
Write-Host $ZipPath
