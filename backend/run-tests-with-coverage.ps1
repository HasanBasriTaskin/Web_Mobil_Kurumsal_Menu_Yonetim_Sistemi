# Unit testleri code coverage ile çalıştırır ve HTML raporu oluşturur
param(
    [string]$TestProjectPath = "./CorporateMenuManagementSystem.Tests/CorporateMenuManagementSystem.Tests.csproj",
    [string]$ReportDir = "coverage-report"
)

# Mevcut geçmiş (history) klasörünü yedekle
$histBackup = "$env:TEMP\cov_history_$(Get-Random)"
if (Test-Path "$ReportDir/history") {
    Move-Item "$ReportDir/history" $histBackup
}

# coverage-report dizinini temizle
if (Test-Path $ReportDir) {
    Remove-Item -Recurse -Force $ReportDir
}
New-Item -Path $ReportDir -ItemType Directory | Out-Null

# Geçmişi geri yükle
if (Test-Path $histBackup) {
    Move-Item $histBackup "$ReportDir/history"
}

# NOT: TestResults klasörü silinmiyor; böylece geçmiş coverage xml dosyaları
# history grafiği için saklanır.

Write-Host "Testler coverage ile calıstırılıyor: $TestProjectPath..." -ForegroundColor Cyan

$resultDir = "$(Split-Path $TestProjectPath)/TestResults"

dotnet test $TestProjectPath --collect:"XPlat Code Coverage" --results-directory $resultDir -- DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Format="cobertura" DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.ExcludeByFile="**/DataSeeder/**/*.cs,**/Migrations/*.cs,**/*.Designer.cs,**/*.g*.cs,**/Program.cs,**/*Program.cs" DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Exclude="[*]*Program,[*.Tests]*"

$coverageFile = Get-ChildItem -Path $resultDir -Recurse -Filter "coverage.cobertura.xml" |
                Sort-Object LastWriteTime -Descending |
                Select-Object -First 1

if (-not $coverageFile) {
    Write-Error "Coverage dosyası bulunamadı. coverlet.collector paketinin yüklendiğinden emin olun."
    exit 1
}

Write-Host "`nHTML raporu oluşturuluyor..." -ForegroundColor Cyan
$historyDir = Join-Path $ReportDir "history"

# ReportGenerator tool'unun yüklü olup olmadığını kontrol et
if (-not (Get-Command reportgenerator -ErrorAction SilentlyContinue)) {
    Write-Host "ReportGenerator tool'u yüklü değil. Yükleniyor..." -ForegroundColor Yellow
    dotnet tool install -g dotnet-reportgenerator-globaltool
}

reportgenerator -reports:$coverageFile.FullName -targetdir:$ReportDir -reporttypes:Html -historydir:$historyDir
Write-Host "`nRapor başarıyla oluşturuldu: $ReportDir/index.html" -ForegroundColor Green
Write-Host "Raporu görmek için: start $ReportDir/index.html" -ForegroundColor Yellow

# TestResults klasörünü temizle
if (Test-Path $resultDir) {
    Remove-Item -Recurse -Force $resultDir
    Write-Host "`nTestResults klasörü temizlendi." -ForegroundColor Gray
}
