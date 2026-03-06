// /src/utils/auth.js
// Minimal, durable auth helpers for QueCab AdbS.
// Goals:
// - Email is NEVER case-sensitive (store + compare lowercase).
// - Access code auto-normalizes (QC-###### style).
// - "Remember device" persists to localStorage; otherwise sessionStorage.
// - Backward-compatible with older keys so nothing mysteriously breaks.

export const LS_EMAIL = "qc_email";
export const LS_ROLE = "qc_role";
export const LS_CODE = "qc_access_code";

// Legacy keys we’ve seen in the wild (keep for compatibility)
const LEGACY_EMAIL_KEYS = ["email", "business_email"];
const LEGACY_ROLE_KEYS = ["role"];
const LEGACY_CODE_KEYS = ["access_code"];

function safeGet(store, key) {
  try {
    return (store.getItem(key) || "").trim();
  } catch {
    return "";
  }
}

function safeSet(store, key, value) {
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemove(store, key) {
  try {
    store.removeItem(key);
  } catch {}
}

export function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

// Accepts things like: "qc757376", "QC 757376", "qc-757376", "757376"
// Normalizes to: "QC-757376" (or "QC-75737699" if longer digits are typed)
export function normalizeAccessCode(v) {
  const raw = String(v || "").toUpperCase().trim();

  // Pull digits
  const digits = raw.replace(/\D+/g, "");

  // If user typed letters+digits, keep only the prefix "QC" meaningfully.
  // Standard format we use: QC-###### (digits can be 4-12, we won't block longer for now)
  if (!digits) return raw.replace(/\s+/g, "").replace(/-+/g, "-");

  return `QC-${digits}`;
}

// Nice typing formatter: keeps it looking like QC-123456 while they type
export function formatAccessCodeTyping(v) {
  const up = String(v || "").toUpperCase();
  const digits = up.replace(/\D+/g, "");

  if (!digits) {
    // allow user to type "QC" and see it
    const cleaned = up.replace(/[^A-Z0-9-]/g, "");
    if (cleaned.startsWith("QC")) return "QC-";
    return cleaned;
  }
  return `QC-${digits}`;
}

function pickStore(persist) {
  return persist ? localStorage : sessionStorage;
}

export function setAuthEmail(email, persist = true) {
  const e = normalizeEmail(email);
  const store = pickStore(persist);

  // Clear both first to avoid ghost values
  clearAuth();

  if (e) safeSet(store, LS_EMAIL, e);
  return e;
}

export function setAuthRole(role, persist = true) {
  const r = String(role || "").trim().toLowerCase();
  const store = pickStore(persist);

  if (r) safeSet(store, LS_ROLE, r);
  return r;
}

export function setAuthCode(code, persist = true) {
  const c = normalizeAccessCode(code);
  const store = pickStore(persist);

  if (c) safeSet(store, LS_CODE, c);
  return c;
}

export function getAuthEmail() {
  // Prefer localStorage (remembered device), then sessionStorage (tab-only)
  const primary = safeGet(localStorage, LS_EMAIL) || safeGet(sessionStorage, LS_EMAIL);
  if (primary) return normalizeEmail(primary);

  // Legacy fallbacks
  for (const k of LEGACY_EMAIL_KEYS) {
    const v = safeGet(localStorage, k) || safeGet(sessionStorage, k);
    if (v) return normalizeEmail(v);
  }
  return "";
}

export function getAuthRole() {
  const primary = safeGet(localStorage, LS_ROLE) || safeGet(sessionStorage, LS_ROLE);
  if (primary) return String(primary).trim().toLowerCase();

  for (const k of LEGACY_ROLE_KEYS) {
    const v = safeGet(localStorage, k) || safeGet(sessionStorage, k);
    if (v) return String(v).trim().toLowerCase();
  }
  return "";
}

export function getAuthCode() {
  const primary = safeGet(localStorage, LS_CODE) || safeGet(sessionStorage, LS_CODE);
  if (primary) return normalizeAccessCode(primary);

  for (const k of LEGACY_CODE_KEYS) {
    const v = safeGet(localStorage, k) || safeGet(sessionStorage, k);
    if (v) return normalizeAccessCode(v);
  }
  return "";
}

export function clearAuth() {
  // Remove from both stores + legacy keys
  safeRemove(localStorage, LS_EMAIL);
  safeRemove(localStorage, LS_ROLE);
  safeRemove(localStorage, LS_CODE);

  safeRemove(sessionStorage, LS_EMAIL);
  safeRemove(sessionStorage, LS_ROLE);
  safeRemove(sessionStorage, LS_CODE);

  for (const k of [...LEGACY_EMAIL_KEYS, ...LEGACY_ROLE_KEYS, ...LEGACY_CODE_KEYS]) {
    safeRemove(localStorage, k);
    safeRemove(sessionStorage, k);
  }
}

// Authorization gate used by your app pages.
// For now: if there's an email in auth, we treat them as "authorized-ish" for routing,
// but REAL authorization should be enforced server-side by your APIs.
// We keep this simple to avoid blocking legit beta users due to UI-only quirks.
export function isBrokerOrShipper(emailOrRole = "") {
  // If they pass an email, we just check it exists (server is the real bouncer).
  // If they pass a role, accept broker/shipper.
  const v = String(emailOrRole || "").trim().toLowerCase();
  if (!v) return false;

  if (v.includes("@")) return true;
  return v === "broker" || v === "shipper";
}
