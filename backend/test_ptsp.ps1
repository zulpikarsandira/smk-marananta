# Script untuk test PTSP upload
$uri = "http://127.0.0.1:8080/api/ptsp/submit"
$filePath = "test_document.txt"

# Buat boundary untuk multipart form
$boundary = [System.Guid]::NewGuid().ToString()

# Baca file
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$fileContent = [System.Text.Encoding]::GetEncoding('iso-8859-1').GetString($fileBytes)

# Buat multipart form body
$LF = "`r`n"
$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"nama_pemohon`"$LF",
    "Budi Santoso",
    "--$boundary",
    "Content-Disposition: form-data; name=`"nik`"$LF",
    "3201234567890123",
    "--$boundary",
    "Content-Disposition: form-data; name=`"email`"$LF",
    "budi@example.com",
    "--$boundary",
    "Content-Disposition: form-data; name=`"no_telepon`"$LF",
    "081234567890",
    "--$boundary",
    "Content-Disposition: form-data; name=`"jenis_layanan`"$LF",
    "Legalisir Ijazah",
    "--$boundary",
    "Content-Disposition: form-data; name=`"keterangan`"$LF",
    "Mohon legalisir ijazah untuk keperluan melamar pekerjaan",
    "--$boundary",
    "Content-Disposition: form-data; name=`"dokumen`"; filename=`"test_document.txt`"",
    "Content-Type: text/plain$LF",
    $fileContent,
    "--$boundary--$LF"
) -join $LF

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines
    Write-Host "✅ SUKSES!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        Write-Host $reader.ReadToEnd()
    }
}
