param(
 [string]$KspPath = ""
)
$ErrorActionPreference = "Stop"
if ([string]::IsNullOrWhiteSpace($KspPath)) {
 $KspPath = Read-Host "KSP1のインストールフォルダを入力してください"
}
$gameData = Join-Path $KspPath "GameData"
if (-not (Test-Path $gameData)) { throw "GameData フォルダが見つかりません: $gameData" }

function Remove-CfgComments([string]$Text) {
 $t = [regex]::Replace($Text, '(?s)/\*.*?\*/', '')
 return [regex]::Replace($t, '(?m)//.*$', '')
}
function Get-BracedBlock([string]$Text, [int]$OpenIndex) {
 $depth = 0
 for ($i = $OpenIndex; $i -lt $Text.Length; $i++) {
  if ($Text[$i] -eq '{') { $depth++ }
  elseif ($Text[$i] -eq '}') {
   $depth--
   if ($depth -eq 0) { return $Text.Substring($OpenIndex + 1, $i - $OpenIndex - 1) }
  }
 }
 return $null
}
function Get-CfgValue([string]$Block, [string]$Key) {
 $m = [regex]::Match($Block, '(?im)^\s*' + [regex]::Escape($Key) + '\s*=\s*([^\r\n]+)')
 if ($m.Success) { return $m.Groups[1].Value.Trim().Trim('"') }
 return $null
}
function Get-NestedBlocks([string]$Block, [string]$Label) {
 $out = @()
 $matches = [regex]::Matches($Block, '(?im)\b' + [regex]::Escape($Label) + '\s*\{')
 foreach ($m in $matches) {
  $open = $m.Index + $m.Length - 1
  $nested = Get-BracedBlock $Block $open
  if ($null -ne $nested) { $out += $nested }
 }
 return ,$out
}

$roots = @(
 @{ Path = (Join-Path $gameData "Squad/Parts"); Dlc = "Stock" },
 @{ Path = (Join-Path $gameData "SquadExpansion/MakingHistory/Parts"); Dlc = "Making History" },
 @{ Path = (Join-Path $gameData "SquadExpansion/Serenity/Parts"); Dlc = "Breaking Ground" }
)
$parts = [System.Collections.Generic.List[object]]::new()
foreach ($root in $roots) {
 if (-not (Test-Path $root.Path)) { continue }
 Get-ChildItem -Path $root.Path -Filter "*.cfg" -File -Recurse | ForEach-Object {
  $raw = Get-Content -LiteralPath $_.FullName -Raw
  $clean = Remove-CfgComments $raw
  $partMatches = [regex]::Matches($clean, '(?im)\bPART\s*\{')
  foreach ($pm in $partMatches) {
   $open = $pm.Index + $pm.Length - 1
   $block = Get-BracedBlock $clean $open
   if ($null -eq $block) { continue }
   $internalName = Get-CfgValue $block "name"
   if ([string]::IsNullOrWhiteSpace($internalName)) { continue }
   $resources = @()
   foreach ($rb in (Get-NestedBlocks $block "RESOURCE")) {
    $resources += [pscustomobject]@{
     name = Get-CfgValue $rb "name"
     amount = Get-CfgValue $rb "amount"
     maxAmount = Get-CfgValue $rb "maxAmount"
    }
   }
   $modules = @()
   foreach ($mb in (Get-NestedBlocks $block "MODULE")) {
    $moduleName = Get-CfgValue $mb "name"
    if ($moduleName) { $modules += $moduleName }
   }
   $nodes = @()
   foreach ($nm in [regex]::Matches($block, '(?im)^\s*(node_stack_[A-Za-z0-9_]+|node_attach)\s*=\s*([^\r\n]+)')) {
    $nodes += [pscustomobject]@{ name = $nm.Groups[1].Value; value = $nm.Groups[2].Value.Trim() }
   }
   $parts.Add([pscustomobject]@{
    internalName = $internalName
    title = Get-CfgValue $block "title"
    manufacturer = Get-CfgValue $block "manufacturer"
    category = Get-CfgValue $block "category"
    mass = Get-CfgValue $block "mass"
    cost = Get-CfgValue $block "cost"
    entryCost = Get-CfgValue $block "entryCost"
    techRequired = Get-CfgValue $block "TechRequired"
    rescaleFactor = Get-CfgValue $block "rescaleFactor"
    model = Get-CfgValue $block "model"
    dlc = $root.Dlc
    configFile = $_.FullName.Substring($KspPath.Length).TrimStart([char[]]@('\','/'))
    nodes = $nodes
    resources = $resources
    modules = $modules
   })
  }
 }
}
if ($parts.Count -eq 0) { throw "PART 定義が見つかりません。KSP1のルートフォルダを確認してください。" }
$outJson = Join-Path $PSScriptRoot "ksp-part-config-export.json"
$outCsv = Join-Path $PSScriptRoot "ksp-part-config-export.csv"
$parts | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $outJson -Encoding UTF8
$parts | Select-Object internalName,title,dlc,mass,cost,entryCost,techRequired,model,configFile | Export-Csv -LiteralPath $outCsv -NoTypeInformation -Encoding UTF8
Write-Host ""
Write-Host ("抽出完了: {0} パーツ" -f $parts.Count) -ForegroundColor Green
Write-Host ("JSON: {0}" -f $outJson)
Write-Host ("CSV : {0}" -f $outCsv)
Write-Host "このスクリプトは .cfg の設定値だけを読み取ります。公式3Dモデルやテクスチャはコピーしません。"
