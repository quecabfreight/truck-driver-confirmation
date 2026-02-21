// /src/utils/auth.js
// AUTH RULES (STRICT):
// - Logged-in identity is ALWAYS a plain email string.
// - JSON blobs are NEVER treated as auth identity.
// - No brute scanning of storage (it creates false positives).
// - If qc_email isn't set correctly, you're NOT authorized.

export const LS_EMAIL = "qc_email";
export const LS_ACCESS_CODE = "qc_access_code";
export const LS_ROLE = "qc_role";

function safeGet(store, key) {
  try {
    return (store.getItem(key) || "").trim();
  } catch {
    return "";
  }
}

function isJsonishString(v) {
  const s = String(v || "").trim();
  return s.startsWith("{") || s.startsWith("[");
}

export function looksLikeEmail(v) {
  const s = String(v || "").trim();
  if (!s) return false;
  if (isJsonishString(s)) return false;
  if (s.length > 160) return false;
  // Basic and fast email-ish check
  return s.includes("@") && s.includes(".");
}

export function getAuthEmail() {
  // Only trust the canonical key (and sessionStorage mirror)
  const a = safeGet(localStorage, LS_EMAIL);
  if (looksLikeEmail(a)) return a;

  const b = safeGet(sessionStorage, LS_EMAIL);
  if (looksLikeEmail(b)) return b;

  return "";
}

// Export kept because other files expect it
export function isBrokerOrShipper(email) {
  // For now: any valid email counts as "authorized identity exists".
  // Role enforcement can be added later once login stores role reliably.
  return looksLikeEmail(email);
}

export function isAuthorized() {
  const email = getAuthEmail();
  return isBrokerOrShipper(email);
}

export function setAuthEmail(email, { remember = true } = {}) {
  const e = String(email || "").trim();
  if (!looksLikeEmail(e)) return "";

  try {
    if (remember) {
      localStorage.setItem(LS_EMAIL, e);
      sessionStorage.removeItem(LS_EMAIL);
    } else {
      sessionStorage.setItem(LS_EMAIL, e);
      localStorage.removeItem(LS_EMAIL);
    }
  } catch {}

  return e;
}

export function clearAuth() {
  try {
    localStorage.removeItem(LS_EMAIL);
    sessionStorage.removeItem(LS_EMAIL);

    localStorage.removeItem(LS_ACCESS_CODE);
    localStorage.removeItem(LS_ROLE);

    // common leftovers
    localStorage.removeItem("access_code");
    localStorage.removeItem("role");
    localStorage.removeItem("remember_device");
  } catch {}
}
