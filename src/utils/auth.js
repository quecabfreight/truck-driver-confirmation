// /src/utils/auth.js
// Single source of truth for auth identity (email).
// Fixes split-brain UI where some pages store JSON session blobs and others store plain email.

export const LS_EMAIL = "qc_email";

// Explicit known fallbacks ONLY (no "scan for anything")
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
  if (isJsonishString(s)) return false; // never accept raw JSON as email
  if (s.length > 160) return false;
  return s.includes("@") && s.includes(".");
}

function extractEmailFromJsonString(jsonStr) {
  const s = String(jsonStr || "").trim();
  if (!s || !isJsonishString(s)) return "";

  // Avoid heavy parsing of huge blobs
  if (s.length > 8000) return "";

  try {
    const obj = JSON.parse(s);
    if (!obj || typeof obj !== "object") return "";

    // Common field names we’ve seen in your flows
    const candidates = [
      obj.email,
      obj.businessEmail,
      obj.userEmail,
      obj.authorizedEmail,
      obj.sendEmail, // <-- your demo blob had this
      obj.contactEmail,
      obj.ownerEmail,
    ];

    for (const c of candidates) {
      if (looksLikeEmail(c)) return String(c).trim();
    }

    // Sometimes nested
    if (obj.user && looksLikeEmail(obj.user.email)) return String(obj.user.email).trim();
    if (obj.profile && looksLikeEmail(obj.profile.email)) return String(obj.profile.email).trim();

    return "";
  } catch {
    return "";
  }
}

function findEmailInsideStoredJson(store) {
  try {
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (!k) continue;
      const v = (store.getItem(k) || "").trim();
      if (!isJsonishString(v)) continue;

      const extracted = extractEmailFromJsonString(v);
      if (looksLikeEmail(extracted)) return extracted;
    }
  } catch {}
  return "";
}

export function getAuthEmail() {
  // 1) Primary
  const primary = safeGet(localStorage, LS_EMAIL);
  if (looksLikeEmail(primary)) return primary;

  // 2) Explicit fallbacks
  for (const k of LS_EMAIL_FALLBACKS) {
    const v = safeGet(localStorage, k);
    if (looksLikeEmail(v)) return v;
  }

  // 3) Try extracting from JSON session blobs stored in localStorage
  const fromJson = findEmailInsideStoredJson(localStorage);
  if (looksLikeEmail(fromJson)) return fromJson;

  // 4) SessionStorage equivalents (if used)
  const sPrimary = safeGet(sessionStorage, LS_EMAIL);
  if (looksLikeEmail(sPrimary)) return sPrimary;

  for (const k of LS_EMAIL_FALLBACKS) {
    const v = safeGet(sessionStorage, k);
    if (looksLikeEmail(v)) return v;
  }

  const sFromJson = findEmailInsideStoredJson(sessionStorage);
  if (looksLikeEmail(sFromJson)) return sFromJson;

  return "";
}

// Keep your auth rule simple and stable
export function isBrokerOrShipper(email) {
  const e = String(email || "").trim();
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
