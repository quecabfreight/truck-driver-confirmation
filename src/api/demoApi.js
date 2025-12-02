// src/api/demoApi.js
// Temporary "fake backend" so we can wire the app
// without a real server yet. We will later replace
// these with real fetch() calls to Railway / Vercel APIs.

export async function loginDemo({ email, accessCode }) {
  await new Promise((resolve) => setTimeout(resolve, 300)); // fake network delay

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
