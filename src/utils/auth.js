// /src/utils/auth.js

// NOTE: This file intentionally provides a single source of truth for auth display logic.
// It reads from multiple possible keys to prevent "top says logged-in, bottom says logged-out".

// Primary storage key used across the app (per handoff)
export const LS_EMAIL = "qc_email";

// Common fallback keys seen in older iterations / pages
export const LS_EMAIL_FALLBACKS = [
  "email",
  "user_email",
  "auth_email",
  "qc_user_email",
  "qcAuthorizedEmail",
  "authorized_email",
  "login_email",
];

// Other common keys (keep if your project already uses them)
export const LS_ACCESS_CODE = "qc_access_code";
export const LS_ROLE = "qc_role";

// Helper: safely read localStorage
function safeGet(key) {
  try {
    return (localStorage.getItem(key) || "").trim();
  } catch {
    return "";
  }
}

// Public helper: get the best available email from storage
export function getAuthEmail() {
  const primary = safeGet(LS_EMAIL);
  if (primary) return primary;

  for (const k of LS_EMAIL_FALLBACKS) {
    const v = safeGet(k);
    if (v) return v;
  }

  // Some builds used sessionStorage for "remember device" experiments
  try {
    const s = (sessionStorage.getItem(LS_EMAIL) || "").trim();
    if (s) return s;
  } catch {}

  return "";
}

// Your authorization rule (existing behavior should remain)
export function isBrokerOrShipper(email) {
  // If you already had logic here before, KEEP it.
  // This default is permissive-ish but still requires a real-looking email.
  // If your project has role-based auth elsewhere, this function should match it.
  const e = String(email || "").trim().toLowerCase();
  if (!e) return false;
  if (!e.includes("@") || !e.includes(".")) return false;
  return true;
}

// Single “truth” boolean for UI gating
export function isAuthorized() {
  const email = getAuthEmail();
  return !!email && isBrokerOrShipper(email);
}
