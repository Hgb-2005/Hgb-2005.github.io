"""Build the static portfolio and browser trial without Python or databases."""
from pathlib import Path
import shutil
from build_orbit_trial import build_trial

root = Path(__file__).resolve().parents[1]
source = root / 'outputs' / 'personal-gallery'
target = (root / 'outputs' / 'site').resolve()
if target.parent != (root / 'outputs').resolve() or target.name != 'site':
    raise SystemExit('Unexpected build destination')
target.mkdir(parents=True, exist_ok=True)
# Keep the directory itself so a local preview server can use it as its cwd.
for old in target.iterdir():
    if old.is_symlink():
        old.unlink()
    elif old.is_dir():
        if not old.resolve().is_relative_to(target):
            raise SystemExit('Unexpected build entry')
        shutil.rmtree(old)
    else:
        old.unlink()
shutil.copy2(source / 'index.html', target / 'index.html')
shutil.copytree(source / 'assets', target / 'assets')
(target / 'assets' / 'deployment.js').write_text('window.GALLERY_STATIC_SITE = true;\n', encoding='utf-8')
build_trial(source / 'game', target / 'play')
(target / '.nojekyll').touch()
(target / '404.html').write_text('''<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>回到展览馆</title>
<body style="background:#080d0c;color:#d8edc5;font:18px/2 sans-serif;padding:10vw">
<h1>这条小径还没有展品。</h1><a href="/" style="color:inherit">回到郝贵彬的作品展览馆 →</a></body></html>''', encoding='utf-8')
assert not list(target.rglob('*.sqlite3'))
assert not list(target.rglob('*.py'))
print('Built static portfolio:', target)
