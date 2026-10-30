/* 在这里修改个人信息和作品链接。网站和作品详情会共用这些内容。 */
window.GALLERY_CONTENT = {
  name: '郝贵彬',
  englishName: 'HAO GUIBIN',
  year: '2026',
  github: 'https://github.com/Hgb-2005',
  sonic: {
    title: '声波宇宙',
    subtitle: '音乐星空 · SONIC UNIVERSE',
    status: '浏览器可体验',
    description: '让音乐成为星空。第十六版把声音的起落化为层层星云：低频托起雾层，中频留下星轨，高频点亮微光。漫游、演奏，再把此刻存成明信片或有声短片。',
    edition: '第十六版',
    updated: '2026-10-28',
    url: 'https://hgb-2005.github.io/sonic-universe/',
    repository: 'https://github.com/Hgb-2005/sonic-universe'
  },
  project: {
    title: '微光球场',
    subtitle: '球球大作战 · ORBIT',
    description: '从小小一颗开始，吃掉微光，慢慢长大。v0.16.0 带来独立练习场、缩圈乱斗、协作人机与对局档案；联机加入移动预测和手动选队，让每次追逐更有回应。',
    status: '浏览器可试玩',
    repository: 'https://github.com/Hgb-2005/orbit-game',
    version: 'v0.16.0',
    updated: '2026-10-29',
    release: 'https://github.com/Hgb-2005/orbit-game/tree/43c1fddaa8da4722ff979f6e71200a7ebfdcfa64',
    previewAvailable: true,
    /* 当前由同一个 Flask 服务提供真实游戏。以后单独部署游戏时可改成完整网址。 */
    url: 'play/'
  },
  cmaster: {
    title: 'CMaster',
    subtitle: 'C 语言学习平台 / 从读懂到写对',
    status: '本机运行 · 云端待部署',
    description: '把第一行 C 代码，变成可以走下去的学习旅程。12 章课程、60 道真实编译练习与 166 张训练卡，串起知识图谱、内存演示和个人学习笔记。',
    edition: '安全判题与部署准备',
    updated: '2026-10-29',
    repository: 'https://github.com/Hgb-2005/cmaster',
    url: 'http://127.0.0.1:5001/'
  },
  city: {
    title: '掌心小城',
    subtitle: 'PALM CITY / 一座慢慢生长的小岛',
    status: '浏览器可试玩',
    description: '放下一间小屋，铺一条通向邻居的路。不用赶进度，在四季、天气与居民的小故事里，慢慢搭建自己的岛屿。第十四版让手机取景更亲近，每次安放都留下轻柔回应。',
    edition: '第十四版 · 小城更近一点',
    updated: '2026-10-29',
    repository: 'https://github.com/Hgb-2005/palm-city',
    url: 'https://hgb-2005.github.io/palm-city/'
  }
};

// GitHub Pages 提供浏览器单机试玩；本机 Flask 展厅继续支持完整联机游戏。
if (window.GALLERY_STATIC_SITE) {
  window.GALLERY_CONTENT.project.trialMode = 'browser';
}
