# 郝贵彬的个人作品展览馆

作品集：https://hgb-2005.github.io/

当前收藏四件展品：

- **微光球场 · ORBIT v0.16.0**：独立练习场、缩圈乱斗、协作人机、对局档案、移动预测与手动选队。展厅内可体验单机经典、生存和练习场。
- **声波宇宙 · Sonic Universe 第十六版**：音乐星空、多层星云、四套星空氛围、沉浸漫游、星际乐器与有声短片。在线体验：https://hgb-2005.github.io/sonic-universe/ ，源码：https://github.com/Hgb-2005/sonic-universe 。
- **CMaster · C 语言学习平台**：12 章课程、60 道真实编译练习、166 张训练卡、知识图谱、私人学习笔记与记录导出。源码与本机启动说明：https://github.com/Hgb-2005/cmaster#readme 。这是 Flask 后端应用，作品集提供真实截图和启动说明，在线判题需自行运行后端。
- **掌心小城 · 第十四版「小城更近一点」**：自由建造、四季居民故事、天气、访客、相册与多城收藏，适配手机。在线体验：https://hgb-2005.github.io/palm-city/ ，源码：https://github.com/Hgb-2005/palm-city 。

## 第五版：作品故事与互动预览

每件作品新增可直接分享的独立故事页，记录创作起点、体验设计、已完成的成长阶段与第一次体验建议。作品区新增可切换预览台，支持键盘操作、深链接和手机布局；CMaster 状态明确标注为本机运行、云端待部署。故事数据集中在 `outputs/personal-gallery/assets/stories.json`，模板位于 `tools/templates/`，由 `tools/build_gallery_stories.py` 和 `tools/build-pages.py` 生成静态页面。

- 游戏源码：https://github.com/Hgb-2005/orbit-game
- 当前游戏源码：https://github.com/Hgb-2005/orbit-game/tree/43c1fddaa8da4722ff979f6e71200a7ebfdcfa64
- `outputs/personal-gallery/`：完整本机展览馆，内含与已发布游戏提交一致的源码；版本来源记录于 `orbit-version.json`。
- `tools/build-pages.py`：生成 GitHub Pages 展厅与浏览器单机试玩。

## 互动工作室升级

首页是一间原创等距工作室：游戏机通向「微光球场」，星空装置通向「声波宇宙」，墙上的代码屏通向 CMaster，桌角小岛通向「掌心小城」。微光向导会回应点击与键盘操作。四件作品都有版本信息、真实截图和可展开的创作笔记。底部展厅导航支持手机、平板与桌面，动态效果可暂停，也会尊重系统的减少动态效果设置。

设计借鉴了 [Henry 的空间作品集](https://github.com/henryjeff/portfolio-website)、[Bruno Simon 的探索式导航](https://github.com/brunosimon/folio-2019)、[Craftzdog 的个人角色与工作室氛围](https://github.com/craftzdog/craftzdog-homepage)，以及 [Brittany Chiang 的项目信息层级](https://github.com/bchiang7/v4)。工作室、角色与展台使用本仓库原创 SVG、CSS 和 JavaScript 实现，作品画面来自自己的项目。

## 本机试玩

双击 `outputs/personal-gallery/start.bat`，浏览器打开 http://127.0.0.1:8766/ 。完整游戏位于 `/play/`，首次运行自动安装依赖。本机展厅单独创建数据库，不会覆盖原游戏的最高分。

## 网页版与发布

GitHub Pages 展示四件作品的介绍、真实截图和源码入口。声波宇宙和掌心小城直接打开各自已发布的在线作品；展览馆不复制音乐、草稿、城市存档或学习记录。微光球场的「试玩」在 `/play/` 打开浏览器单机版，也可以在详情展台内试玩，支持经典、生存、练习场和手机摇杆。最高分与最近 20 局记录保存在当前浏览器，与本机完整版数据库独立。联机需运行完整版。CMaster 的「查看与启动」链接到仓库说明，按说明准备 Python 与 GCC 后在电脑运行。

推送本仓库 `main` 分支会自动构建并部署作品集。构建复制展厅静态素材，并从已发布提交的游戏前端生成单机试玩。`tools/build_orbit_trial.py` 用 Jinja2 渲染模板及子模板，通过 `tools/orbit-trial/` 适配浏览器分数、对局记录和单机界面；游戏快照本身保持与提交一致。构建对适配位置做精确检查，游戏更新改变这些位置时会失败并提示复核。Python 服务、数据库、虚拟环境与中间文件不会进入部署包。

本机构建：先运行 `python -m pip install -r tools/requirements-build.txt`，再运行 `python tools/build-pages.py`，生成目录为 `outputs/site/`。

游戏更新时，先在游戏仓库测试并发布、拉取远程状态，再运行 `python tools/sync-orbit.py --ref <已发布的提交号>` 或 `--tag <发布标签>`；更新介绍、版本、日期、源码链接与截图后提交本仓库即可重新部署。同步脚本只导出 Git 中的文件，不复制运行数据库或虚拟环境。

四件作品的版本、介绍与链接集中在 `outputs/personal-gallery/assets/content.js` 的 `project`、`sonic`、`cmaster`、`city` 字段，展位与无脚本时的备用文案在 `index.html`；对应预览图位于 `assets/`。以后更换作品入口或展示版本时，更新这些内容后推送本仓库即可。
