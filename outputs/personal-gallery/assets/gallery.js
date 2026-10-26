(function () {
  'use strict';

  var content = window.GALLERY_CONTENT || {};
  var project = content.project || {};
  var sonic = content.sonic || {};
  document.querySelectorAll('[data-sonic-title]').forEach(function (node) { node.textContent = sonic.title || '声波宇宙'; });
  document.querySelectorAll('[data-sonic-subtitle]').forEach(function (node) { node.textContent = sonic.subtitle || 'SONIC UNIVERSE / 音乐交互作品'; });
  document.querySelectorAll('[data-sonic-description]').forEach(function (node) { if (sonic.description) node.textContent = sonic.description; });
  document.querySelectorAll('[data-sonic-edition]').forEach(function (node) { node.textContent = sonic.edition || '第十一版'; });
  document.querySelectorAll('[data-sonic-updated]').forEach(function (node) { if (sonic.updated) { node.textContent = sonic.updated; node.dateTime = sonic.updated; } });
  document.querySelectorAll('.sonic-link').forEach(function (node) { node.href = sonic.url || 'https://hgb-2005.github.io/sonic-universe/'; });
  document.querySelectorAll('[data-sonic-repository]').forEach(function (node) { node.href = sonic.repository || 'https://github.com/Hgb-2005/sonic-universe'; });
  document.querySelectorAll('[data-name]').forEach(function (node) { node.textContent = content.name || '郝贵彬'; });
  document.querySelectorAll('[data-year]').forEach(function (node) { node.textContent = content.year || '2026'; });
  document.querySelectorAll('[data-profile]').forEach(function (node) { node.href = content.github || 'https://github.com/Hgb-2005'; });
  document.querySelectorAll('[data-repository]').forEach(function (node) { node.href = project.repository || 'https://github.com/Hgb-2005/orbit-game'; });
  document.querySelectorAll('.play-link').forEach(function (node) { node.href = project.url || 'play/'; });
  document.querySelectorAll('[data-release]').forEach(function (node) { node.href = project.release || project.repository; });
  document.querySelectorAll('[data-project-version]').forEach(function (node) { node.textContent = project.version || ''; });
  document.querySelectorAll('[data-project-updated]').forEach(function (node) { node.textContent = project.updated || ''; });
  document.querySelectorAll('[data-play-label]').forEach(function (node) { node.textContent = '试玩'; });
  if (project.trialMode === 'browser') {
    document.querySelector('.preview-topbar .mono').textContent = 'ORBIT / BROWSER TRIAL';
    document.querySelector('[data-game-experience]').textContent = '单机试玩 / 完整版可联机';
    document.querySelector('.preview-curtain>span:not(.preview-orbit)').textContent = '经典探索 / 5 分钟生存 · 最高分保存在当前浏览器';
    document.querySelector('[data-trial-note]').textContent = '网页试玩支持单机经典与生存模式；下载完整版可与同一局域网的朋友联机。';
  }
  var titleNode = document.querySelector('[data-project-title]');
  if (titleNode && project.title) {
    titleNode.firstChild.textContent = project.title;
    titleNode.querySelector('.project-subtitle').textContent = project.subtitle;
  }
  if (project.description) document.querySelector('[data-project-description]').textContent = project.description;
  document.title = (content.name || '郝贵彬') + ' — 个人作品展览馆';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motionQuery.matches;
  var pointer = { x: 0.5, y: 0.5, active: false };
  var scrollProgress = document.querySelector('.scroll-progress');
  var dialog = document.getElementById('project-dialog');
  var lastFocus = null;
  function openProject() {
    lastFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    window.dispatchEvent(new CustomEvent('gallery:project-open'));
  }
  function closeProject() { dialog.close(); }
  document.getElementById('open-project').addEventListener('click', openProject);
  document.getElementById('open-project-art').addEventListener('click', openProject);
  document.querySelectorAll('.open-stage').forEach(function (node) { node.addEventListener('click', openProject); });
  document.getElementById('close-project').addEventListener('click', closeProject);
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeProject();
  });
  dialog.addEventListener('close', function () {
    document.body.classList.remove('dialog-open');
    window.dispatchEvent(new CustomEvent('gallery:project-close'));
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  });

  var sonicDialog = document.getElementById('sonic-dialog');
  var sonicFocus = null;
  document.querySelectorAll('[data-open-sonic]').forEach(function (button) {
    button.addEventListener('click', function () {
      sonicFocus = document.activeElement;
      sonicDialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  document.getElementById('close-sonic').addEventListener('click', function () { sonicDialog.close(); });
  sonicDialog.addEventListener('click', function (event) {
    if (event.target !== sonicDialog) return;
    var bounds = sonicDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) sonicDialog.close();
  });
  sonicDialog.addEventListener('close', function () {
    document.body.classList.remove('dialog-open');
    if (sonicFocus) sonicFocus.focus({ preventScroll: true });
  });

  if ('IntersectionObserver' in window && !reduced) {
    document.documentElement.classList.add('js-motion');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (node) { revealObserver.observe(node); });
  }
  function updateScroll() {
    var total = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (total > 0 ? window.scrollY / total * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  window.addEventListener('pointermove', function (event) {
    if (event.pointerType === 'touch') return;
    pointer.x = event.clientX / window.innerWidth;
    pointer.y = event.clientY / window.innerHeight;
    pointer.active = true;
  }, { passive: true });
  document.addEventListener('pointerleave', function () { pointer.active = false; });

  // 所有画面由本地 Canvas 绘制；无外部模型、素材或网络依赖。
  var seed = 28931;
  function random() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
  function setupCanvas(id) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');
    var state = { canvas: canvas, ctx: ctx, width: 0, height: 0, visible: true };
    function resize() {
      var rect = canvas.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      state.width = rect.width; state.height = rect.height;
      canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if ((reduced || paused) && cover) { lastFrame = 0; startAnimation(); }
    }
    state.resize = resize;
    new ResizeObserver(resize).observe(canvas);
    resize();
    return state;
  }
  var background = setupCanvas('atmosphere');
  var cover = setupCanvas('orbit-cover');
  if ('IntersectionObserver' in window) {
    var canvasObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target === cover.canvas) cover.visible = entry.isIntersecting;
        if (entry.isIntersecting && (reduced || paused)) { lastFrame = 0; startAnimation(); }
      });
    });
    canvasObserver.observe(cover.canvas);
  }
  var motes = Array.from({ length: 85 }, function () {
    return { x: random(), y: random(), r: 0.4 + random() * 1.5, phase: random() * Math.PI * 2, speed: .02 + random() * .045 };
  });
  var coverPoints = Array.from({ length: 100 }, function () {
    return { x: random(), y: random(), r: .8 + random() * 2, phase: random() * 6.28, color: Math.floor(random() * 4) };
  });
  var branches = Array.from({ length: 20 }, function (_, i) {
    return { x: i / 19, height: .15 + random() * .36, lean: (random() - .5) * .1, alpha: .022 + random() * .022 };
  });

  function glow(ctx, x, y, radius, rgb, alpha) {
    if (radius < .1) return;
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(' + rgb + ',' + alpha + ')');
    gradient.addColorStop(.3, 'rgba(' + rgb + ',' + alpha * .3 + ')');
    gradient.addColorStop(1, 'rgba(' + rgb + ',0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  function circle(ctx, x, y, radius, color) {
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
  }
  function cell(ctx, x, y, radius, rgb, opacity) {
    ctx.save(); ctx.globalAlpha = opacity || 1;
    glow(ctx, x, y, radius * 2.4, rgb, .1);
    var gradient = ctx.createRadialGradient(x - radius * .38, y - radius * .44, radius * .03, x + radius * .12, y + radius * .22, radius * 1.32);
    gradient.addColorStop(0, 'rgba(' + rgb + ',.9)');
    gradient.addColorStop(.15, 'rgba(' + rgb + ',.67)');
    gradient.addColorStop(.5, 'rgba(' + rgb + ',.25)');
    gradient.addColorStop(.82, 'rgba(' + rgb + ',.06)');
    gradient.addColorStop(1, 'rgba(' + rgb + ',.2)');
    circle(ctx, x, y, radius, gradient);
    ctx.strokeStyle = 'rgba(' + rgb + ',.35)'; ctx.lineWidth = .7;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, 6.283); ctx.stroke();
    ctx.beginPath(); ctx.arc(x - radius * .06, y - radius * .02, radius * .91, 3.65, 4.75);
    ctx.strokeStyle = 'rgba(' + rgb + ',.55)'; ctx.lineWidth = 1.3; ctx.stroke();
    glow(ctx, x - radius * .35, y - radius * .45, radius * .32, '238,255,221', .18);
    ctx.restore();
  }

  function drawBackground(t) {
    var ctx = background.ctx, w = background.width, h = background.height;
    ctx.clearRect(0, 0, w, h);
    glow(ctx, w * .78, h * .55, w * .48, '58,92,50', .12);
    branches.forEach(function (tree) {
      var x = tree.x * w, top = h * (1 - tree.height);
      ctx.strokeStyle = 'rgba(140,169,126,' + tree.alpha + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(x + tree.lean * w, top);
      for (var n = 1; n < 7; n++) {
        var y = h - (h - top) * n / 7;
        var tx = x + tree.lean * w * n / 7;
        var spread = w * .035 * (1 - n / 9);
        ctx.moveTo(tx - spread, y - h * .035); ctx.lineTo(tx, y); ctx.lineTo(tx + spread * .7, y - h * .045);
      }
      ctx.stroke();
    });
    motes.forEach(function (p, i) {
      var x = (p.x * w + Math.sin(t * p.speed + p.phase) * 25);
      var y = (p.y * h - t * p.speed * 6) % h;
      if (y < 0) y += h;
      var alpha = .12 + (Math.sin(t * .7 + p.phase) + 1) * .18;
      var targetX = pointer.x * w, targetY = pointer.y * h;
      if (pointer.active && i % 6 === 0) { x += (targetX - x) * .06; y += (targetY - y) * .06; }
      circle(ctx, x, y, p.r, 'rgba(185,226,144,' + alpha + ')');
      if (p.r > 1.4) glow(ctx, x, y, 8, '184,231,141', alpha * .2);
    });
  }

  function drawCover(t) {
    if (!cover.visible) return;
    var ctx = cover.ctx, w = cover.width, h = cover.height;
    if (w < 1 || h < 1) return;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(146,180,119,.065)'; ctx.lineWidth = .6;
    var spacing = 33;
    for (var x = 0; x < w; x += spacing) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (var y = 0; y < h; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    var palette = ['179,210,131', '155,181,195', '212,182,124', '186,160,195'];
    coverPoints.forEach(function (p) {
      var xx = p.x * w + Math.sin(t * .12 + p.phase) * 7;
      var yy = h * .12 + p.y * h * .67 + Math.cos(t * .1 + p.phase) * 5;
      circle(ctx, xx, yy, p.r, 'rgba(' + palette[p.color] + ',.6)');
    });
    var base = Math.min(w, h);
    var mainX = w * .52 + Math.sin(t * .23) * 7, mainY = h * .43 + Math.cos(t * .19) * 5;
    ctx.save(); ctx.strokeStyle = 'rgba(192,230,151,.13)'; ctx.setLineDash([2, 6]);
    ctx.beginPath(); ctx.arc(mainX, mainY, base * .26, 0, 6.283); ctx.stroke(); ctx.restore();
    cell(ctx, w * .2 + Math.sin(t * .18) * 8, h * .27, base * .066, '166,191,210', .8);
    cell(ctx, w * .83, h * .34 + Math.sin(t * .17) * 9, base * .104, '211,170,139', .75);
    cell(ctx, w * .73, h * .68, base * .055, '176,154,208', .7);
    cell(ctx, mainX, mainY, base * .18, '187,232,143', 1);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '11px Segoe UI, Microsoft YaHei, sans-serif'; ctx.fillStyle = '#e6f1db'; ctx.fillText('微光', mainX, mainY);
    ctx.font = '8px Consolas, monospace'; ctx.fillStyle = '#afc39b'; ctx.fillText('GROWING LITTLE BY LITTLE', mainX, mainY + base * .24); ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
  }

  var audioContext = null, audioGain = null, soundEnabled = false, oscillators = [];
  var soundToggle = document.getElementById('sound-toggle');
  var soundStatus = document.getElementById('sound-status');
  async function toggleSound() {
    try {
      if (!audioContext) {
        var AudioConstructor = window.AudioContext || window.webkitAudioContext;
        if (!AudioConstructor) { soundStatus.textContent = '当前浏览器不支持环境音。'; return; }
        audioContext = new AudioConstructor(); audioGain = audioContext.createGain(); audioGain.gain.value = 0; audioGain.connect(audioContext.destination);
        [130.81, 196, 261.63].forEach(function (frequency, index) {
          var oscillator = audioContext.createOscillator(); var gain = audioContext.createGain();
          oscillator.type = 'sine'; oscillator.frequency.value = frequency; oscillator.detune.value = index * 2 - 2;
          gain.gain.value = index === 0 ? .35 : .18; oscillator.connect(gain); gain.connect(audioGain); oscillator.start(); oscillators.push(oscillator);
        });
      }
      await audioContext.resume(); soundEnabled = !soundEnabled;
      audioGain.gain.setTargetAtTime(soundEnabled ? .065 : 0, audioContext.currentTime, .3);
      soundToggle.setAttribute('aria-pressed', String(soundEnabled));
      soundToggle.setAttribute('aria-label', soundEnabled ? '关闭环境音' : '开启环境音');
      soundToggle.querySelector('.sound-label').textContent = soundEnabled ? '声音开' : '声音关';
      soundStatus.textContent = soundEnabled ? '环境音已开启。' : '环境音已关闭。';
    } catch (error) { soundStatus.textContent = '环境音暂时无法播放，请再次点击重试。'; }
  }
  soundToggle.addEventListener('click', toggleSound);
  document.querySelectorAll('.play-link, .sonic-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (soundEnabled) void toggleSound();
    });
  });
  document.addEventListener('visibilitychange', function () {
    if (audioContext && audioGain) audioGain.gain.setTargetAtTime(document.hidden ? 0 : (soundEnabled ? .065 : 0), audioContext.currentTime, .2);
    if (!document.hidden) startAnimation();
  });

  var animationId = 0, lastFrame = 0;
  var paused = false;
  function render(time) {
    animationId = 0;
    if (document.hidden) return;
    if (time - lastFrame >= 32 || reduced || paused) {
      lastFrame = time;
      var t = reduced || paused ? 12 : time / 1000;
      drawBackground(t); drawCover(t);
    }
    if (!reduced && !paused) animationId = requestAnimationFrame(render);
  }
  function startAnimation() { if (!animationId) animationId = requestAnimationFrame(render); }
  motionQuery.addEventListener('change', function (event) { reduced = event.matches; if (animationId) cancelAnimationFrame(animationId); animationId = 0; lastFrame = 0; startAnimation(); });
  window.addEventListener('gallery:motion', function (event) { paused = event.detail.paused; if (animationId) cancelAnimationFrame(animationId); animationId = 0; lastFrame = 0; startAnimation(); });
  window.addEventListener('resize', function () { updateScroll(); if (reduced || paused) { lastFrame = 0; startAnimation(); } }, { passive: true });
  // 减少动态效果时，在画布进入视口后也画出完整的静态封面。
  if (reduced && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { if (entries.some(function (entry) { return entry.isIntersecting; })) { lastFrame = 0; startAnimation(); } }).observe(cover.canvas);
  }
  startAnimation();
})();
