import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LS_EMAIL = "adbs_login_email";
const LS_CODE = "adbs_login_code";
const LS_REMEMBER = "adbs_login_remember";

const digits = (s = "") => s.replace(/\D/g, "");
const formatPhoneUS = (s = "") => {
  const d = digits(s).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}-${d.slice(3)}`;
  return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`;
};
const telDigits = (s = "") => digits(s).slice(0, 15);

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

  useEffect(() => {
    if (isAuthed()) setAllowed(true);
    else navigate("/login", { replace: true });
  }, [navigate]);

  const [token, setToken] = useState("");
  const [form, setForm] = useState({ dot: "", plate: "", phone: "", emails: "" });

  const gen = () => setToken(randomToken());

  if (!allowed) return null;

  const base = `${location.origin}${location.hash ? location.pathname + location.hash : location.pathname}`;
  const driverUrl = token ? `${base}#/s/${token}` : "";
  const telParam = form.phone ? `?tel=${encodeURIComponent(telDigits(form.phone))}` : "";
  const dockUrl   = token ? `${base}#/verify/${token}${telParam}` : "";

  const copyBoth = async () => {
    const message = [
      "AdbS Truck-Driver Link:",
      driverUrl,
      "",
      "AdbS Truck-Driver Verify Link (Dock):",
      dockUrl,
      "",
      `USDOT#: ${form.dot || "(not provided)"}`,
      `Plate: ${form.plate || "(not provided)"}`
    ].join("\n");
    try { await navigator.clipboard.writeText(message); alert("Links + details copied."); }
    catch { alert("Copy failed. You can still use Email/SMS."); }
  };

  const sendAll = async () => {
    if (!token) return;
    const bodyLines = [
      "QueCab AdbS — Shipment Links",
      "",
      `Driver (AdbS Truck-Driver Link): ${driverUrl}`,
      `Dock (AdbS Truck-Driver Verify Link): ${dockUrl}`,
      "",
      `USDOT#: ${form.dot || "(not provided)"}`,
      `Plate: ${form.plate || "(not provided)"}`
    ];
    const emailBody = encodeURIComponent(bodyLines.join("\n"));
    const mailtoTo = (form.emails || "").split(",").map(s=>s.trim()).filter(Boolean).join(",");
    const mailto = `mailto:${mailtoTo}?subject=AdbS%20Shipment%20Links&body=${emailBody}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "QueCab AdbS — Shipment Links", text: bodyLines.join("\n") });
      } else {
        window.location.href = mailto;
      }
    } catch {
      window.location.href = mailto;
    }

    const d = telDigits(form.phone);
    if (d) {
      const smsText = encodeURIComponent(`AdbS Truck-Driver Link:\n${driverUrl}`);
      setTimeout(() => { window.location.href = `sms:${d}?&body=${smsText}`; }, 600);
    }
  };

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>Check In Link</h1>
        <p className="muted" style={{ marginBottom: 18 }}>
          Click <strong>Generate AdbS Truck-Driver Verify Link</strong>, then send links in one click.
        </p>

        <div className="form" style={{ marginBottom: 16 }}>
          <div>
            <label>USDOT#</label>
            <input
              className="input"
              value={form.dot}
              onChange={(e)=>setForm({...form, dot: digits(e.target.value).slice(0, 8)})}
              inputMode="numeric"
              placeholder=""
            />
          </div>
          <div>
            <label>License Plate</label>
            <input
              className="input"
              value={form.plate}
              onChange={(e)=>setForm({...form, plate: e.target.value.toUpperCase()})}
              placeholder=""
            />
          </div>
          <div>
            <label>Driver Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e)=>setForm({...form, phone: formatPhoneUS(e.target.value)})}
              inputMode="tel"
              placeholder="123-456-7890"
            />
          </div>
          <div>
            <label>Recipient Emails (Dock, comma-separated)</label>
            <input
              className="input"
              value={form.emails}
              onChange={(e)=>setForm({...form, emails: e.target.value})}
              placeholder="dock@example.com, checker@example.com"
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
          </div>
        )}
      </div>
    </div>
  );
}
