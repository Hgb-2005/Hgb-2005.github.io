import { localMatch } from '../services/history.js';

const KEY = 'hgb.orbit.trial.history.v1';
const valid = match => match && typeof match.id === 'string' && match.source === 'local'
  && ['classic', 'survival'].includes(match.mode) && Array.isArray(match.participants)
  && match.participants.length === 1 && match.participants[0]?.stats;

// Browser trial archives are independent of the full game's server and retry queue.
export class HistoryService {
  constructor(onChange = () => {}) {
    this.onChange = onChange;
    this.matches = [];
    this.pending = [];
    this.status = 'saved';
    window.addEventListener('storage', event => { if (event.key === KEY) void this.load(); });
  }
  async load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (Array.isArray(saved)) this.matches = saved.filter(valid).slice(0, 20);
      this.status = 'saved';
    } catch { this.status = 'memory'; }
    this.onChange();
  }
  capture(snapshot, id) {
    const match = localMatch(snapshot, id);
    if (!match || this.matches.some(item => item.id === id)) return;
    this.matches = [{ id, source: 'local', mode: match.mode, duration: match.duration,
      createdAt: new Date().toISOString(), reason: 'finished',
      participants: [{ name: '我', score: match.score, rank: match.rank,
        won: match.won, kills: match.kills, stats: match.stats }] }, ...this.matches].slice(0, 20);
    try {
      localStorage.setItem(KEY, JSON.stringify(this.matches));
      this.status = 'saved';
    } catch { this.status = 'memory'; }
    this.onChange();
  }
  async flush() {}
}
