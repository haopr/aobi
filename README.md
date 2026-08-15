# 奥比岛仓库

玩家共同维护的奥比岛资料站。当前已上线首页和「奥比岛 Wiki」，视听中心与考古稍后开放。

## 本地预览

```bash
npm install
npm run dev
```

浏览器打开 Honkit 提示的地址，即可阅读 Wiki。完整首页 + Wiki 请使用：

```bash
npm run preview
```

## 发布到 GitHub Pages

1. 把本仓库推到 GitHub
2. 在仓库 Settings → Pages 中选择 **GitHub Actions**
3. 推送到 `main` 或 `master` 后，Actions 会自动构建并发布

Wiki 正文仍在 `wiki/` 里用 Markdown 编写，图片在 `wiki/.topwrite/assets/`。
