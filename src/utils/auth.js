// /src/utils/auth.js
// Single source of truth for auth identity (email).
// IMPORTANT: Do NOT "scan" storage for random values — demo objects can look like identity and break UI.

export const LS_EMAIL = "qc_email";

// Keep fallbacks minimal + explicit. Add to this list only when you KNOW a page writes that key.
export const LS_EMAIL_FALLBACKS = [
  "qc_user_email",
  "authorized_email",
  "login_email",
  "email",
];

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

function looksLikeEmail(v) {
  const s = String(v || "").trim();
  if (!s) return false;
  if (isJsonishString(s)) return false; // ✅ never accept JSON payloads as identity
  if (s.length > 120) return false;
  // Basic email-ish check
  return s.includes("@") && s.includes(".");
}

export function getAuthEmail() {
  // 1) Primary key
  const primary = safeGet(localStorage, LS_EMAIL);
  if (looksLikeEmail(primary)) return primary;

  // 2) Explicit fallbacks (localStorage)
  for (const k of LS_EMAIL_FALLBACKS) {
    const v = safeGet(localStorage, k);
    if (looksLikeEmail(v)) return v;
  }

  // 3) SessionStorage equivalents (if used)
  const sPrimary = safeGet(sessionStorage, LS_EMAIL);
  if (looksLikeEmail(sPrimary)) return sPrimary;

  for (const k of LS_EMAIL_FALLBACKS) {
    const v = safeGet(sessionStorage, k);
    if (looksLikeEmail(v)) return v;
  }

  return "";
}

// Your authorization rule — keep simple and stable
export function isBrokerOrShipper(email) {
  const e = String(email || "").trim().toLowerCase();
  if (!looksLikeEmail(e)) return false;
  return true;
}

export function isAuthorized() {
  const email = getAuthEmail();
  return !!email && isBrokerOrShipper(email);
}

export function setAuthEmail(email) {
  const e = String(email || "").trim();
  try {
    localStorage.setItem(LS_EMAIL, e);
  } catch {}
  return e;
}

export function clearAuth() {
  try {
    localStorage.removeItem(LS_EMAIL);
    localStorage.removeItem(LS_ACCESS_CODE);
    localStorage.removeItem(LS_ROLE);

    // common leftovers
    localStorage.removeItem("access_code");
    localStorage.removeItem("role");
    localStorage.removeItem("remember_device");
  } catch {}
}
