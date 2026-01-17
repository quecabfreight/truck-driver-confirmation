const KEY = "qc_session";

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setSession(sessionObj) {
  localStorage.setItem(KEY, JSON.stringify(sessionObj));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
