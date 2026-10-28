(function () {
  'use strict';

  var studio = document.querySelector('.studio');
  if (!studio) return;
  var scene = studio.querySelector('.studio-scene');
  var hint = document.getElementById('studio-hint');
  var companion = studio.querySelector('.room-companion');
  var eyes = studio.querySelector('.companion-eyes');
  var announcement = document.getElementById('studio-announcement');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var fine = matchMedia('(hover: hover) and (pointer: fine)');
  var paused = document.body.classList.contains('motion-paused');
  var hints = {
    all: '小小的工作室，装着大大的好奇心。',
    orbit: '第一站，吃掉微光，长成自己的世界。',
    sonic: '听见星云的呼吸，让音乐点亮宇宙。',
    cmaster: '从第一行 C 代码，走到自己的小程序。',
    city: '慢一点，在掌心搭建一座有故事的小城。'
  };
  var greetings = [
    '你好，我是微光。欢迎来郝贵彬的工作室！',
    '左边的游戏机，可以带你去玩一局微光球场。',
    '右边的星空装置，藏着一个用音乐点亮的宇宙。',
    '墙上的代码屏，是学习 C 语言的起点。',
    '桌角的小岛，装着四季、邻居和慢慢生长的故事。',
    '下方的展厅导航，可以随时带你去想看的地方。'
  ];
  var greeting = 0, greetingTimer = 0, pointerFrame = 0, position = null;
  function highlight(key) {
    studio.dataset.active = key;
    hint.textContent = hints[key] || hints.all;
  }
  studio.querySelectorAll('[data-room-target]').forEach(function (target) {
    function enter() { highlight(target.dataset.roomTarget); }
    function leave() {
      var focused = document.activeElement.closest('[data-room-target]');
      highlight(focused && studio.contains(focused) ? focused.dataset.roomTarget : 'all');
    }
    target.addEventListener('pointerenter', enter);
    target.addEventListener('pointerleave', leave);
    target.addEventListener('focus', enter);
    target.addEventListener('blur', function () { highlight('all'); });
  });
  function resetView() {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    studio.style.removeProperty('--room-x');
    studio.style.removeProperty('--room-y');
    eyes.removeAttribute('transform');
  }
  scene.addEventListener('pointermove', function (event) {
    if (paused || reduced.matches || !fine.matches || event.pointerType === 'touch') return;
    var bounds = scene.getBoundingClientRect();
    position = {
      x: Math.max(-.5, Math.min(.5, (event.clientX - bounds.left) / bounds.width - .5)),
      y: Math.max(-.5, Math.min(.5, (event.clientY - bounds.top) / bounds.height - .5))
    };
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(function () {
      pointerFrame = 0;
      studio.style.setProperty('--room-x', (-position.y * 4).toFixed(2) + 'deg');
      studio.style.setProperty('--room-y', (position.x * 6).toFixed(2) + 'deg');
      eyes.setAttribute('transform', 'translate(' + (position.x * 3).toFixed(2) + ' ' + (position.y * 2).toFixed(2) + ')');
    });
  }, { passive: true });
  scene.addEventListener('pointerleave', resetView);
  function greet() {
    highlight('all');
    hint.textContent = greetings[greeting++ % greetings.length];
    announcement.textContent = hint.textContent;
    companion.classList.remove('is-greeting');
    clearTimeout(greetingTimer);
    // Restart only on a deliberate click; normal animation remains pausable.
    if (!paused && !reduced.matches) {
      void companion.getBoundingClientRect();
      companion.classList.add('is-greeting');
      greetingTimer = setTimeout(function () { companion.classList.remove('is-greeting'); }, 650);
    }
  }
  companion.addEventListener('click', greet);
  companion.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); greet(); }
  });
  window.addEventListener('gallery:motion', function (event) {
    paused = event.detail.paused;
    if (paused) resetView();
  });
  reduced.addEventListener('change', resetView);

  // Pause decorative SVG/CSS motion outside the viewport or in background tabs.
  var surfaces = [studio, document.querySelector('.sonic-art')].filter(Boolean);
  var visible = new Map();
  function updateVisibility() {
    surfaces.forEach(function (surface) {
      surface.classList.toggle('is-outside', document.hidden || visible.get(surface) === false);
    });
    if (document.hidden) resetView();
  }
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible.set(entry.target, entry.isIntersecting); });
      updateVisibility();
    }, { rootMargin: '60px' });
    surfaces.forEach(function (surface) { observer.observe(surface); });
  }
  document.addEventListener('visibilitychange', updateVisibility);
})();
