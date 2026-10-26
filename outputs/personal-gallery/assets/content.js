/* 在这里修改个人信息和作品链接。网站和作品详情会共用这些内容。 */
window.GALLERY_CONTENT = {
  name: '郝贵彬',
  englishName: 'HAO GUIBIN',
  year: '2026',
  github: 'https://github.com/Hgb-2005',
  sonic: {
    title: '声波宇宙',
    subtitle: 'SONIC UNIVERSE / 音乐交互作品',
    description: '让旋律坠入星海。低音推动星环，旋律点亮星尘，在银河、山峰与引力黑洞之间，把一首歌变成可以漫游、演奏和收藏的宇宙。',
    edition: '第十一版',
    updated: '2026-10-26',
    url: 'https://hgb-2005.github.io/sonic-universe/',
    repository: 'https://github.com/Hgb-2005/sonic-universe'
  },
  project: {
    title: '微光球场',
    subtitle: '球球大作战 · ORBIT',
    description: '从小小一颗开始，吃掉微光，慢慢长大。v0.10.0 加入 2v2 团队、手机摇杆和联机同步优化，和朋友一起探索这个不断变化的小世界。',
    repository: 'https://github.com/Hgb-2005/orbit-game',
    version: 'v0.10.0',
    updated: '2026-10-26',
    release: 'https://github.com/Hgb-2005/orbit-game/releases/tag/v0.10.0',
    previewAvailable: true,
    /* 当前由同一个 Flask 服务提供真实游戏。以后单独部署游戏时可改成完整网址。 */
    url: 'play/'
  }
};

// GitHub Pages 的部署包仅展示作品与下载；本机 Flask 展厅保留真实试玩。
if (window.GALLERY_STATIC_SITE) {
  window.GALLERY_CONTENT.project.url = window.GALLERY_CONTENT.project.release;
  window.GALLERY_CONTENT.project.previewAvailable = false;
}
