[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$linuxBuildScript = (Get-Content -Raw (Join-Path $PSScriptRoot 'verify-cloudflare-pages.sh')) -replace "`r", ''
$encodedBuildScript = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($linuxBuildScript))
$bashCommand = "echo $encodedBuildScript | base64 --decode | bash"

& wsl.exe --distribution Ubuntu --user root --cd $repositoryRoot --exec bash -c $bashCommand

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
