# 🐍 贪吃蛇网页小游戏

纯前端（HTML / CSS / JavaScript，无需构建工具）实现的贪吃蛇游戏，可直接部署到 Vercel 的静态站点。

## 本地预览

直接用浏览器打开 `index.html` 即可，或用任意静态服务器：

```bash
npx serve snake-game
```

## 玩法

- 桌面端：方向键 / WASD 移动，空格键暂停
- 移动端：在棋盘上滑动方向，或使用屏幕下方的方向按钮
- 吃到食物 +10 分，随着分数提升蛇的移动速度会逐渐加快
- 撞墙或咬到自己身体则游戏结束，最高分会保存在浏览器本地（localStorage）

## 部署到 Vercel

### 方式一：Vercel 网页导入（推荐，无需安装任何工具）

1. 打开 https://vercel.com/new
2. 选择 Import 这个 GitHub 仓库：`ttcode10/ema-macd-rsi-confluence-signal`
3. 在项目设置里，把 **Root Directory** 设置为 `snake-game`
4. Framework Preset 选择 **Other**（纯静态站点，无需构建命令）
5. 点击 Deploy，几秒后即可获得线上访问链接

### 方式二：Vercel CLI

```bash
npm i -g vercel
cd snake-game
vercel        # 首次会提示登录 Vercel 账号
vercel --prod # 部署到生产环境
```

首次运行 `vercel` 会打开浏览器完成账号登录授权，这一步需要你本人在浏览器里完成。
