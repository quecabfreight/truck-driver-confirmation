import React, { useState } from "react";
import { Link } from "react-router-dom";

function randomToken() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}

function normalizePhone(raw="") {
  const digits = raw.replace(/\D/g, "").slice(0, 15);
  if (digits.length === 10) return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
  return digits;
}

export default function SmartLink() {
  const [token, setToken] = useState("");
  const [form, setForm] = useState({ dot: "", plate: "", phone: "", emails: "" });

  const gen = () => setToken(randomToken());

  const base = `${location.origin}${location.hash ? location.pathname + location.hash : location.pathname}`;
  const driverUrl = token ? `${base}#/s/${token}` : "";
  // Driver phone goes ONLY to the dock link (not to the driver link)
  const telParam = form.phone ? `?tel=${encodeURIComponent(normalizePhone(form.phone))}` : "";
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
    try {
      await navigator.clipboard.writeText(message);
      alert("Links + details copied.");
    } catch {
      alert("Copy failed. You can still use Email/SMS.");
    }
  };

  const sendAll = async () => {
    if (!token) return;
    const cleanPhone = normalizePhone(form.phone);
    const bodyLines = [
      "QueCab AdbS — Shipment Links",
      "",
      `Driver (AdbS Truck-Driver Link): ${driverUrl}`,
      `Dock (AdbS Truck-Driver Verify Link): ${dockUrl}`,
      "",
      `USDOT#: ${form.dot || "(not provided)"}`,
      `Plate: ${form.plate || "(not provided)"}`,
    ];
    const emailBody = encodeURIComponent(bodyLines.join("\n"));
    const mailtoTo = (form.emails || "").split(",").map(s=>s.trim()).filter(Boolean).join(",");
    const mailto = `mailto:${mailtoTo}?subject=AdbS%20Shipment%20Links&body=${emailBody}`;

    // Try native share first (mobile)
    try {
      if (navigator.share) {
        await navigator.share({ title: "QueCab AdbS — Shipment Links", text: bodyLines.join("\n") });
      } else {
        window.location.href = mailto;
      }
    } catch {
      window.location.href = mailto;
    }

    // If driver phone provided, open SMS with the DRIVER link only
    if (cleanPhone) {
      const smsText = encodeURIComponent(`AdbS Truck-Driver Link:\n${driverUrl}`);
      setTimeout(() => {
        // Device-dependent; harmless on desktop
        window.location.href = `sms:${cleanPhone}?&body=${smsText}`;
      }, 600);
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
              onChange={(e)=>setForm({...form, dot:e.target.value.replace(/\D/g,"")})}
              placeholder=""
              inputMode="numeric"
            />
          </div>
          <div>
            <label>License Plate</label>
            <input
              className="input"
              value={form.plate}
              onChange={(e)=>setForm({...form, plate:e.target.value.trim().toUpperCase()})}
              placeholder=""
            />
          </div>
          <div>
            <label>Driver Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e)=>setForm({...form, phone:e.target.value})}
              placeholder="123-456-7890"
              inputMode="tel"
            />
          </div>
          <div>
            <label>Recipient Emails (Dock, comma-separated)</label>
            <input
              className="input"
              value={form.emails}
              onChange={(e)=>setForm({...form, emails:e.target.value})}
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

            <p className="muted" style={{ marginTop: 10 }}>
              Driver gets the driver link by SMS; recipients get both links by email. USDOT &amp; Plate are in the email body only.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
