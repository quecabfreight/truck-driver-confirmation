// src/api/demoApi.js
// Temporary "fake backend" so we can wire the app
// without a real server yet. We will later replace
// these with real fetch() calls to Railway / Vercel APIs.

export async function loginDemo({ email, accessCode }) {
  // Super simple demo rule:
  // - any non-empty email + code "DEMO123" = success
  // - anything else = failure
  await new Promise((resolve) => setTimeout(resolve, 500)); // fake network delay

  const normalizedCode = String(accessCode || "").trim().toUpperCase();

  if (email && normalizedCode === "DEMO123") {
    return {
      ok: true,
      message: "Demo login successful.",
    };
  }

  return {
    ok: false,
    message:
      "Demo login failed. Use access code DEMO123 with any business email.",
  };
}
