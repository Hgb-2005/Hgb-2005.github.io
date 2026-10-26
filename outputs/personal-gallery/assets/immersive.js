(function () {
  'use strict';
  var root = document.documentElement;
  var motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  var paused = motionQuery.matches;
  try { paused = paused || localStorage.getItem('hgb-motion-paused') === 'true'; } catch (_) {}
  var motionButton = document.getElementById('motion-toggle');
  var header = document.querySelector('.site-header');
  var journey = document.getElementById('journey');
  var stage = journey.querySelector('.journey-stage');
  var chapters = Array.from(document.querySelectorAll('.story-chapter'));
  var chapterLinks = Array.from(document.querySelectorAll('.chapter-nav a'));
  var track = document.querySelector('.chapter-track i');
  var coordinate = document.getElementById('scene-coordinate');
  var aura = document.querySelector('.cursor-aura');
  var canvas = document.getElementById('journey-canvas');
  var ctx = canvas.getContext('2d');
  var width = 0, height = 0, mobile = false, stageVisible = false;
  var progress = 0, chapter = -1;
  var pointer = { x: .65, y: .5, smoothX: .65, smoothY: .5, inside: false };
  var phase = 0, frameId = 0, lastTime = 0;
  var stageTop = 0, scrollRange = 1;
  var observer = null;
  var dirty = true;
  var seed = 73021;
  function rand() { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function smooth(lo, hi, x) { var t = clamp((x - lo) / (hi - lo), 0, 1); return t * t * (3 - 2 * t); }

  function applyMotion() {
    document.body.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(!paused));
    motionButton.setAttribute('aria-label', paused ? '开启动效' : '暂停动态效果');
    motionButton.querySelector('.motion-label').textContent = paused ? '动态关' : '动态开';
    window.dispatchEvent(new CustomEvent('gallery:motion', { detail: { paused: paused } }));
    dirty = true;
    start();
  }
  motionButton.addEventListener('click', function () {
    paused = !paused;
    try { localStorage.setItem('hgb-motion-paused', String(paused)); } catch (_) {}
    applyMotion();
  });
  motionQuery.addEventListener('change', function (event) { paused = event.matches; chapter = -1; applyMotion(); updateScroll(); });

  function resize() {
    var rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height; mobile = width <= 740;
    var ratio = Math.min(devicePixelRatio || 1, mobile ? 1.35 : 1.6);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    var headerHeight = parseFloat(getComputedStyle(root).getPropertyValue('--header-height')) || 84;
    stageTop = journey.getBoundingClientRect().top + scrollY - headerHeight;
    scrollRange = Math.max(1, journey.offsetHeight - stage.offsetHeight);
    dirty = true;
    updateScroll();
    start();
  }
  new ResizeObserver(resize).observe(stage);
  function updateScroll() {
    header.classList.toggle('is-scrolled', scrollY > 30);
    progress = clamp((scrollY - stageTop) / scrollRange, 0, 1);
    var next = progress < .335 ? 0 : progress < .705 ? 1 : 2;
    track.style.width = (progress * 100) + '%';
    if (next !== chapter) {
      chapter = next;
      chapters.forEach(function (node, index) {
        node.classList.toggle('is-active', index === next);
        if (motionQuery.matches) node.removeAttribute('aria-hidden');
        else node.setAttribute('aria-hidden', String(index !== next));
        node.inert = !motionQuery.matches && index !== next;
      });
      chapterLinks.forEach(function (link, index) {
        if (index === next) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current');
      });
      coordinate.textContent = ['01 / FOREST OF IDEAS', '02 / THE CREATOR · HGB', '03 / A PORTAL TO PLAY'][next];
    }
    if (motionQuery.matches) chapters.forEach(function (node) { node.removeAttribute('aria-hidden'); node.inert = false; });
    dirty = true;
    start();
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) { stageVisible = entries[0].isIntersecting; dirty = true; start(); }, { rootMargin: '70px' });
    observer.observe(stage);
  } else stageVisible = true;
  var floorLinks = Array.from(document.querySelectorAll('.space-nav a'));
  var floorSections = floorLinks.map(function (link) { return document.querySelector(link.getAttribute('href')); });
  var floorPositions = [];
  function updateFloorPositions() { floorPositions = floorSections.map(function (section) { return section.getBoundingClientRect().top + scrollY; }); }
  function updateFloor() {
    var active = 0;
    floorPositions.forEach(function (top, index) { if (scrollY + innerHeight * .43 >= top) active = index; });
    floorLinks.forEach(function (link, index) { if (index === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }
  window.addEventListener('scroll', updateFloor, { passive: true });
  new ResizeObserver(function () { updateFloorPositions(); updateFloor(); }).observe(document.querySelector('main'));
  window.addEventListener('resize', function () { resize(); updateFloorPositions(); updateFloor(); }, { passive: true });

  // 保留系统光标；光环只作为可交互物体的轻提示。
  document.addEventListener('pointermove', function (event) {
    if (event.pointerType === 'touch' || !finePointer.matches) return;
    if (!paused) {
      aura.style.left = event.clientX + 'px'; aura.style.top = event.clientY + 'px';
      aura.classList.add('is-active');
      aura.classList.toggle('is-link', Boolean(event.target.closest('a,button')));
    }
    var rect = stage.getBoundingClientRect();
    pointer.x = clamp(event.clientX / innerWidth, 0, 1);
    pointer.y = clamp((event.clientY - rect.top) / Math.max(height, 1), 0, 1);
    pointer.inside = event.clientY >= rect.top && event.clientY <= rect.bottom;
    dirty = true;
    start();
  }, { passive: true });
  document.addEventListener('pointerout', function (event) { if (!event.relatedTarget) { aura.classList.remove('is-active'); pointer.inside = false; } });
  var projectArt = document.querySelector('.project-art');
  projectArt.addEventListener('pointermove', function (event) {
    if (!finePointer.matches || paused) return;
    var rect = projectArt.getBoundingClientRect();
    var x = clamp((event.clientX - rect.left) / rect.width, 0, 1), y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    projectArt.classList.add('is-pointer');
    projectArt.style.setProperty('--tilt-x', ((.5 - y) * 5) + 'deg');
    projectArt.style.setProperty('--tilt-y', ((x - .5) * 6) + 'deg');
    projectArt.style.setProperty('--light-x', (x * 100) + '%');
    projectArt.style.setProperty('--light-y', (y * 100) + '%');
  }, { passive: true });
  projectArt.addEventListener('pointerleave', function () { projectArt.classList.remove('is-pointer'); });
  var heroArt = document.querySelector('.hero-art');
  heroArt.addEventListener('pointerenter', function () { heroArt.classList.add('is-hovered'); });
  heroArt.addEventListener('pointerleave', function () { heroArt.classList.remove('is-hovered'); });

  // 用点云在树林、署名和入口环之间变形，保留真正的深度与视差。
  var textCanvas = document.createElement('canvas');
  textCanvas.width = 520; textCanvas.height = 180;
  var textCtx = textCanvas.getContext('2d', { willReadFrequently: true });
  textCtx.fillStyle = '#fff'; textCtx.font = '700 145px Arial, sans-serif'; textCtx.textAlign = 'center'; textCtx.textBaseline = 'middle';
  textCtx.fillText('HGB', 260, 99);
  var pixels = textCtx.getImageData(0, 0, 520, 180).data;
  var glyph = [];
  for (var ty = 0; ty < 180; ty += 4) {
    for (var tx = 0; tx < 520; tx += 4) {
      if (pixels[(ty * 520 + tx) * 4 + 3] > 100) glyph.push({ x: (tx - 260) / 132, y: (ty - 99) / 132 });
    }
  }
  var particles = [];
  var trees = [];
  for (var tr = 0; tr < 25; tr++) trees.push({ x: (rand() - .5) * 8.5, z: rand() * 5.2 - .4, height: 1.7 + rand() * 1.5, width: .26 + rand() * .2 });
  for (var i = 0; i < 1450; i++) {
    var tree = trees[i % trees.length];
    var along = rand();
    var spread = tree.width * (1 - along) * 2;
    var text = glyph[Math.floor(rand() * glyph.length)];
    var angle = i / 1450 * Math.PI * 2 * 3;
    var tube = rand() * Math.PI * 2;
    particles.push({
      forest: { x: tree.x + (rand() - .5) * spread * 2, y: 1.25 - along * tree.height, z: tree.z + (rand() - .5) * spread },
      signature: { x: text.x, y: text.y, z: (rand() - .5) * .32 },
      portal: { x: (1.01 + Math.cos(tube) * .11) * Math.cos(angle), y: (1.28 + Math.cos(tube) * .12) * Math.sin(angle), z: Math.sin(tube) * .13 },
      size: .55 + rand() * 1.15, alpha: .25 + rand() * .65, phase: rand() * Math.PI * 2
    });
  }
  var fireflies = Array.from({ length: 74 }, function () { return { x: rand(), y: rand(), r: .5 + rand() * 1.5, phase: rand() * 6.283 }; });
  function glow(x, y, radius, rgb, alpha) {
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(' + rgb + ',' + alpha + ')');
    gradient.addColorStop(.35, 'rgba(' + rgb + ',' + alpha * .27 + ')');
    gradient.addColorStop(1, 'rgba(' + rgb + ',0)');
    ctx.fillStyle = gradient; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  function dot(x, y, radius, color) { ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); }
  function projectPoint(p, turn, cx, cy, size) {
    var x = p.x * Math.cos(turn) + p.z * Math.sin(turn);
    var z = -p.x * Math.sin(turn) + p.z * Math.cos(turn);
    var pitch = mobile ? -.05 : -.10;
    var y = p.y * Math.cos(pitch) - z * Math.sin(pitch);
    z = p.y * Math.sin(pitch) + z * Math.cos(pitch);
    var scale = 4.6 / (4.6 + z);
    return { x: cx + x * size * scale, y: cy + y * size * scale, z: z, scale: scale };
  }
  function draw(t) {
    if (width < 2 || height < 2) return;
    ctx.clearRect(0, 0, width, height);
    var intoSignature = smooth(.12, .49, progress);
    var intoPortal = smooth(.55, .9, progress);
    var forestPresence = 1 - intoSignature;
    var size = Math.min(width * (mobile ? .335 : .235), height * (mobile ? .23 : .36));
    var cx = width * (mobile ? .52 : .695), cy = height * (mobile ? .655 : .51);
    var turn = Math.sin(t * .16) * .15 + (pointer.smoothX - .5) * (mobile ? 0 : .28);
    var portalTurn = Math.sin(t * .22) * .32;
    glow(cx, cy, size * 2.25, '131,185,80', .11 + intoPortal * .035);
    glow(width * .15, height * .75, width * .5, '55,90,63', .08 * forestPresence);
    // 倾斜的微光束与消失点营造树林纵深。
    ctx.save(); ctx.globalAlpha = forestPresence;
    var beam = ctx.createLinearGradient(width * .7, 0, width * .3, height);
    beam.addColorStop(0, '#a4d89300'); beam.addColorStop(.3, '#a4d89309'); beam.addColorStop(1, '#a4d89300');
    for (var b = 0; b < 5; b++) {
      ctx.fillStyle = beam; ctx.beginPath();
      ctx.moveTo(width * (.35 + b * .16), 0); ctx.lineTo(width * (.38 + b * .16), 0); ctx.lineTo(width * (.08 + b * .13), height); ctx.lineTo(width * (.03 + b * .13), height); ctx.fill();
    }
    trees.forEach(function (tree) {
      var bottom = projectPoint({ x: tree.x, y: 1.25, z: tree.z }, turn * .3, cx, cy, size);
      var top = projectPoint({ x: tree.x, y: 1.25 - tree.height, z: tree.z }, turn * .3, cx, cy, size);
      ctx.strokeStyle = 'rgba(167,203,137,' + .055 / (1 + tree.z * .2) + ')'; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.moveTo(bottom.x, bottom.y); ctx.lineTo(top.x, top.y);
      for (var branch = 1; branch < 8; branch++) {
        var f = branch / 8;
        var mid = projectPoint({ x: tree.x, y: 1.25 - tree.height * f, z: tree.z }, turn * .3, cx, cy, size);
        var end = projectPoint({ x: tree.x + tree.width * (1 - f) * 1.8, y: 1.25 - tree.height * f - .22, z: tree.z }, turn * .3, cx, cy, size);
        ctx.moveTo(mid.x - (end.x - mid.x), end.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y);
      }
      ctx.stroke();
    });
    ctx.restore();
    // 地台与同心椭圆，随着叙事过渡进入数字空间。
    ctx.save(); ctx.globalAlpha = .10 + intoSignature * .6;
    var floorY = cy + size * 1.38;
    for (var ring = 1; ring <= 4; ring++) {
      ctx.beginPath(); ctx.ellipse(cx, floorY, size * ring * .39, size * ring * .065, 0, 0, Math.PI * 2);
      ctx.lineWidth = .6; ctx.strokeStyle = 'rgba(176,219,135,' + (.3 - ring * .045) + ')'; ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(cx - size * 1.9, floorY); ctx.lineTo(cx + size * 1.9, floorY); ctx.strokeStyle = '#a9d78c14'; ctx.stroke();
    ctx.restore();
    fireflies.forEach(function (p, index) {
      var x = p.x * width + Math.sin(t * .12 + p.phase) * 20;
      var y = (p.y * height - t * 2.2) % height; if (y < 0) y += height;
      if (pointer.inside && index % 4 === 0) { x = mix(x, pointer.smoothX * width, .12); y = mix(y, pointer.smoothY * height, .12); }
      var alpha = .08 + (Math.sin(t * .75 + p.phase) + 1) * .14;
      dot(x, y, p.r, 'rgba(185,220,147,' + alpha + ')');
      if (index % 17 === 0) glow(x, y, 15, '193,236,151', alpha * .3);
    });
    // 中心点云：树林 → 创作者署名 → 可进入的发光入口。
    var count = mobile ? 920 : particles.length;
    for (var i = 0; i < count; i++) {
      var p = particles[i];
      var a = p.forest, s = p.signature, portal = p.portal;
      var portalX = portal.x * Math.cos(portalTurn) + portal.z * Math.sin(portalTurn);
      var portalZ = -portal.x * Math.sin(portalTurn) + portal.z * Math.cos(portalTurn);
      var breathing = Math.sin(t * .55 + p.phase) * .018;
      var xx = mix(mix(a.x, s.x, intoSignature), portalX, intoPortal) + breathing;
      var yy = mix(mix(a.y, s.y, intoSignature), portal.y, intoPortal) + breathing;
      var zz = mix(mix(a.z, s.z, intoSignature), portalZ, intoPortal);
      var point = projectPoint({ x: xx, y: yy, z: zz }, turn * (1 - intoPortal * .6), cx, cy, size);
      if (point.x < -5 || point.x > width + 5 || point.y < -5 || point.y > height + 5) continue;
      var alpha = clamp(p.alpha * point.scale * (.75 + Math.sin(t * .5 + p.phase) * .18), .05, .9);
      var r = p.size * clamp(point.scale, .4, 1.6) * (mobile ? .8 : 1);
      var dx = point.x - pointer.smoothX * width, dy = point.y - pointer.smoothY * height;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (pointer.inside && distance < 80 && distance > 1 && !paused) {
        var push = (1 - distance / 80) * 11;
        point.x += dx / distance * push; point.y += dy / distance * push; alpha = clamp(alpha + .25, 0, 1);
      }
      dot(point.x, point.y, r, 'rgba(' + (i % 11 === 0 ? '214,241,187' : i % 7 === 0 ? '134,207,181' : '178,218,135') + ',' + alpha + ')');
    }
    // 署名扫描线与入口光核。
    if (intoSignature > .1 && intoPortal < .95) {
      var textOpacity = intoSignature * (1 - intoPortal);
      ctx.save(); ctx.globalAlpha = textOpacity;
      var scanY = cy - size * .5 + ((t * .14) % 1) * size * 1.05;
      var scan = ctx.createLinearGradient(cx - size * 1.5, scanY, cx + size * 1.5, scanY);
      scan.addColorStop(0, '#a4e67700'); scan.addColorStop(.5, '#bff79340'); scan.addColorStop(1, '#a4e67700');
      ctx.fillStyle = scan; ctx.fillRect(cx - size * 1.6, scanY, size * 3.2, 1);
      ctx.strokeStyle = '#b2dd8d38'; ctx.lineWidth = .8;
      [-1, 1].forEach(function (side) {
        var x = cx + size * 1.55 * side;
        ctx.beginPath(); ctx.moveTo(x - side * 12, cy - size * .75); ctx.lineTo(x, cy - size * .75); ctx.lineTo(x, cy - size * .75 + 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - side * 12, cy + size * .75); ctx.lineTo(x, cy + size * .75); ctx.lineTo(x, cy + size * .75 - 12); ctx.stroke();
      });
      ctx.fillStyle = '#95b580'; ctx.font = '8px Consolas, monospace'; ctx.textAlign = 'center'; ctx.fillText('HAO GUIBIN / CREATIVE IDENTITY', cx, cy + size * .89); ctx.restore();
    }
    if (intoPortal > .1) {
      ctx.save(); ctx.globalAlpha = intoPortal;
      glow(cx, cy, size * .83, '190,239,142', .16);
      for (var ring2 = 0; ring2 < 3; ring2++) {
        ctx.beginPath(); ctx.ellipse(cx, cy, size * (1.01 + ring2 * .085), size * (1.28 + ring2 * .085), -.05, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(187,231,144,' + (.16 - ring2 * .035) + ')'; ctx.lineWidth = .6; ctx.stroke();
      }
      var central = size * .33;
      glow(cx, cy, central, '216,250,180', .17);
      ctx.textAlign = 'center'; ctx.fillStyle = '#d8edc5'; ctx.font = (mobile ? '11' : '15') + 'px Consolas, monospace'; ctx.fillText('ORBIT', cx, cy - 3);
      ctx.fillStyle = '#93ad80'; ctx.font = (mobile ? '6' : '8') + 'px Consolas, monospace'; ctx.fillText('A SMALL WORLD AWAITS', cx, cy + 18); ctx.restore();
    }
    // 静态分辨率标尺。
    ctx.fillStyle = '#6f8b5e88'; ctx.font = '7px Consolas, monospace';
    if (!mobile) { ctx.fillText('X ' + (progress * 100).toFixed(1) + ' / Y 26.10', width * .88, height * .31); ctx.fillText('HGB — EST. 2026', width * .51, height * .2); }
  }

  function frame(now) {
    frameId = 0;
    if (document.hidden || !stageVisible) return;
    if (now - lastTime >= 31 || dirty) {
      var elapsed = Math.min(.06, (now - lastTime) / 1000 || .033);
      if (!paused) phase += elapsed;
      lastTime = now;
      pointer.smoothX = mix(pointer.smoothX, pointer.x, .08); pointer.smoothY = mix(pointer.smoothY, pointer.y, .08);
      draw(phase + 6);
      dirty = false;
    }
    if (!paused) frameId = requestAnimationFrame(frame);
  }
  function start() { if (!frameId && !document.hidden && stageVisible) frameId = requestAnimationFrame(frame); }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { lastTime = performance.now(); dirty = true; start(); } });

  // 作品详情只在打开时加载真实游戏，关闭即释放，避免后台运行。
  var previewFrame = document.getElementById('game-preview');
  var previewBox = document.querySelector('.live-preview');
  var previewStatus = document.getElementById('preview-state');
  var previewButton = document.getElementById('activate-preview');
  var stopButton = document.getElementById('stop-preview');
  var ready = false, open = false, timeout = 0;
  function leavePreview() {
    previewBox.classList.remove('is-playing');
    previewFrame.tabIndex = -1;
    stopButton.hidden = true;
    previewStatus.hidden = false;
    if (ready) previewStatus.textContent = '可在展厅内试玩';
  }
  function preparePreview() {
    open = true; ready = false;
    leavePreview();
    var project = (window.GALLERY_CONTENT && window.GALLERY_CONTENT.project) || {};
    var url = project.url || 'play/';
    if (project.previewAvailable === false) {
      previewBox.classList.add('is-static');
      clearTimeout(timeout);
      previewFrame.removeAttribute('src');
      previewStatus.textContent = project.version + ' · 完整版可下载';
      previewButton.hidden = true;
      document.querySelector('.preview-offline').hidden = false;
      return;
    }
    if (location.protocol === 'file:') {
      previewStatus.textContent = '游戏画面'; previewButton.hidden = true;
      document.querySelector('.preview-offline').hidden = false; return;
    }
    previewButton.hidden = false; previewButton.disabled = true;
    previewStatus.textContent = '正在准备预览…';
    var target = new URL(url, location.href);
    target.searchParams.set('exhibit', '1');
    previewFrame.src = target.href;
    clearTimeout(timeout);
    timeout = setTimeout(function () { if (open && !ready) { previewStatus.textContent = '可使用独立窗口打开'; previewButton.disabled = true; } }, 12000);
  }
  previewFrame.addEventListener('load', function () {
    if (!open || !previewFrame.hasAttribute('src')) return;
    clearTimeout(timeout); ready = true; previewBox.classList.add('is-ready'); previewStatus.textContent = '可在展厅内试玩'; previewButton.disabled = false;
    try {
      // 从预览返回首页仍留在作品展台中。
      var brand = previewFrame.contentDocument.querySelector('a.brand');
      if (brand) brand.href = new URL('play/', location.href).href;
    } catch (_) {}
  });
  previewButton.addEventListener('click', function () {
    if (!ready) return;
    previewBox.classList.add('is-playing'); previewFrame.tabIndex = 0;
    stopButton.hidden = false; previewStatus.hidden = true;
    previewFrame.focus();
    // 展台内的游戏开始时，关闭展厅环境音，声音交给游戏控制。
    var sound = document.getElementById('sound-toggle');
    if (sound.getAttribute('aria-pressed') === 'true') sound.click();
  });
  stopButton.addEventListener('click', function () {
    preparePreview();
    document.getElementById('close-project').focus();
  });
  window.addEventListener('gallery:project-open', preparePreview);
  window.addEventListener('gallery:project-close', function () {
    open = false; ready = false; clearTimeout(timeout); leavePreview(); previewBox.classList.remove('is-ready'); previewFrame.removeAttribute('src');
  });
  applyMotion();
  resize(); updateFloorPositions(); updateFloor(); updateScroll();
})();
