import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isBrokerOrShipper, LS_EMAIL } from "../utils/auth";

const digits = (s = "") => s.replace(/\D/g, "");
const telDigits = (s = "") => digits(s).slice(0, 15);
const formatPhoneUS = (s = "") => {
  const d = digits(s).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
};
const b64url = (obj) => {
  try {
    const json = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  } catch {
    return "";
  }
};
function randomToken() {
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}

export default function SmartLink() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isBrokerOrShipper()) setAllowed(true);
    else navigate("/login", { replace: true });
  }, [navigate]);

  const [token, setToken] = useState("");
  const [driverUrl, setDriverUrl] = useState("");
  const [dockUrl, setDockUrl] = useState("");
  const [justCopied, setJustCopied] = useState(false);

  const [form, setForm] = useState({
    dot: "",
    plate: "",
    phone: "",
    dockEmails: "", // stays blank (no placeholder)
  });

  if (!allowed) return null;

  const base = `${location.origin}${
    location.hash ? location.pathname + location.hash : location.pathname
  }`;

  const generate = async () => {
    const t = randomToken();
    setToken(t);

    // Embed shipment data
    const vd = form.dot ? b64url({ d: digits(form.dot) }) : "";
    const vp = form.plate
      ? b64url({
          p: (form.plate || "").trim().toUpperCase().replace(/[\s-]/g, ""),
        })
      : "";
    const tel = form.phone ? telDigits(form.phone) : "";

    // Alerts go to logged-in Broker/Shipper email (not dock)
    const brokerEmail = (localStorage.getItem(LS_EMAIL) || "").trim();

    const params = new URLSearchParams();
    if (tel) params.set("tel", tel);
    if (vd) params.set("vd", vd);
    if (vp) params.set("vp", vp);
    if (brokerEmail) params.set("em", brokerEmail);

    const du = `${base}#/s/${t}`;
    const ku = `${base}#/verify/${t}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    setDriverUrl(du);
    setDockUrl(ku);

    // Auto-copy both for broker convenience
    try {
      await navigator.clipboard.writeText(
        `Driver (AdbS Truck-Driver Link): ${du}\nDock (AdbS Truck-Driver Verify Link): ${ku}`
      );
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 3000);
    } catch {
      /* ignore */
    }
  };

  // Email ONLY the dock verify link to dock staff
  const sendDockEmail = async () => {
    if (!dockUrl) return;
    const to = (form.dockEmails || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(",");
    if (!to) {
      alert("Enter Dock Emails first.");
      return;
    }

    const lines = [
      "QueCab AdbS — Dock Verification Link",
      "",
      `Dock (AdbS Truck-Driver Verify Link): ${dockUrl}`,
      "",
      `USDOT#: ${form.dot || "(not provided)"}`,
      `Plate: ${form.plate || "(not provided)"}`,
    ];
    const emailBody = encodeURIComponent(lines.join("\n"));
    const mailto = `mailto:${to}?subject=AdbS%20Dock%20Verification&body=${emailBody}`;

    try {
      if (navigator.share)
        await navigator.share({
          title: "QueCab AdbS — Dock Verification",
          text: lines.join("\n"),
        });
      else window.location.href = mailto;
    } catch {
      window.location.href = mailto;
    }
  };

  // Text ONLY the driver link to the driver
  const textDriver = () => {
    if (!driverUrl) return;
    const d = telDigits(form.phone);
    if (!d) {
      alert("Enter the driver’s phone number first.");
      return;
    }
    const smsText = encodeURIComponent(
      `AdbS Truck-Driver Link:\n${driverUrl}`
    );
    window.location.href = `sms:${d}?&body=${smsText}`;
  };

  const copyDriver = async () => {
    if (!driverUrl) return;
    try {
      await navigator.clipboard.writeText(driverUrl);
      alert("Driver link copied.");
    } catch {}
  };

  const copyBoth = async () => {
    if (!driverUrl || !dockUrl) return;
    try {
      await navigator.clipboard.writeText(
        `Driver (AdbS Truck-Driver Link): ${driverUrl}\nDock (AdbS Truck-Driver Verify Link): ${dockUrl}`
      );
      alert("Both links copied.");
    } catch {}
  };

  // Button guards
  const canTextDriver = Boolean(token && form.phone && driverUrl);
  const canEmailDock = Boolean(token && form.dockEmails && dockUrl);
  const canCopyDriver = Boolean(token && driverUrl);
  const canCopyBoth = Boolean(token && driverUrl && dockUrl);

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>Generate AdbS Truck-Driver Verification Link</h1>

        <div className="form" style={{ marginBottom: 12 }}>
          <div>
            <label>USDOT#</label>
            <input
              className="input"
              value={form.dot}
              onChange={(e) =>
                setForm({ ...form, dot: digits(e.target.value).slice(0, 8) })
              }
              inputMode="numeric"
            />
          </div>
          <div>
            <label>License Plate</label>
            <input
              className="input"
              value={form.plate}
              onChange={(e) =>
                setForm({ ...form, plate: e.target.value.toUpperCase() })
              }
            />
          </div>
          <div>
            <label>Driver Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: formatPhoneUS(e.target.value) })
              }
              inputMode="tel"
            />
          </div>
          <div>
            <label>Dock Emails (comma-separated)</label>
            <input
              className="input"
              value={form.dockEmails}
              onChange={(e) =>
                setForm({ ...form, dockEmails: e.target.value })
              }
              autoComplete="off"
            />
          </div>

          <button className="btn" onClick={generate}>
            Generate AdbS Truck-Driver Verify Link
          </button>
          {justCopied && (
            <p className="muted" style={{ marginTop: 8 }}>
              Links copied to clipboard.
            </p>
          )}
        </div>

        {token && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn" onClick={textDriver} disabled={!canTextDriver}>
              Text Driver
            </button>
            <button className="btn" onClick={copyDriver} disabled={!canCopyDriver}>
              Copy Driver Link
            </button>
            <button className="btn" onClick={sendDockEmail} disabled={!canEmailDock}>
              Email Dock Verify Link
            </button>
            <button className="btn" onClick={copyBoth} disabled={!canCopyBoth}>
              Copy Both
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
