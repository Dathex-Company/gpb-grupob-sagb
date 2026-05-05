# Script para adicionar registro NETLIFYv6 (AAAA) via API REST Netlify
param(
    [string]$ZoneId = "69a628b389843c0aa86791ca",
    [string]$Hostname = "institutob.com.br",
    [string]$Value = "institutob-site.netlify.app",
    [string]$Type = "NETLIFYv6",
    [int]$Ttl = 3600
)

# Carrega o token de acesso do Netlify CLI
$statusJson = netlify status --json 2>&1 | Out-String
$status = $statusJson | ConvertFrom-Json

# O token de acesso está em um arquivo separado
$configPath = Join-Path $env:LOCALAPPDATA "netlify\config.json"
if (-not (Test-Path $configPath)) {
    $configPath = Join-Path $env:USERPROFILE ".netlify\config.json"
}
if (-not (Test-Path $configPath)) {
    $configPath = Join-Path $env:USERPROFILE "AppData\Roaming\netlify\config.json"
}
if (-not (Test-Path $configPath)) {
    # Procura em locais comuns
    $possiblePaths = @(
        Join-Path $env:LOCALAPPDATA "netlify\config.json"
        Join-Path $env:USERPROFILE ".netlify\config.json"
        Join-Path $env:APPDATA "netlify\config.json"
        "C:\Users\drsro\.netlify\config.json"
    )
    foreach ($p in $possiblePaths) {
        if (Test-Path $p) {
            $configPath = $p
            break
        }
    }
}

Write-Host "Config path: $configPath"

if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    Write-Host "Config properties: $($config | Get-Member -MemberType NoteProperty | ForEach-Object { $_.Name })"
    
    # Tenta acessar o token
    if ($config.users) {
        $userId = $config.users | Get-Member -MemberType NoteProperty | Select-Object -First 1 -ExpandProperty Name
        Write-Host "User ID: $userId"
        $token = $config.users.$userId.auth.accessToken
        Write-Host "Token found: $($token.Substring(0, [Math]::Min(10, $token.Length)))..."
    } elseif ($config.accessToken) {
        $token = $config.accessToken
    } elseif ($config.token) {
        $token = $config.token
    }
} else {
    Write-Host "Config file not found at any location"
}

if (-not $token) {
    Write-Error "Token de acesso nao encontrado!"
    exit 1
}

# URL da API
$url = "https://api.netlify.com/api/v1/dns_zones/$ZoneId/dns_records"
Write-Host "URL: $url"

# Body da requisicao
$body = @{
    type = $Type
    hostname = $Hostname
    value = $Value
    ttl = $Ttl
} | ConvertTo-Json

Write-Host "Request body:"
Write-Host $body

# Headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response:"
    Write-Host $response.Content
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd() | Out-String
        $reader.Close()
        Write-Host "Error body: $errorBody"
    }
}
