(function () {
  'use strict';

  var content = window.GALLERY_CONTENT || {};
  var works = window.GALLERY_STORIES || [];
  var keys = { orbit: 'project', sonic: 'sonic', cmaster: 'cmaster', city: 'city' };
  var panels = Array.from(document.querySelectorAll('[data-showcase-panel]'));
  var tabs = Array.from(document.querySelectorAll('[data-showcase-tab]'));
  var status = document.getElementById('showcase-status');
  var active = 'orbit';

  function setWork(id, moveFocus) {
    var selected = works.find(function (work) { return work.id === id; });
    if (!selected || !panels.length || !tabs.length) return;
    active = id;
    panels.forEach(function (panel) {
      var shown = panel.dataset.showcasePanel === id;
      panel.hidden = !shown;
      panel.setAttribute('aria-hidden', String(!shown));
    });
    tabs.forEach(function (tab) {
      var current = tab.dataset.showcaseTab === id;
      tab.setAttribute('aria-selected', String(current));
      tab.tabIndex = current ? 0 : -1;
      if (moveFocus && current) tab.focus();
    });
    if (status) status.textContent = '已选择' + selected.name + '，' + selected.status + '。';
    document.documentElement.style.setProperty('--showcase-accent', selected.accent);
  }

  if (panels.length && tabs.length) {
    var tabList = tabs[0].parentElement;
    tabList.setAttribute('role', 'tablist');
    tabs.forEach(function (tab) {
      var id = tab.dataset.showcaseTab;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'showcase-' + id);
      tab.addEventListener('click', function (event) {
        event.preventDefault();
        setWork(id, false);
        history.replaceState(history.state, '', location.pathname + location.search + '#showcase-' + id);
      });
      tab.addEventListener('keydown', function (event) {
        var index = tabs.indexOf(event.currentTarget);
        var next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== null) {
          event.preventDefault();
          var nextId = tabs[next].dataset.showcaseTab;
          setWork(nextId, true);
          history.replaceState(history.state, '', location.pathname + location.search + '#showcase-' + nextId);
        }
      });
    });
    panels.forEach(function (panel) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', 'tab-' + panel.dataset.showcasePanel);
      panel.tabIndex = 0;
    });

    var initial = location.hash.match(/^#showcase-(orbit|sonic|cmaster|city)$/);
    setWork(initial ? initial[1] : active, false);
    window.addEventListener('hashchange', function () {
      var match = location.hash.match(/^#showcase-(orbit|sonic|cmaster|city)$/);
      if (match) setWork(match[1], false);
    });
  }

  works.forEach(function (work) {
    var current = content[keys[work.id]];
    if (!current) return;
    work.name = current.title || work.name;
    work.version = current.version || current.edition || work.version;
    work.updated = current.updated || work.updated;
    work.url = current.url || work.url;
    work.repository = current.repository || work.repository;
    work.status = current.status || work.status;

    document.querySelectorAll('[data-showcase-name="' + work.id + '"]').forEach(function (node) {
      node.textContent = work.name;
    });
    document.querySelectorAll('[data-showcase-version="' + work.id + '"]').forEach(function (node) {
      node.textContent = work.version;
    });
    document.querySelectorAll('[data-showcase-status="' + work.id + '"]').forEach(function (node) {
      var indicator = node.querySelector('i');
      node.textContent = '';
      if (indicator) node.appendChild(indicator);
      node.appendChild(document.createTextNode(work.status));
    });

    var page = document.querySelector('[data-work="' + work.id + '"]');
    if (!page) return;
    var actionUrl = work.url === 'play/' ? new URL('../../play/', location.href).href : work.url;
    page.querySelectorAll('[data-work-action]').forEach(function (action) {
      action.href = actionUrl;
    });
    page.querySelectorAll('[data-work-action-label]').forEach(function (label) {
      label.textContent = current.action || work.action;
    });
    page.querySelectorAll('[data-work-repository]').forEach(function (repo) {
      repo.href = work.repository;
    });
    page.querySelectorAll('[data-work-version]').forEach(function (node) {
      node.textContent = work.version;
    });
    page.querySelectorAll('[data-work-updated]').forEach(function (node) {
      node.textContent = work.updated;
      node.dateTime = work.updated;
    });
    page.querySelectorAll('[data-work-status]').forEach(function (node) {
      node.textContent = work.status;
    });
    page.querySelectorAll('[data-work-name]').forEach(function (node) {
      node.textContent = work.name;
    });
    document.title = work.name + ' · 郝贵彬的作品介绍';
  });

  if (panels.length && tabs.length) setWork(active, false);

  document.querySelectorAll('[data-share-story]').forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', async function () {
      var message = button.parentElement.querySelector('[data-share-status]');
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(location.href);
        } else {
          var field = document.createElement('textarea');
          field.value = location.href;
          field.setAttribute('readonly', '');
          field.style.position = 'fixed';
          field.style.opacity = '0';
          document.body.appendChild(field);
          field.select();
          var copied = document.execCommand('copy');
          field.remove();
          if (!copied) throw new Error('Clipboard unavailable');
        }
        message.textContent = '作品链接已复制，可以分享给朋友。';
      } catch (error) {
        message.textContent = '无法自动复制，请复制浏览器地址栏中的链接。';
      }
    });
  });
})();
