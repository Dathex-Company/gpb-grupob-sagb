$configPath = "C:\Users\drsro\AppData\Local\netlify\config.json"
if (-not (Test-Path $configPath)) {
    $configPath = "C:\Users\drsro\.netlify\config.json"
}
if (-not (Test-Path $configPath)) {
    $configPath = "C:\Users\drsro\AppData\Roaming\netlify\config.json"
}
$possiblePaths = @(
    "C:\Users\drsro\AppData\Local\netlify\config.json"
    "C:\Users\drsro\.netlify\config.json"
    "C:\Users\drsro\AppData\Roaming\netlify\config.json"
    "C:\Users\drsro\netlify\config.json"
)
foreach ($p in $possiblePaths) {
    if (Test-Path $p) {
        $configPath = $p
        break
    }
}

if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    if ($config.users) {
        $userId = $config.users | Get-Member -MemberType NoteProperty | Select-Object -First 1 -ExpandProperty Name
        $token = $config.users.$userId.auth.accessToken
    }
}

if (-not $token) {
    Write-Error "Token not found"
    exit 1
}

$siteId = "2dfa2e51-f6ad-4f0b-86a4-adbc199000a7"
$url = "https://api.netlify.com/api/v1/sites/$siteId"
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

Write-Host "Fetching site details..."
$response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
$response | Select-Object name, custom_domain, domain_aliases | ConvertTo-Json

# Updating custom domain
$body = @{
    custom_domain = "sagb.grupob.com.br"
} | ConvertTo-Json

Write-Host "Updating custom domain to sagb.grupob.com.br..."
$updateResponse = Invoke-RestMethod -Uri $url -Headers $headers -Method Put -Body $body
$updateResponse | Select-Object name, custom_domain, domain_aliases, ssl_status | ConvertTo-Json
