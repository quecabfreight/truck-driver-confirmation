// src/utils/auth.js
// Minimal, build-proof ES module auth helpers for QueCab AdbS

export const AUTH_STORAGE_KEY = "adbs_auth";
export const AUTH_BUILD_TAG = "AUTH-NAMED-EXPORT-LOCK-01";

export function readAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
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
  const a = readAuth();
  return a?.email || "";
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * REQUIRED BY: src/pages/SmartLink.jsx
 * SmartLink imports this as a NAMED export.
 * Phase 1 rule: if you're logged in, you're considered an authorized broker/shipper.
 * If role exists, we accept broker/shipper/authorized.
 */
export function isBrokerOrShipper() {
  const a = readAuth();
  if (!a) return false;

  const role = String(a.role || "authorized").toLowerCase().trim();
  if (!role) return true;

  return role === "broker" || role === "shipper" || role === "authorized";
}

export function isAdmin() {
  const a = readAuth();
  if (!a) return false;
  const role = String(a.role || "").toLowerCase().trim();
  return role === "admin" || role === "platform_admin";
}
