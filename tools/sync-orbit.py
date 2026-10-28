"""Copy a published game revision into the exhibit, preserving runtime data."""
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
revision = parser.add_mutually_exclusive_group(required=True)
revision.add_argument('--tag', help='Published tag, for example v0.10.0')
revision.add_argument('--ref', help='Published origin ref or full commit ID')
args = parser.parse_args()
if args.tag and not re.fullmatch(r'v\d+\.\d+\.\d+', args.tag):
    parser.error('Expected a stable vX.Y.Z tag')

def git(*parts):
    return subprocess.check_output(['git', '-C', str(args.source), *parts])

commit = git('rev-parse', (args.tag or args.ref) + '^{commit}').decode().strip()
if not git('branch', '-r', '--contains', commit).strip():
    raise SystemExit('Fetch first: revision must exist on a published remote branch')
date = git('show', '-s', '--format=%cs', commit).decode().strip()
archive = zipfile.ZipFile(io.BytesIO(git('archive', '--format=zip', commit)))
version = json.loads(archive.read('package.json'))['version']
if args.tag and args.tag != 'v' + version:
    raise SystemExit('Tag and package version differ')
version = 'v' + version
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
manifest.write_text(json.dumps({'version': version, 'commit': commit, 'date': date,
                                'files': sorted(files)}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Synchronized', version, commit, '—', len(files), 'source files; runtime data preserved.')
print('Update project metadata and notes in content.js and index.html before publishing.')
