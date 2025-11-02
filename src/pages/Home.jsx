import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// New session
const LS_SESSION  = "qc_session";
// Legacy flags (from your earlier working flow)
const LEGACY_OK   = "qc_is_authorized"; // "1" when logged in

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const s = localStorage.getItem(LS_SESSION);
      const legacyOK = localStorage.getItem(LEGACY_OK) === "1";
      if (!s && !legacyOK) {
        try { navigate("/login", { replace: true }); } catch {}
        setTimeout(() => {
          if (window?.location?.pathname !== "/login") window.location.replace("/login");
        }, 10);
      }
    } catch {}
  }, [navigate]);

  // ---- Your existing Home UI below (unchanged) ----
  return (
    <div className="min-h-screen w-full">
      {/* Keep everything you already had; placeholder text below is safe. */}
      <div style={{ padding: 16 }}>
        <h1 style={{ fontWeight: 900, fontSize: 24 }}>QueCab AdbS</h1>
        <p style={{ opacity: 0.7 }}>
          Carrier / Driver Verification Console. 
          {/* Add your real content here; this file only controls access. */}
        </p>
        <div style={{ marginTop: 12 }}>
          <Link to="/join">Request Access</Link> · <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
