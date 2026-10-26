# 郝贵彬的个人作品展览馆

作品集：https://hgb-2005.github.io/

当前收藏两件展品：

- **微光球场 · ORBIT v0.10.0**：2v2 团队、手机摇杆与联机同步优化。
- **声波宇宙 · Sonic Universe 第十一版**：音乐星空、沉浸漫游、星际乐器、明信片与有声短片。在线体验：https://hgb-2005.github.io/sonic-universe/ ，源码：https://github.com/Hgb-2005/sonic-universe 。

- 游戏源码：https://github.com/Hgb-2005/orbit-game
- 版本与下载：https://github.com/Hgb-2005/orbit-game/releases/tag/v0.10.0
- `outputs/personal-gallery/`：完整本机展览馆，内含与游戏发布标签一致的游戏源码。
- `tools/build-pages.py`：生成 GitHub Pages 展厅与浏览器单机试玩。

## 互动工作室升级

首页是一间原创等距工作室：游戏机通向「微光球场」，星空装置通向「声波宇宙」，微光向导会回应点击与键盘操作。每件作品保留直接体验入口，并增加可展开的创作笔记。底部展厅导航支持手机、平板与桌面，动态效果可暂停，也会尊重系统的减少动态效果设置。

设计借鉴了 [Henry 的空间作品集](https://github.com/henryjeff/portfolio-website)、[Bruno Simon 的探索式导航](https://github.com/brunosimon/folio-2019)、[Craftzdog 的个人角色与工作室氛围](https://github.com/craftzdog/craftzdog-homepage)，以及 [Brittany Chiang 的项目信息层级](https://github.com/bchiang7/v4)。工作室、角色与展台使用本仓库原创 SVG、CSS 和 JavaScript 实现，作品画面来自自己的项目。

## 本机试玩

双击 `outputs/personal-gallery/start.bat`，浏览器打开 http://127.0.0.1:8766/ 。完整游戏位于 `/play/`，首次运行自动安装依赖。本机展厅单独创建数据库，不会覆盖原游戏的最高分。

## 网页版与发布

GitHub Pages 展示两件作品的介绍、真实截图和源码入口。声波宇宙可通过「进入宇宙」直接打开已发布的在线作品；展览馆不复制音乐库或草稿。微光球场的「试玩」在 `/play/` 打开浏览器单机版，也可以在详情展台内试玩，支持经典探索、5 分钟生存和手机摇杆。最高分保存在当前浏览器，与本机完整版数据库独立。联机需下载完整版并在同一局域网运行。

推送本仓库 `main` 分支会自动构建并部署作品集。构建复制展厅静态素材，并从发布标签的游戏前端生成单机试玩。`tools/build_orbit_trial.py` 渲染游戏模板，通过 `tools/orbit-trial/` 适配浏览器分数保存与单机界面；原版游戏文件保持与标签一致。构建对适配位置做精确检查，游戏更新改变这些位置时会失败并提示复核。Python 服务、数据库、虚拟环境与中间文件不会进入部署包。

游戏更新时，先在游戏仓库测试并发布，再运行 `tools/sync-orbit.py` 同步已发布标签；更新介绍或截图后提交本仓库即可重新部署。同步脚本不会复制数据库或虚拟环境。

声波宇宙的版本、介绍与链接集中在 `outputs/personal-gallery/assets/content.js` 的 `sonic` 字段，展位与详情在 `index.html`；预览素材为 `assets/sonic-blackhole.webp` 与 `assets/sonic-preview.webp`。以后更换作品入口或展示版本时，更新这些内容后推送本仓库即可。
