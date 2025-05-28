# TOMONI
介護サービスサイト
# 🧑‍⚕️ ケアマッチングプラットフォーム（MVP）
# React + Vite

高齢化社会を背景に、介護者（ケアギバー）と家族・利用者をマッチングする  
**C to C 型の介護マッチングサービス**のフロントエンドMVPプロジェクトです。
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

---
Currently, two official plugins are available:

## ✅ 想定技術スタック（MVP）
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **フロントエンド**：React + Vite + React Router  
- **状態管理**：useState / Context API（必要に応じて）  
- **データ取得**：axios による JSON ローカルフェッチ  
- **スタイリング**：reactbootstrap CSS  
- **使用予定API**：Google Maps API / Notification API / EmailJS など  

---

## 📄 プロジェクト概要

日本はすでに超高齢社会に突入しており、介護を担う現役世代の負担が課題となっています。  
本プロジェクトは、急な予定により介護ができない場合でも、  
**短期間でも対応可能な介護士を迅速にマッチング**できる仕組みを提供します。

また、長期的な介護ニーズにも対応し、**企業を通さないC to C型プラットフォーム**として、  
より柔軟で信頼できる介護支援を目指します。

---

## 🔧 機能一覧（主要）

### 👥 利用者向け

- 介護士の検索・詳細閲覧（距離・時給・プロフィール）
- 服薬時間アラート通知（メール / LINE / KakaoTalk）
- お気に入り登録、応答ステータス表示
- メッセージ送信、苦情・通報フォームあり

### 👩‍⚕️ 介護士向け

- プロフィール登録・PR編集
- 依頼の受信・承認 / 拒否
- 患者情報の事前確認（既往歴・薬情報など）

### 🛠 管理者向け

- 介護士登録申請の審査・承認
- クレーム確認、アカウント制御機能

---

## ✍️ 使用予定API（MVP）

| 機能         | 使用API・方法                           | 目的                             |
|--------------|----------------------------------------|----------------------------------|
| 地図表示     | Google Maps API / Leaflet              | 介護士の現在地・距離の可視化         |
| 現在位置取得 | `navigator.geolocation`                | 近くの介護士を探すため             |
| 時間通知     | `setInterval` / Notification API       | 服薬時間を知らせるアラート機能       |
| メッセージ送信 | useState / Firebase（予定）            | 利用者と介護士の連絡                 |
| 日時選択     | DatePicker + useState                  | 予約時間の選択と管理                 |
| 通知送信     | EmailJS / LINE Notify API             | リマインダー・マッチング通知         |

---

## 📁 フォルダ構成（予定）

/src
├── /data # Mock用 JSON
│ ├── caregivers.jsonl
│ └── patients.jsonl
├── /pages # 画面構成
│ ├── Home.jsx
│ ├── CaregiverList.jsx
│ ├── CaregiverDetail.jsx
│ └── MyPage.jsx
├── /hooks # カスタムフック
│ └── useCaregiver.js
├── /components # UIコンポーネント
│ └── CaregiverCard.jsx
└── App.jsx

---

## 💡 今後の展望（Next Step）

- PWA（プッシュ通知、ホーム追加）対応
- TypeScriptによるコード改善・型安全性強化

---

## 📌 補足

このリポジトリはフロントエンド主体で、**モックデータを使用したUX重視のMVP構成**です。  
今後はバックエンド連携・決済機能などの拡張も視野に入れて開発を進める予定です。

## 📎 詳細ドキュメント（Notion）

👉 [企画書・画面設計・トラブルログはこちら](https://www.notion.so/1fde8d9ebbc480af8da6cb41c5983786)

※ 上記リンクから、開発経緯・画面設計・機能仕様などの詳細をご確認いただけます。
## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
