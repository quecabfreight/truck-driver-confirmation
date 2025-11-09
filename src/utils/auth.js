// Centralized auth + role helpers (front-end only, beta)
export const LS_EMAIL = "adbs_login_email";
export const LS_CODE = "adbs_login_code";
export const LS_REMEMBER = "adbs_login_remember";
export const LS_ROLE = "adbs_role"; // BROKER | SHIPPER

export function getRoleFromCode(code = "") {
  const c = (code || "").toUpperCase();
  if (c.includes("-BRK-")) return "BROKER";
  if (c.includes("-SHP-")) return "SHIPPER";
  return ""; // unknown/none
}

export function isAuthed() {
  const remembered = localStorage.getItem(LS_REMEMBER) === "true";
  const email = (localStorage.getItem(LS_EMAIL) || "").trim();
  const code = (localStorage.getItem(LS_CODE) || "").trim();
  return remembered && !!email && !!code;
}

export function getRole() {
  return localStorage.getItem(LS_ROLE) || "";
}

export function isBrokerOrShipper() {
  return isAuthed() && (getRole() === "BROKER" || getRole() === "SHIPPER");
}
