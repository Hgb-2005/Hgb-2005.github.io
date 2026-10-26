"""Build a browser-only trial from the exact game source shipped with the gallery."""
from pathlib import Path
import json
import re
import shutil


def replace_once(text: str, old: str, new: str) -> str:
    if text.count(old) != 1:
        raise ValueError(f'Game source changed; review the trial adapter: {old!r}')
    return text.replace(old, new, 1)


def build_trial(game: Path, destination: Path) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    shutil.copytree(game / 'static', destination / 'static')
    adapters = Path(__file__).parent / 'orbit-trial'
    shutil.copytree(adapters, destination / 'static' / 'js' / 'trial')

    html = (game / 'templates' / 'index.html').read_text(encoding='utf-8')
    html = re.sub(r"\{\{ url_for\('static', filename='([^']+)'\) \}\}",
                  lambda match: 'static/' + match[1], html)
    if '{{' in html or '{%' in html:
        raise ValueError('The browser trial contains an unrendered game template')
    html = replace_once(html, 'lang="zh-CN" data-theme="dark"',
                        'lang="zh-CN" data-theme="dark" data-static-trial')
    html = replace_once(html, '<a class="brand" href="/"', '<a class="brand" href="../#orbit-exhibit"')
    html = replace_once(html, '单机 / 局域网', '浏览器单机试玩')
    html = replace_once(html, '<option value="multiplayer">联机 · 真人 + 人机（最多 4 名）</option>', '')
    html = replace_once(html, '<meta name="description" content="微光球场：Flask 与 Canvas 吞噬游戏，支持生存乱斗、2v2 团队、真人与人机联机。">',
                        '<meta name="description" content="微光球场在线试玩，支持经典探索与 5 分钟生存，打开浏览器即可玩。">')
    html = replace_once(html, '轻量画布，纯粹乐趣。',
                        '单机试玩 · 最高分保存在当前浏览器。')
    version = json.loads((game / 'package.json').read_text(encoding='utf-8'))['version']
    release = f'https://github.com/Hgb-2005/orbit-game/releases/tag/v{version}'
    html = replace_once(html, '<footer class="page-footer">',
                        '<footer class="page-footer"><a href="../#orbit-exhibit" target="_top">← 返回作品集</a>'
                        f'<a href="{release}" '
                        'target="_blank" rel="noopener">下载完整版 · 局域网联机 ↗</a>')
    (destination / 'index.html').write_text(html, encoding='utf-8')

    entry = destination / 'static' / 'js' / 'main.js'
    text = entry.read_text(encoding='utf-8')
    for name, old_path, new_path in [
        ('ScoreService', './services/scores.js', './trial/scores.js'),
        ('GameUI', './ui.js', './trial/ui.js'),
        ('LobbyUI', './network/lobby-ui.js', './trial/lobby.js'),
    ]:
        text = replace_once(text, f'import {{ {name} }} from "{old_path}";',
                            f'import {{ {name} }} from "{new_path}";')
    text = replace_once(text, 'if (/^\\d{6}$/.test(',
                        'if (!document.documentElement.hasAttribute("data-static-trial") && /^\\d{6}$/.test(')
    entry.write_text(text, encoding='utf-8')
