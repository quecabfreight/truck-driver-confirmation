// src/utils/auth.js
// Build-proof ES module auth helpers for QueCab AdbS
// SmartLink expects certain named exports from this module.

export const AUTH_BUILD_TAG = "AUTH-SMARTLINK-COMPAT-01";

// Storage keys (SmartLink may import these)
export const LS_AUTH = "adbs_auth";
export const LS_EMAIL = "adbs_email";
export const LS_ROLE = "adbs_role";

// Backward-compat alias
export const AUTH_STORAGE_KEY = LS_AUTH;

export function readAuth() {
  try {
    const raw = localStorage.getItem(LS_AUTH);
    const j = raw ? JSON.parse(raw) : null;
    return j && j.ok ? j : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!readAuth();
}

export function getAuthEmail() {
  // Prefer structured auth object, fall back to legacy email key
  const a = readAuth();
  if (a?.email) return a.email;
  try {
    return String(localStorage.getItem(LS_EMAIL) || "");
  } catch {
    return "";
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(LS_AUTH);
    localStorage.removeItem(LS_EMAIL);
    localStorage.removeItem(LS_ROLE);
  } catch {
    // ignore
  }
}

/**
 * REQUIRED BY: src/pages/SmartLink.jsx
 * In Phase 1, successful login implies authorized broker/shipper.
 * If role exists, accept broker/shipper/authorized.
 */
export function isBrokerOrShipper() {
  const a = readAuth();
  if (!a) return false;

  const role = String(a.role || a.user_role || "authorized").toLowerCase().trim();
  if (!role) return true;

  return role === "broker" || role === "shipper" || role === "authorized";
}

export function isAdmin() {
  const a = readAuth();
  if (!a) return false;
  const role = String(a.role || a.user_role || "").toLowerCase().trim();
  return role === "admin" || role === "platform_admin";
}
