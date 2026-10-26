# 郝贵彬的个人作品展览馆

作品集：https://hgb-2005.github.io/

当前展品：微光球场 · ORBIT **v0.10.0**，包含 2v2 团队、手机摇杆与联机同步优化。

- 游戏源码：https://github.com/Hgb-2005/orbit-game
- 版本与下载：https://github.com/Hgb-2005/orbit-game/releases/tag/v0.10.0
- `outputs/personal-gallery/`：完整本机展览馆，内含与游戏发布标签一致的游戏源码。
- `tools/build-pages.py`：生成仅含展厅页面、静态素材与下载入口的 GitHub Pages 版本。

## 本机试玩

双击 `outputs/personal-gallery/start.bat`，浏览器打开 http://127.0.0.1:8766/ 。完整游戏位于 `/play/`，首次运行自动安装依赖。本机展厅单独创建数据库，不会覆盖原游戏的最高分。

## 网页版与发布

GitHub Pages 展示作品介绍、新版截图、版本与游戏下载入口。它不能运行 Flask 或 WebSocket 游戏服务，因此网页版不显示展厅内试玩按钮。下载游戏后可运行单机，或在同一局域网联机。

推送本仓库 `main` 分支会自动构建并部署作品集。构建只复制 `index.html` 与 `assets/`；游戏服务、数据库、虚拟环境与中间文件不会进入站点部署包。

游戏更新时，先在游戏仓库测试并发布，再运行 `tools/sync-orbit.py` 同步已发布标签；更新介绍或截图后提交本仓库即可重新部署。同步脚本不会复制数据库或虚拟环境。
