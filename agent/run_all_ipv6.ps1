$token = 'nfc_FbJDjrNNsq3roHpJc7ayRTDmoAJvPSdD4df4'
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

$records = @(
    # grupob.com.br (69f9134c8400182d43e088c4)
    # ja foi

    # 3forb.com.br (69f918557827a83d5cf5a46e)
    @{ zone = "69f918557827a83d5cf5a46e"; host = "3forb.com.br"; target = "3forb.netlify.app" }
    @{ zone = "69f918557827a83d5cf5a46e"; host = "www.3forb.com.br"; target = "3forb.netlify.app" }

    # startyb.com.br (69f91471ab59bf045086bde7)
    @{ zone = "69f91471ab59bf045086bde7"; host = "startyb.com.br"; target = "startyb.netlify.app" }
    @{ zone = "69f91471ab59bf045086bde7"; host = "www.startyb.com.br"; target = "startyb.netlify.app" }

    # ziplia.com.br (69a306aabccfaae07be0f94c)
    @{ zone = "69a306aabccfaae07be0f94c"; host = "ziplia.com.br"; target = "ziplia-vox.netlify.app" }
    @{ zone = "69a306aabccfaae07be0f94c"; host = "www.ziplia.com.br"; target = "ziplia-vox.netlify.app" }
    @{ zone = "69a306aabccfaae07be0f94c"; host = "crm.ziplia.com.br"; target = "zipliacrm.netlify.app" }
    @{ zone = "69a306aabccfaae07be0f94c"; host = "chat.ziplia.com.br"; target = "zipliachat.netlify.app" }
    @{ zone = "69a306aabccfaae07be0f94c"; host = "taskzei.ziplia.com.br"; target = "taskzei.netlify.app" }
    @{ zone = "69a306aabccfaae07be0f94c"; host = "sire.ziplia.com.br"; target = "sireplataforma.netlify.app" }
    @{ zone = "69a306aabccfaae07be0f94c"; host = "simula.ziplia.com.br"; target = "simuladorresultado.netlify.app" }
    @{ zone = "69a306aabccfaae07be0f94c"; host = "vox.ziplia.com.br"; target = "ziplia-vox.netlify.app" }
    @{ zone = "69a306aabccfaae07be0f94c"; host = "odonto.ziplia.com.br"; target = "zipliaodonto.netlify.app" }
)

foreach ($rec in $records) {
    Write-Host "Adicionando $($rec.host)..."
    
    # 1. buscar records da zona pra pegar o site_id do NETLIFY (IPv4)
    $zoneUrl = "https://api.netlify.com/api/v1/dns_zones/$($rec.zone)"
    $zone = Invoke-RestMethod -Uri $zoneUrl -Method GET -Headers $headers
    
    $siteId = $null
    foreach ($r in $zone.records) {
        if ($r.hostname -eq $rec.host -and $r.type -eq 'NETLIFY') {
            $siteId = $r.site_id
            break
        }
    }
    
    if (-not $siteId) {
        Write-Host "  -> Pulando: nao achei registro NETLIFY para $($rec.host) (sem site_id)"
        continue
    }

    $body = @{
        type = 'NETLIFYv6'
        hostname = $rec.host
        value = $rec.target
        ttl = 3600
        site_id = $siteId
    } | ConvertTo-Json -Depth 5 -Compress

    try {
        $res = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/dns_zones/$($rec.zone)/dns_records" -Method POST -Headers $headers -Body $body
        Write-Host "  -> Sucesso!"
    } catch {
        Write-Host "  -> Erro!"
        $errStream = $_.Exception.Response.GetResponseStream()
        if ($errStream) {
            $reader = New-Object System.IO.StreamReader($errStream)
            Write-Host "  -> $($reader.ReadToEnd())"
        } else {
            Write-Host "  -> $($_.Exception.Message)"
        }
    }
}
