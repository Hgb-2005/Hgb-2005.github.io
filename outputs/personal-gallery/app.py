"""个人展览馆入口；在同一服务中提供展厅与原版 ORBIT 游戏。"""

import os
from pathlib import Path
import re
import sys
import threading
import webbrowser

from flask import request, send_from_directory

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'game'))
from server import create_app
from server.serving import OrbitRequestHandler

# 使用交付包自己的数据库，保留原始游戏项目和历史分数。
app = create_app({'DATABASE': str(ROOT / 'instance' / 'game.sqlite3')})
original_game_home = app.view_functions['game.index']


def gallery_home():
    # 游戏的联机邀请沿用原来的 ?room=123456 形式，可直接打开准备室。
    if re.fullmatch(r'\d{6}', request.args.get('room', '')):
        return original_game_home()
    return send_from_directory(ROOT, 'index.html')


app.view_functions['game.index'] = gallery_home
app.add_url_rule('/play/', 'play', original_game_home)


@app.get('/assets/<path:filename>')
def gallery_assets(filename):
    return send_from_directory(ROOT / 'assets', filename)


@app.get('/gallery.html')
def gallery_alias():
    return gallery_home()


@app.get('/works/<work_id>/')
def work_story(work_id):
    from flask import abort
    if work_id not in {'orbit', 'sonic', 'cmaster', 'city'}:
        abort(404)
    return send_from_directory(ROOT / 'works' / work_id, 'index.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8766'))
    print('Gallery: http://127.0.0.1:' + str(port) + '/', flush=True)
    print('Game:    http://127.0.0.1:' + str(port) + '/play/', flush=True)
    if '--open-browser' in sys.argv:
        opener = threading.Timer(1.5, lambda: webbrowser.open('http://127.0.0.1:' + str(port) + '/'))
        opener.daemon = True
        opener.start()
    app.run(host=os.environ.get('HOST', '127.0.0.1'), port=port,
            debug=False, threaded=True, request_handler=OrbitRequestHandler)
