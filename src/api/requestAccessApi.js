// src/api/requestAccessApi.js

// Demo-only "backend" for the Request Access form.
// Later we'll replace this with real API calls (Railway / server).
export async function submitAccessRequest(payload) {
  return new Promise((resolve) => {
    // Fake network delay so it feels real
    setTimeout(() => {
      console.log("QueCab AdbS demo – access request submitted:", payload);

      resolve({
        ok: true,
        message:
          "Demo only – your request has been recorded. In production this would notify QueCab AdbS support or your account admin.",
      });
    }, 600);
  });
}
