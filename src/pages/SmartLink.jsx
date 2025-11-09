import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LS_EMAIL = "adbs_login_email";
const LS_CODE = "adbs_login_code";
const LS_REMEMBER = "adbs_login_remember";

function isAuthed() {
  const remembered = localStorage.getItem(LS_REMEMBER) === "true";
  const email = (localStorage.getItem(LS_EMAIL) || "").trim();
  const code = (localStorage.getItem(LS_CODE) || "").trim();
  return remembered && email && code;
}

function randomToken() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}

export default function SmartLink() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  // Soft gate: if not "remembered" with values, send to /login
  useEffect(() => {
    if (isAuthed()) {
      setAllowed(true);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const [token, setToken] = useState("");
  const [form, setForm] = useState({ dot: "", plate: "", phone: "" });

  const gen = () => setToken(randomToken());

  if (!allowed) return null; // no flicker

  const base = `${location.origin}${location.hash ? location.pathname + location.hash : location.pathname}`;
  const driverUrl = token ? `${base}#/s/${token}` : "";
  const dockUrl   = token ? `${base}#/verify/${token}` : "";

  const copyBoth = async () => {
    const message = [
      "AdbS Truck-Driver Link:",
      driverUrl,
      "",
      "AdbS Truck-Driver Verify Link (Dock):",
      dockUrl
    ].join("\n");
    try {
      await navigator.clipboard.writeText(message);
      alert("Links copied.");
    } catch {
      alert("Copy failed. You can still use Email/SMS.");
    }
  };

  const sendAll = async () => {
    const text = `AdbS Links\n\nDriver: ${driverUrl}\nDock: ${dockUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "QueCab AdbS", text, url: driverUrl });
        return;
      }
    } catch { /* fall through */ }
    const mailto = `mailto:?subject=AdbS%20Links&body=${encodeURIComponent(text)}`;
    window.location.href = mailto;
    if (form.phone) {
      const smsBody = encodeURIComponent(text);
      setTimeout(() => {
        window.location.href = `sms:${form.phone}?&body=${smsBody}`;
      }, 500);
    }
  };

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>Check In Link</h1>
        <p className="muted" style={{ marginBottom: 18 }}>
          Click <strong>Generate AdbS Truck-Driver Verify Link</strong> to create links for this shipment.
        </p>

        <div className="form" style={{ marginBottom: 16 }}>
          <div>
            <label>USDOT# (optional for demo)</label>
            <input
              className="input"
              value={form.dot}
              onChange={(e)=>setForm({...form, dot:e.target.value})}
              placeholder="e.g., 1234567"
            />
          </div>
          <div>
            <label>License Plate (optional for demo)</label>
            <input
              className="input"
              value={form.plate}
              onChange={(e)=>setForm({...form, plate:e.target.value})}
              placeholder="ABC1234"
            />
          </div>
          <div>
            <label>Driver Phone (optional)</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e)=>setForm({...form, phone:e.target.value})}
              placeholder="123-456-7890"
            />
          </div>

          <button className="btn" onClick={gen}>Generate AdbS Truck-Driver Verify Link</button>
        </div>

        {token && (
          <div className="card" style={{ marginTop: 10 }}>
            <h2 className="h2">Links</h2>
            <p><strong>AdbS Truck-Driver Link:</strong><br /><code>/s/{token}</code></p>
            <p><strong>AdbS Truck-Driver Verify Link (Dock):</strong><br /><code>/verify/{token}</code></p>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop: 10 }}>
              <Link className="btn" to={`/s/${token}`}>Open Driver Screen</Link>
              <Link className="btn" to={`/verify/${token}`}>Open Dock Screen</Link>
              <button className="btn" onClick={copyBoth}>Copy Both</button>
              <button className="btn" onClick={sendAll}>Send Links</button>
            </div>

            <p className="muted" style={{ marginTop: 10 }}>
              Tip: “Send Links” shares both to email (and SMS if driver phone is filled). One click.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
