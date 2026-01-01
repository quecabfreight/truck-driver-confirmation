const KEY_LOCAL = "qc_adbs_auth_v1";
const KEY_SESSION = "qc_adbs_auth_v1_session";

export function setAuthSession({ email, role }, rememberDevice) {
  const payload = {
    email,
    role: role || "Broker",
    ts: Date.now(),
  };

  if (rememberDevice) {
    localStorage.setItem(KEY_LOCAL, JSON.stringify(payload));
    sessionStorage.removeItem(KEY_SESSION);
  } else {
    sessionStorage.setItem(KEY_SESSION, JSON.stringify(payload));
    localStorage.removeItem(KEY_LOCAL);
  }
}

export function getAuthSession() {
  const local = localStorage.getItem(KEY_LOCAL);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      localStorage.removeItem(KEY_LOCAL);
    }
  }

  const sess = sessionStorage.getItem(KEY_SESSION);
  if (sess) {
    try {
      return JSON.parse(sess);
    } catch {
      sessionStorage.removeItem(KEY_SESSION);
    }
  }

  return null;
}

export function clearAuthSession() {
  localStorage.removeItem(KEY_LOCAL);
  sessionStorage.removeItem(KEY_SESSION);
}

export function isAuthed() {
  return !!getAuthSession();
}
