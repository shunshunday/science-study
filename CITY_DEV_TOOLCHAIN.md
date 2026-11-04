# 理科キッズ 建築ゲーム — 無料開発ツール構成

このゲームは GitHub Pages 上で動く Three.js / WebGL のブラウザーゲーム。既存の構成を維持し、無料・オープンソースの道具を用途別に採用する。

## 採用するもの

| 用途 | 採用 | ライセンス / 費用 | 使い方 |
|---|---|---|---|
| 3Dゲーム本体 | Three.js（既存） | MIT / 無料 | 描画・地形・水・建物・車両 |
| 3Dモデル制作 | Blender | GPL / 無料 | 建物、車両、樹木、道路設備を制作し glTF/GLB で書き出す |
| フォトリアル素材 | Poly Haven | CC0 / 無料 | PBR地面・アスファルト・岩・砂・HDRI・小物 |
| 追加PBR素材 | ambientCG | CC0 / 無料 | コンクリート、舗装、土、壁面の質感 |
| ブラウザー自動テスト | Playwright | Apache-2.0 / 無料 | 起動、描画、コンソールエラーの回帰テスト |
| 3D物理（必要箇所から） | Rapier | Apache-2.0 / 無料 | 将来の車両衝突・物理挙動。導入前に既存当たり判定との統合設計を行う |
| 地理データ（任意） | OpenStreetMap | ODbL / 無料 | 実在都市の道路構造を参考にする。データ利用時はクレジットとODbL条件を守る |

## 今回コードに導入したもの

- Three.js の GLTFLoader を追加。Blender 等から書き出した .glb / .gltf を、後からゲームへ読み込める基盤を用意。
- Playwright のブラウザー起動テストを追加し、GitHub Actions で自動実行。
- 既存の描画・保存・シミュレーションの構造は維持。未使用の巨大ライブラリや外部サービスは読み込まない。

## 今回は導入しないもの（理由）

- Unity / Unreal Engine：ブラウザー版の既存ゲームを移植するコストが大きく、無料でも現在の構成には不適切。
- MapLibre：地図表示ライブラリであり、ゲーム世界の3D地形・都市描画の主役にはならない。
- PathFinding.js：2Dグリッド向け。道路ネットワークの車線・交差点・一方通行を扱う経路探索の置き換えには不十分。
- Rapier の即時全面導入：既存の移動・当たり判定と二重管理になるため、車両・衝突システムを設計してから段階導入する。
- Kenney：CC0素材は便利だが、今回のフォトリアル方針にはスタイライズされた素材が混ざるため、プロトタイプ用途に限定。

## 3Dアセットの制作ルール

1. Blender から glTF 2.0 / GLB で書き出す。
2. 可能なら同一モデルのポリゴン数・テクスチャ解像度を用途別に用意する（近景・中景・遠景）。
3. PBR素材は Base Color / Normal / Roughness / Ambient Occlusion を正しく割り当てる。
4. Poly Haven / ambientCG の素材は個別ページでライセンスと解像度を再確認する。
5. 4K以上のテクスチャを大量に常時読み込まない。必要なときだけ読み込み、圧縮・LOD・キャッシュを使う。
6. 外部アセットのURLをゲーム実行時に毎回取得する設計にしない。利用する素材はリポジトリ内に固定し、バージョンとライセンス情報を記録する。

## 公式リンク

- [Blender](https://www.blender.org/)
- [Poly Haven](https://polyhaven.com/) / [ライセンス](https://polyhaven.com/license)
- [ambientCG](https://ambientcg.com/)
- [Three.js](https://threejs.org/)
- [Rapier](https://rapier.rs/)
- [Playwright](https://playwright.dev/)
- [OpenStreetMap 著作権・ライセンス](https://www.openstreetmap.org/copyright)

## 注意

無料であることと、素材の再配布条件が自由であることは同じではない。特に地図データ、モデル、写真、フォントは、採用するファイルごとにライセンスを確認する。
