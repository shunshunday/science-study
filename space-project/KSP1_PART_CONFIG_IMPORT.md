# KSP 1.12.x の実パーツ設定を照合する

このフォルダの `export-ksp-part-configs.ps1` は、Windows標準のPowerShellでKSPのパーツ設定を読み取り、JSON/CSVへ出力します。追加アプリやモデル変換ソフトは不要です。

## 手順
1. KSP 1 のインストールフォルダを確認します。Steam版の例:
   `C:\Program Files (x86)\Steam\steamapps\common\Kerbal Space Program`
2. `export-ksp-part-configs.ps1` を右クリックして「PowerShellで実行」するか、PowerShellで次を実行します。
   `powershell -ExecutionPolicy Bypass -File .\export-ksp-part-configs.ps1`
3. 表示された質問にKSPのインストールフォルダを入力します。
4. このフォルダ内に `ksp-part-config-export.json` と `ksp-part-config-export.csv` が作成されます。
5. JSONをこのチャットに添付すれば、内部ID・質量・価格・ノード・リソース・モジュールを1.12.x実データで照合できます。

## 読み取り対象
- `GameData/Squad/Parts`（本体）
- `GameData/SquadExpansion/MakingHistory/Parts`（Making History）
- `GameData/SquadExpansion/Serenity/Parts`（Breaking Ground）

## 注意
- 読み取るのは `.cfg` の文字情報だけです。公式の `.mu` モデルやテクスチャはコピーしません。
- KSP本体やDLCのインストール状態によって、出力件数は変わります。
- 出力値はゲーム内の設定ファイルに基づく照合用データです。現在のブラウザ版へ反映する際は、各パーツのノードや機能を別途実装・検証します。
