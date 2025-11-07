import React, { useState } from "react";

function randomToken(len) {
  var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnpqrstuvwxyz";
  var out = "";
  for (var i = 0; i < (len || 10); i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export default function SmartLink() {
  const [token, setToken] = useState("");
  const [usdot, setUsdot] = useState("");
  const [plate, setPlate] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  function issueLink() {
    // Demo: generate a token. Later this will also persist usdot/plate/phone on the server.
    setToken(randomToken(10));
  }

  var origin = typeof window !== "undefined" ? window.location.origin : "";
  var driverURL = token ? origin + "/#/s/" + token : "";
  var dockURL   = token ? origin + "/#/verify/" + token : "";

  function copy(text) {
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function(){});
    }
  }

  // Simple phone auto-format (123-456-7890)
  function onPhoneChange(v) {
    var s = String(v || "").replace(/[^\d]/g, "").slice(0, 10);
    if (s.length > 6) s = s.slice(0,3) + "-" + s.slice(3,6) + "-" + s.slice(6);
    else if (s.length > 3) s = s.slice(0,3) + "-" + s.slice(3);
    setDriverPhone(s);
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 720 }}>
        <h2>Issue AdbS Verification Link</h2>
        <p className="subtle">
          Create a verification link for this shipment. Driver receives the AdbS Truck-Driver Verify Link.
        </p>

        <div className="form" style={{ marginTop: 10 }}>
          <label className="form-label">USDOT# (optional for demo)</label>
          <input
            className="input"
            value={usdot}
            onChange={function(e){ setUsdot(e.target.value); }}
            placeholder="e.g., 1234567"
          />

          <label className="form-label">License Plate (optional for demo)</label>
          <input
            className="input"
            value={plate}
            onChange={function(e){ setPlate(e.target.value); }}
            placeholder="e.g., ABC12345"
          />

          <label className="form-label">Driver Phone (optional for demo)</label>
          <input
            className="input"
            value={driverPhone}
            onChange={function(e){ onPhoneChange(e.target.value); }}
            placeholder="123-456-7890"
          />

          {/* Primary action uses your exact wording */}
          <button className="btn primary" onClick={issueLink}>
            Issue AdbS Verification Link
          </button>
        </div>

        {token ? (
          <div className="row-card" style={{ marginTop: 16 }}>
            <h2 style={{ marginBottom: 8 }}>Links</h2>

            <div className="form">
              <div>
                <div className="form-label">AdbS Truck-Driver Verify Link (send to driver)</div>
                <div className="row-actions" style={{ gap: 10 }}>
                  <input className="input" readOnly value={driverURL} />
                  <button className="btn" onClick={function(){ copy(driverURL); }}>Copy</button>
                </div>
              </div>

              <div>
                <div className="form-label">AdbS Verification (Dock) Link</div>
                <div className="row-actions" style={{ gap: 10 }}>
                  <input className="input" readOnly value={dockURL} />
                  <button className="btn" onClick={function(){ copy(dockURL); }}>Copy</button>
                </div>
              </div>
            </div>

            <p className="subtle" style={{ marginTop: 8 }}>
              Demo only. No server yet. The Dock screen will still require the PIN before showing the Truck-Driver checks.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
