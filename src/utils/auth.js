// src/utils/auth.js
// QueCab AdbS auth helpers (client-side session marker for Phase 1 / Beta)
//
// IMPORTANT:
// - Must be ESM exports (Vite/Rollup).
// - Provide BOTH named exports and default export for compatibility.

export const AUTH_STORAGE_KEY = "adbs_auth";

export function readAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const j = raw ? JSON.parse(raw) : null;
    return j && j.ok ? j : null;
  } catch {
    return null;
  }
}

export function writeAuth(obj) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // ignore
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function isLoggedIn() {
  return !!readAuth();
}

export function getAuthEmail() {
  return readAuth()?.email || "";
}

/**
 * SmartLink expects this named export.
 * In Phase 1, a successful login implies broker/shipper authorization.
 * If role exists, we accept broker/shipper/authorized.
 */
export function isBrokerOrShipper() {
  const a = readAuth();
  if (!a) return false;

  const role = String(a.role || "authorized").toLowerCase().trim();

  // If role missing, treat as authorized (server already gated it)
  if (!role) return true;

  return role === "broker" || role === "shipper" || role === "authorized";
}

export function isAdmin() {
  const a = readAuth();
  if (!a) return false;
  const role = String(a.role || "").toLowerCase().trim();
  return role === "admin" || role === "platform_admin";
}

// Default export for any older code that imports auth as a default object
export default {
  AUTH_STORAGE_KEY,
  readAuth,
  writeAuth,
  clearAuth,
  isLoggedIn,
  getAuthEmail,
  isBrokerOrShipper,
  isAdmin,
};
