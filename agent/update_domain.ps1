$configPath = Join-Path $env:LOCALAPPDATA "netlify\config.json"
if (-not (Test-Path $configPath)) { $configPath = Join-Path $env:USERPROFILE ".netlify\config.json" }
$config = Get-Content $configPath -Raw | ConvertFrom-Json
$userId = $config.users | Get-Member -MemberType NoteProperty | Select-Object -First 1 -ExpandProperty Name
$token = $config.users.$userId.auth.accessToken
$siteId = "2dfa2e51-f6ad-4f0b-86a4-adbc199000a7"
$url = "https://api.netlify.com/api/v1/sites/$siteId"
$headers = @{ "Authorization" = "Bearer $token" }

Write-Host "Fetching site details..."
$response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
$response | Select-Object name, custom_domain, domain_aliases | ConvertTo-Json

# Updating custom domain
$body = @{
    custom_domain = "sagb.grupob.com.br"
} | ConvertTo-Json

Write-Host "Updating custom domain to sagb.grupob.com.br..."
$headers.Add("Content-Type", "application/json")
$updateResponse = Invoke-RestMethod -Uri $url -Headers $headers -Method Put -Body $body
$updateResponse | Select-Object name, custom_domain, domain_aliases, ssl_status | ConvertTo-Json
