// /src/utils/auth.js

export const LS_EMAIL = "qc_email";
export const LS_ROLE = "qc_role";
export const LS_CODE = "qc_access_code";
export const LS_REMEMBER = "qc_remember_device";

function safeGet(store, key) {
  try {
    return (store.getItem(key) || "").trim();
  } catch {
    return "";
  }
}

function safeSet(store, key, value) {
  try {
    if (value === null || value === undefined || String(value).trim() === "") {
      store.removeItem(key);
    } else {
      store.setItem(key, String(value));
    }
  } catch {}
}

function safeRemove(store, key) {
  try {
    store.removeItem(key);
  } catch {}
}

export function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

export function normalizeAccessCode(v) {
  const raw = String(v || "").toUpperCase().trim();
  const digits = raw.replace(/\D+/g, "");
  if (!digits) return raw.replace(/\s+/g, "").replace(/-+/g, "-");
  return `QC-${digits}`;
}

export function formatAccessCodeTyping(v) {
  const up = String(v || "").toUpperCase();
  const digits = up.replace(/\D+/g, "");

  if (!digits) {
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
  safeSet(store, LS_EMAIL, e);
  return e;
}

export function setAuthRole(role, persist = true) {
  const r = String(role || "").trim().toLowerCase();
  const store = pickStore(persist);
  safeSet(store, LS_ROLE, r);
  return r;
}

export function setAuthCode(code, persist = true) {
  const c = normalizeAccessCode(code);
  const store = pickStore(persist);
  safeSet(store, LS_CODE, c);
  return c;
}

export function setRememberDevice(remember, persist = true) {
  const store = pickStore(persist);
  safeSet(store, LS_REMEMBER, remember ? "1" : "");
}

export function isRememberedDevice() {
  return (
    safeGet(localStorage, LS_REMEMBER) === "1" ||
    safeGet(sessionStorage, LS_REMEMBER) === "1"
  );
}

export function getAuthEmail() {
  const primary = safeGet(localStorage, LS_EMAIL) || safeGet(sessionStorage, LS_EMAIL);
  if (primary) return normalizeEmail(primary);

  const legacy =
    safeGet(localStorage, "email") ||
    safeGet(sessionStorage, "email") ||
    safeGet(localStorage, "business_email") ||
    safeGet(sessionStorage, "business_email");

  return legacy ? normalizeEmail(legacy) : "";
}

export function getAuthRole() {
  const primary = safeGet(localStorage, LS_ROLE) || safeGet(sessionStorage, LS_ROLE);
  if (primary) return String(primary).trim().toLowerCase();

  const legacy = safeGet(localStorage, "role") || safeGet(sessionStorage, "role");
  return legacy ? String(legacy).trim().toLowerCase() : "";
}

export function getAuthCode() {
  const primary = safeGet(localStorage, LS_CODE) || safeGet(sessionStorage, LS_CODE);
  if (primary) return normalizeAccessCode(primary);

  const legacy =
    safeGet(localStorage, "access_code") ||
    safeGet(sessionStorage, "access_code") ||
    safeGet(localStorage, "qc_access_code") ||
    safeGet(sessionStorage, "qc_access_code");

  return legacy ? normalizeAccessCode(legacy) : "";
}

export function clearAuth() {
  const keys = [
    LS_EMAIL,
    LS_ROLE,
    LS_CODE,
    LS_REMEMBER,
    "email",
    "business_email",
    "role",
    "access_code",
    "qc_access_code",
    "qc_role",
  ];

  for (const k of keys) {
    safeRemove(localStorage, k);
    safeRemove(sessionStorage, k);
  }
}

export function isBrokerOrShipper(emailOrRole = "") {
  const v = String(emailOrRole || "").trim().toLowerCase();
  if (!v) return false;

  if (v.includes("@")) return true;
  return v === "broker" || v === "shipper";
}
