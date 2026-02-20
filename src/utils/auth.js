// /src/utils/auth.js
// Single source of truth for reading "who is logged in" across legacy + current pages.
// Goal: eliminate "top says Log Out, bottom says Log In" caused by mismatched storage keys.

export const LS_EMAIL = "qc_email";

// Common legacy / alternate keys seen in iterations
export const LS_EMAIL_FALLBACKS = [
  "email",
  "user_email",
  "auth_email",
  "qc_user_email",
  "qcEmail",
  "qc_email_address",
  "qcAuthorizedEmail",
  "authorized_email",
  "login_email",
  "authorizedEmail",
];

// Other common keys (kept for compatibility)
export const LS_ACCESS_CODE = "qc_access_code";
export const LS_ROLE = "qc_role";

function safeGet(store, key) {
  try {
    return (store.getItem(key) || "").trim();
  } catch {
    return "";
  }
}

function looksLikeEmail(v) {
  const s = String(v || "").trim();
  if (s.length < 5) return false;
  // Very basic email-ish check (fast, safe)
  return s.includes("@") && s.includes(".");
}

// Brute scan: find any localStorage value that looks like an email.
// This fixes split-brain UI when some page writes a different key than expected.
function bruteScanEmail() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const v = (localStorage.getItem(k) || "").trim();
      if (looksLikeEmail(v)) return v;
    }
  } catch {}
  return "";
}

export function getAuthEmail() {
  // 1) Primary key
  const primary = safeGet(localStorage, LS_EMAIL);
  if (looksLikeEmail(primary)) return primary;

  // 2) Known fallbacks
  for (const k of LS_EMAIL_FALLBACKS) {
    const v = safeGet(localStorage, k);
    if (looksLikeEmail(v)) return v;
  }

  // 3) SessionStorage fallbacks (some builds used this)
  const sPrimary = safeGet(sessionStorage, LS_EMAIL);
  if (looksLikeEmail(sPrimary)) return sPrimary;

  for (const k of LS_EMAIL_FALLBACKS) {
    const v = safeGet(sessionStorage, k);
    if (looksLikeEmail(v)) return v;
  }

  // 4) Last resort: brute scan localStorage
  const brute = bruteScanEmail();
  if (looksLikeEmail(brute)) return brute;

  return "";
}

// Keep this export because App/Header use it.
// If your project has stricter rules elsewhere, we can tighten later.
export function isBrokerOrShipper(email) {
  const e = String(email || "").trim();
  if (!looksLikeEmail(e)) return false;
  return true;
}

export function isAuthorized() {
  const email = getAuthEmail();
  return !!email && isBrokerOrShipper(email);
}

// Optional helpers (won’t break anything if unused)
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
