"""Render accessible static case studies from the shared work stories."""
import json
from pathlib import Path
import re

from jinja2 import Environment, FileSystemLoader, select_autoescape


def build_stories(source, target):
    works = json.loads((source / 'assets/stories.json').read_text(encoding='utf-8'))
    if len(works) != 4 or {work['id'] for work in works} != {'orbit', 'sonic', 'cmaster', 'city'}:
        raise ValueError('The four work stories must have unique known IDs')
    env = Environment(loader=FileSystemLoader(Path(__file__).parent / 'templates'),
                      autoescape=select_autoescape(['html']))
    data = json.dumps(works, ensure_ascii=False).replace('<', '\\u003c')
    (target / 'assets').mkdir(parents=True, exist_ok=True)
    (target / 'assets' / 'stories-data.js').write_text(
        'window.GALLERY_STORIES = ' + data + ';\n', encoding='utf-8')

    homepage = (source / 'index.html').read_text(encoding='utf-8')
    showcase = env.get_template('showcase.html').render(works=works)
    home, count = re.subn(r'<!-- showcase:start -->.*?<!-- showcase:end -->',
                         lambda _: showcase, homepage, flags=re.S)
    if count != 1:
        raise ValueError('Expected one showcase insertion point')
    (target / 'index.html').write_text(home, encoding='utf-8')
    template = env.get_template('work.html')
    (target / 'works').mkdir(parents=True, exist_ok=True)
    for index, work in enumerate(works):
        page_work = dict(work)
        page_work['primaryHref'] = '../../' + work['url'] if work['url'] == 'play/' else work['url']
        folder = target / 'works' / work['id']
        folder.mkdir(parents=True, exist_ok=True)
        (folder / 'index.html').write_text(
            template.render(work=page_work, works=works, next=works[(index + 1) % len(works)]),
            encoding='utf-8')
    print('Rendered four static work stories and the home showcase')


if __name__ == '__main__':
    source = Path(__file__).resolve().parents[1] / 'outputs/personal-gallery'
    build_stories(source, source)
