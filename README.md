# 未来の自分と対話 ✨

時空を超えて、未来のあなたからアドバイスをもらえるReactアプリケーション。

![Future Self Chat](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-cyan)

## 📱 機能

- **🔑 APIキー管理**: Anthropic APIキーをlocalStorageに安全に保存
- **📅 未来の年設定**: 西暦年または「○年後」で設定可能
- **💬 5つの会話モード**:
  - 💡 アドバイスモード - 未来の自分が今の悩みにアドバイス
  - 🔄 振り返りモード - 過去(今)を振り返って語る
  - 🎯 目標達成モード - 夢を叶えた自分として語る
  - ⚡ 現実チェックモード - 愛ある厳しめの助言
  - 🌟 励ましモード - とにかく応援してくれる
- **💬 チャット形式の対話**: リアルタイムでAIと会話
- **🎨 美しいUI**: グラデーション背景とモダンなデザイン

## 🚀 クイックスタート

### 前提条件

- Node.js 18.x 以上
- npm または yarn
- Anthropic APIキー（[こちらで取得](https://console.anthropic.com/settings/keys)）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yamanaka216002/nishi-seiko.git
cd nishi-seiko

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173/` を開いてください。

## 📖 使い方

1. **APIキーを入力**
   - [Anthropic Console](https://console.anthropic.com/settings/keys)でAPIキーを作成
   - アプリの最初のフィールドに貼り付け
   - 自動的にlocalStorageに保存されます

2. **未来の年を設定**
   - 西暦年（例: 2035）または「○年後」を入力

3. **会話モードを選択**
   - 5つのモードから好きなものを選択

4. **対話を始める**
   - 「対話を始める ✨」ボタンをクリック
   - 未来の自分とチャット開始！

## 🛠️ 技術スタック

- **React 19.2.0** - UIライブラリ
- **Vite 7.2.4** - ビルドツール
- **Tailwind CSS 4.1.17** - スタイリング
- **Lucide React** - アイコン
- **Anthropic Claude API** - AI会話エンジン

## 📦 ビルド

```bash
# プロダクションビルド（注: Tailwind CSS v4の設定調整が必要）
npm run build

# プレビュー
npm run preview
```

## 🔐 セキュリティ

- APIキーはブラウザのlocalStorageに保存されます
- サーバー側には送信されません
- ブラウザのストレージをクリアするとAPIキーも削除されます

## 🌐 デプロイ

### Vercel / Netlify

```bash
npm run build
```

生成された `dist` フォルダをデプロイしてください。

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

## 📝 ライセンス

MIT License

## 🤝 貢献

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📧 お問い合わせ

質問やフィードバックがあれば、Issueを作成してください。

---

**未来の自分と対話して、今日をより良くしましょう！** ✨
