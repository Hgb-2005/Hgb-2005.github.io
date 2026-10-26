// 网页试玩的记录独立保存，不发送 Flask API 请求，也不与完整版的待同步记录混用。
const KEY = 'hgb.orbit.trial.high-score.v1';
const valid = value => Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000_000;

export class ScoreService {
  constructor(onChange) {
    this.onChange = onChange;
    this.highScore = 0;
    this.pending = 0;
    this.status = 'local';
    window.addEventListener('storage', event => {
      if (event.key === KEY) void this.load();
    });
  }

  notify() {
    this.onChange({ highScore: this.highScore, status: this.status, pending: 0 });
  }

  async load() {
    try {
      const value = Number(localStorage.getItem(KEY));
      if (valid(value)) this.highScore = Math.max(this.highScore, value);
      localStorage.setItem(KEY, String(this.highScore));
      this.status = 'local';
    } catch {
      this.status = 'memory';
    }
    this.notify();
  }

  observe(score) {
    if (!valid(score) || score <= this.highScore) return;
    this.highScore = score;
    void this.load();
  }

  async flush() {}
  flushOnExit() {}
}
