// src/smartlink.js
function bank() {
  try { return JSON.parse(localStorage.getItem('smartTokens') || '{}'); }
  catch { return {}; }
}
function save(b) { localStorage.setItem('smartTokens', JSON.stringify(b)); }

export function createToken(minutes = 5) {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const expiresAt = Date.now() + minutes * 60_000;
  const b = bank();
  b[token] = { expiresAt, used: false };
  save(b);
  return token;
}

export function validateToken(token) {
  const b = bank();
  const t = b[token];
  if (!t) return { ok: false, reason: 'missing' };
  if (t.used) return { ok: false, reason: 'used' };
  if (Date.now() > t.expiresAt) return { ok: false, reason: 'expired' };
  return { ok: true };
}

export function consumeToken(token) {
  const b = bank();
  const t = b[token];
  if (!t) return { ok: false, reason: 'missing' };
  if (t.used) return { ok: false, reason: 'used' };
  if (Date.now() > t.expiresAt) return { ok: false, reason: 'expired' };
  t.used = true;
  save(b);
  return { ok: true };
}
