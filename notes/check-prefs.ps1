$path = 'C:\Program Files\Zen Browser\defaults\pref\config-prefs.js'
$bytes = [System.IO.File]::ReadAllBytes($path)
Write-Host "Size: $($bytes.Length)"
Write-Host "First 8 bytes (hex):"
$bytes[0..7] | ForEach-Object { '{0:X2}' -f $_ } | ForEach-Object { Write-Host "  $_" }
Write-Host "BOM check:"
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
  Write-Host "  UTF-8 BOM present"
} elseif ($bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE) {
  Write-Host "  UTF-16 LE BOM"
} elseif ($bytes[0] -eq 0xFE -and $bytes[1] -eq 0xFF) {
  Write-Host "  UTF-16 BE BOM"
} else {
  Write-Host "  No BOM"
}
Write-Host "Line ending check:"
$content = [System.IO.File]::ReadAllText($path)
if ($content -match "`r`n") { Write-Host "  Has CRLF" }
if ($content -match "(?<!`r)`n") { Write-Host "  Has LF" }
Write-Host "---channel-prefs.js for comparison---"
$path2 = 'C:\Program Files\Zen Browser\defaults\pref\channel-prefs.js'
$bytes2 = [System.IO.File]::ReadAllBytes($path2)
Write-Host "Size: $($bytes2.Length)"
$bytes2[0..7] | ForEach-Object { '{0:X2}' -f $_ } | ForEach-Object { Write-Host "  $_" }
