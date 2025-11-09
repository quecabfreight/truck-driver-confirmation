import React, { useEffect, useState } from "react";
import InAppBrowserBanner from "../components/InAppBrowserBanner";

export default function DriverScreen() {
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    // Detect common in-app browsers where camera access often fails
    const ua = navigator.userAgent.toLowerCase();
    const suspects = [
      "instagram", "fbav", "messenger", "line", "wechat", "snapchat",
      "whatsapp", "gmail", "outlook", "tiktok"
    ];
    if (suspects.some((s) => ua.includes(s))) setInApp(true);
  }, []);

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />

      {inApp && (
        <InAppBrowserBanner
          message="For best performance and camera access, open this link in Safari or Chrome."
        />
      )}

      <div className="card" style={{ maxWidth: 420 }}>
        <h1>Truck-Driver Check-In</h1>
        <p style={{ fontSize: "1.25rem", marginTop: 12 }}>
          You’re checking in for your assigned shipment.<br />
          Please remain at your truck until the dock confirms.
        </p>
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: "1.4rem" }}>Next Step</h2>
          <p style={{ marginTop: 8 }}>
            Your broker/shipper has been notified. Wait for the dock to call
            you when it’s your turn to back in.
          </p>
        </div>
      </div>
    </div>
  );
}
