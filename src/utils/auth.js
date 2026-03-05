// /src/utils/auth.js
// Central auth storage helpers (localStorage) + role gate.
// Keeps backward compatibility with older key names.

export const LS_EMAIL = "qc_email";
export const LS_ROLE = "qc_role";
export const LS_CODE = "qc_access_code";
export const LS_REMEMBER = "qc_remember_device";

function safeGet(k) {
  try {
    return (localStorage.getItem(k) || "").trim();
  } catch {
    return "";
  }
}

function safeSet(k, v) {
  try {
    if (v === null || v === undefined || String(v).trim() === "") {
      localStorage.removeItem(k);
    } else {
      localStorage.setItem(k, String(v));
    }
  } catch {}
}

function normRole(r) {
  return String(r || "")
    .trim()
    .toLowerCase();
}

export function setAuthEmail(email) {
  safeSet(LS_EMAIL, String(email || "").trim());
}

export function setAuthRole(role) {
  safeSet(LS_ROLE, normRole(role));
}

export function setAuthCode(code) {
  // Store exactly what user sees (but uppercase is fine too)
  safeSet(LS_CODE, String(code || "").trim().toUpperCase());
}

export function setRememberDevice(remember) {
  safeSet(LS_REMEMBER, remember ? "1" : "");
}

export function getAuthEmail() {
  // Primary
  const p = safeGet(LS_EMAIL);
  if (p) return p;

  // Back-compat fallbacks
  const old1 = safeGet("LS_EMAIL");
  if (old1) return old1;

  const old2 = safeGet("email");
  if (old2) return old2;

  return "";
}

export function getAuthRole() {
  const p = safeGet(LS_ROLE);
  if (p) return p;

  // Back-compat fallbacks
  const old1 = safeGet("qc_role");
  if (old1) return normRole(old1);

  const old2 = safeGet("role");
  if (old2) return normRole(old2);

  return "";
}

export function getAuthCode() {
  const p = safeGet(LS_CODE);
  if (p) return p;

  // Back-compat fallbacks
  const old1 = safeGet("access_code");
  if (old1) return old1.toUpperCase();

  return "";
}

export function isRememberedDevice() {
  return safeGet(LS_REMEMBER) === "1";
}

export function isBrokerOrShipper(email) {
  const e = String(email || "").trim();
  if (!e) return false;

  const r = normRole(getAuthRole());
  return r === "broker" || r === "shipper";
}

export function clearAuth() {
  try {
    localStorage.removeItem(LS_EMAIL);
    localStorage.removeItem(LS_ROLE);
    localStorage.removeItem(LS_CODE);
    localStorage.removeItem(LS_REMEMBER);

    // Back-compat cleanup
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("access_code");
    localStorage.removeItem("qc_access_code");
    localStorage.removeItem("qc_role");
  } catch {}
}
