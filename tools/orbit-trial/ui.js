import { GameUI as FullGameUI } from '../ui.js';

export class GameUI extends FullGameUI {
  renderRecord(record) {
    super.renderRecord({ ...record, status: 'saved' });
    document.getElementById('save-status').textContent = record.status === 'memory'
      ? '本次试玩记录已保留；浏览器未允许永久存储'
      : '最高分已保存在当前浏览器';
  }
}
