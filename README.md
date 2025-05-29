TOMONI
介護サービスサイト

🧑‍⚕️ ケアマッチングプラットフォーム（MVP）
React + Vite
高齢化社会を背景に、介護者（ケアギバー）と家族・利用者をマッチングする
C to C 型の介護マッチングサービスのフロントエンド MVP プロジェクトです。 This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

✅ 想定技術スタック（MVP）
@vitejs/plugin-react uses Babel for Fast Refresh

@vitejs/plugin-react-swc uses SWC for Fast Refresh

フロントエンド：React + Vite + React Router

状態管理：useState / Context API（必要に応じて）

データ取得：axios による JSON ローカルフェッチ

スタイリング：reactbootstrap CSS

使用予定 API：Google Maps API / Notification API / EmailJS など

📄 プロジェクト概要
日本はすでに超高齢社会に突入しており、介護を担う現役世代の負担が課題となっています。
本プロジェクトは、急な予定により介護ができない場合でも、
短期間でも対応可能な介護士を迅速にマッチングできる仕組みを提供します。

また、長期的な介護ニーズにも対応し、企業を通さない C to C 型プラットフォームとして、
より柔軟で信頼できる介護支援を目指します。

🔧 機能一覧（主要）
👥 利用者向け
介護士の検索・詳細閲覧（距離・時給・プロフィール）
服薬時間アラート通知（メール / LINE / KakaoTalk）
お気に入り登録、応答ステータス表示
メッセージ送信、苦情・通報フォームあり
👩‍⚕️ 介護士向け
プロフィール登録・PR 編集
依頼の受信・承認 / 拒否
患者情報の事前確認（既往歴・薬情報など）
🛠 管理者向け
介護士登録申請の審査・承認
クレーム確認、アカウント制御機能
✍️ 使用予定 API（MVP）
機能 使用 API・方法 目的
地図表示 Google Maps API / Leaflet 介護士の現在地・距離の可視化
現在位置取得 navigator.geolocation 近くの介護士を探すため
時間通知 setInterval / Notification API 服薬時間を知らせるアラート機能
メッセージ送信 useState / Firebase（予定） 利用者と介護士の連絡
日時選択 DatePicker + useState 予約時間の選択と管理
通知送信 EmailJS / LINE Notify API リマインダー・マッチング通知
📁 フォルダ構成（予定）
bash /public ├── /img │ ├── background.png │ └── caregiverimg.png ├── /data │ ├── caregiver_profile.jsonl └── └── patient.json /src ├── /pages │ ├── Home.jsx │ ├── CaregiverList.jsx │ ├── CaregiverDetail.jsx │ └── MyPage.jsx ├── /hooks │ └── useSearch.jsx │ ├── useDetailinformation.jsx │ ├── usePagination.jsx │ └── useCurrentLocation.jsx ├── /components │ └── CaregiverList.jsx │ ├── heart.jsx │ └── multiselectDropdown.jsx └── App.jsx
💡 今後の展望（Next Step）
PWA（プッシュ通知、ホーム追加）対応
TypeScript によるコード改善・型安全性強化
📌 補足
このリポジトリはフロントエンド主体で、モックデータを使用した UX 重視の MVP 構成です。
今後はバックエンド連携・決済機能などの拡張も視野に入れて開発を進める予定です。

📎 詳細ドキュメント（Notion）
👉 企画書・画面設計・トラブルログはこちら

※ 上記リンクから、開発経緯・画面設計・機能仕様などの詳細をご確認いただけます。
