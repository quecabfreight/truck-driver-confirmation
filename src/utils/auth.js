// src/utils/auth.js
// Central auth helpers for QueCab AdbS
// Storage-based auth (Phase 1 / Beta). Server validates at login; client stores session-ish marker.

export const AUTH_STORAGE_KEY = "adbs_auth";

/**
 * Read auth object from localStorage.
 * Expected shape:
 * { ok: true, email: string, role?: string, ts?: number }
 */
export function readAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const j = raw ? JSON.parse(raw) : null;
    return j?.ok ? j : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!readAuth();
}

export function getAuthEmail() {
  return readAuth()?.email || "";
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Determine whether the current session belongs to an authorized Broker/Shipper user.
 * In this Phase 1 build, successful login implies authorized Broker/Shipper access.
 * If role is present, we treat "broker", "shipper", or "authorized" as valid.
 */
export function isBrokerOrShipper() {
  const a = readAuth();
  if (!a) return false;

  const role = String(a.role || "authorized").toLowerCase();

  // Accept common role strings, but default to true when role is missing
  // because the login endpoint already gates access.
  if (!role) return true;

  return role === "broker" || role === "shipper" || role === "authorized";
}

/**
 * Optional: platform admin detection (if role is set to admin).
 * (Platform master key is handled server-side; client role is informational.)
 */
export function isAdmin() {
  const a = readAuth();
  if (!a) return false;
  const role = String(a.role || "").toLowerCase();
  return role === "admin" || role === "platform_admin";
}

/**
 * Convenience: write auth (used by login flows).
 */
export function writeAuth(authObj) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authObj));
  } catch {
    // ignore
  }
}
