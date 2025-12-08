// src/utils/demoApi.js
// Demo-only "API" using localStorage so the app behaves like it's wired to a backend.

const STORAGE_KEY = "adbS_demo_links_v1";
const CHECKS_KEY = "adbS_demo_checks_v1";

function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

function loadChecks() {
  try {
    return JSON.parse(localStorage.getItem(CHECKS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveChecks(checks) {
  localStorage.setItem(CHECKS_KEY, JSON.stringify(checks));
}

function generateToken() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `DEMO-${code}`;
}

export function issueVerificationLink(payload) {
  const links = loadLinks();

  const token = generateToken();
  const now = new Date();

  // Normalize dates (optional fields)
  const startDate = payload.linkStart || null;
  const expireDate = payload.linkExpire || null;

  const record = {
    id: token,
    token,
    createdAt: now.toISOString(),
    loadReference: payload.loadReference || "",
    carrierName: payload.carrierName || "",
    usdotOnRecord: (payload.usdotOnRecord || "").toUpperCase(),
    plateOnRecord: (payload.plateOnRecord || "").toUpperCase(),
    driverName: payload.driverName || "",
    driverPhone: payload.driverPhone || "",
    sendViaEmail: !!payload.sendViaEmail,
    sendViaText: !!payload.sendViaText,
    sendToEmail: payload.sendToEmail || "",
    linkStart: startDate,
    linkExpire: expireDate,
    status: "pending", // pending | cleared | caution
  };

  links.push(record);
  saveLinks(links);

  const base = window.location.origin;
  const verifyUrl = `${base}/#/verify/${token}`;

  return { token, verifyUrl, record };
}

export function getActiveLinks() {
  const links = loadLinks();
  const now = new Date();

  return links.filter((link) => {
    if (link.linkStart) {
      const start = new Date(link.linkStart);
      if (now < start) return false;
    }
    if (link.linkExpire) {
      const exp = new Date(link.linkExpire);
      if (now > exp) return false;
    }
    return true;
  });
}

export function getVerifyDetails(token) {
  const links = loadLinks();
  return links.find((link) => link.token === token) || null;
}

export function submitTruckDriverCheck(token, payload) {
  const links = loadLinks();
  const checks = loadChecks();
  const now = new Date();

  const linkIndex = links.findIndex((l) => l.token === token);
  if (linkIndex === -1) {
    return { ok: false, reason: "not_found" };
  }

  const clearToLoad =
    payload.usdotMatches === "yes" && payload.driverAnswered === "yes";

  // Update link status
  links[linkIndex] = {
    ...links[linkIndex],
    status: clearToLoad ? "cleared" : "caution",
    lastCheckAt: now.toISOString(),
  };
  saveLinks(links);

  // Add a check record
  checks.unshift({
    id: `${token}_${now.getTime()}`,
    token,
    loadReference: links[linkIndex].loadReference,
    carrierName: links[linkIndex].carrierName,
    usdotEntered: payload.usdotOnTruck.toUpperCase(),
    plateEntered: payload.plateOnTruck.toUpperCase(),
    usdotMatches: payload.usdotMatches,
    driverAnswered: payload.driverAnswered,
    result: clearToLoad ? "cleared" : "caution",
    checkedAt: now.toISOString(),
  });

  // keep last 50
  saveChecks(checks.slice(0, 50));

  return {
    ok: true,
    clearToLoad,
  };
}

export function getRecentChecks(limit = 10) {
  const checks = loadChecks();
  return checks.slice(0, limit);
}
