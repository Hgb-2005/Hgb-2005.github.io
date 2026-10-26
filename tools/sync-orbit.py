"""Copy a released game tag into the local exhibit, preserving runtime data."""
import argparse
import io
import json
from pathlib import Path
import re
import subprocess
import zipfile

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, default=root.parent / '球球大作战')
parser.add_argument('--tag', required=True, help='Published tag, for example v0.10.0')
args = parser.parse_args()
if not re.fullmatch(r'v\d+\.\d+\.\d+', args.tag):
    parser.error('Expected a stable vX.Y.Z tag')

def git(*parts):
    return subprocess.check_output(['git', '-C', str(args.source), *parts])

commit = git('rev-parse', args.tag + '^{commit}').decode().strip()
date = git('show', '-s', '--format=%cs', commit).decode().strip()
archive = zipfile.ZipFile(io.BytesIO(git('archive', '--format=zip', commit)))
version = json.loads(archive.read('package.json'))['version']
if args.tag != 'v' + version:
    raise SystemExit('Tag and package version differ')
gallery = root / 'outputs' / 'personal-gallery'
game = (gallery / 'game').resolve()
manifest = gallery / 'orbit-version.json'
old = json.loads(manifest.read_text(encoding='utf-8')) if manifest.exists() else {'files': []}
files = {item.filename: archive.read(item) for item in archive.infolist() if not item.is_dir()}
for name in set(old['files']) | set(files):
    path = (game / name).resolve()
    if not path.is_relative_to(game):
        raise SystemExit('Unexpected archive path')
    if name in files:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(files[name])
    elif path.is_file():
        path.unlink()
manifest.write_text(json.dumps({'version': args.tag, 'commit': commit, 'date': date,
                                'files': sorted(files)}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
for target in [gallery / 'assets' / 'content.js', gallery / 'index.html']:
    text = re.sub(r'v\d+\.\d+\.\d+', args.tag, target.read_text(encoding='utf-8'))
    text = re.sub(r"updated: '[0-9-]+'", "updated: '" + date + "'", text)
    text = re.sub(r'(<time data-project-updated datetime=")[0-9-]+(">)[0-9-]+',
                  r'\g<1>' + date + r'\g<2>' + date, text)
    target.write_text(text, encoding='utf-8', newline='\n')
print('Synchronized', args.tag, commit, '—', len(files), 'source files; runtime data preserved.')
