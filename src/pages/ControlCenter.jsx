// src/pages/ControlCenter.jsx
import React, { useEffect, useState } from "react";

// Demo token generator like DEMO-ABC123
function makeDemoToken() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `DEMO-${code}`;
}

// Uppercase for USDOT / plate
function formatUpper(value) {
  return (value || "").toUpperCase();
}

// Auto-format phone as 123-456-7890
function formatPhone(value) {
  const digits = (value || "").replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Nice label for display window
function formatDateLabel(dateStr) {
  if (!dateStr) return "Not set";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Not set";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function ControlCenter() {
  const [form, setForm] = useState({
    loadRef: "",
    carrierName: "",
    usdot: "",
    plate: "",
    driverName: "",
    driverPhone: "",
    sendEmail: true,
    sendText: false,
    sendToEmail: "",
    linkStart: "",
    linkExpires: "",
  });

  const [status, setStatus] = useState(null);
  const [lastDemo, setLastDemo] = useState(null);
  const [activeLinks, setActiveLinks] = useState([]);

  // Mobile layout – tabs instead of 3 squished cards
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState("issue");

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 900);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    let nextValue = type === "checkbox" ? checked : value;

    if (name === "usdot" || name === "plate") {
      nextValue = formatUpper(nextValue);
    }

    if (name === "driverPhone") {
      nextValue = formatPhone(nextValue);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!form.loadRef.trim()) {
      setStatus({ type: "error", message: "Load reference is required." });
      return;
    }
    if (!form.carrierName.trim()) {
      setStatus({
        type: "error",
        message: "Carrier / legal name is required.",
      });
      return;
    }
    if (!form.usdot.trim()) {
      setStatus({ type: "error", message: "USDOT# on Truck is required." });
      return;
    }
    if (!form.plate.trim()) {
      setStatus({
        type: "error",
        message: "License plate on Truck is required.",
      });
      return;
    }
    if (!form.sendEmail && !form.sendText) {
      setStatus({
        type: "error",
        message: "Choose at least one delivery method: Email or Text.",
      });
      return;
    }
    if (form.sendEmail && !form.sendToEmail.trim()) {
      setStatus({
        type: "error",
        message:
          "Enter the email where the AdbS Truck-Driver Verify Link should be sent.",
      });
      return;
    }
    if (!form.driverPhone.trim()) {
      setStatus({
        type: "error",
        message: "Enter a driver phone number for this load.",
      });
      return;
    }

    const token = makeDemoToken();
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://quecabadbs.com";
    const url = `${origin}/#/verify/${token}`;

    const startLabel = form.linkStart
      ? formatDateLabel(form.linkStart)
      : "Starts now";
    const endLabel = form.linkExpires
      ? formatDateLabel(form.linkExpires)
      : "Until cleared";

    const entry = {
      token,
      url,
      loadRef: form.loadRef.trim(),
      carrierName: form.carrierName.trim(),
      usdot: form.usdot.trim(),
      plate: form.plate.trim(),
      driverName: form.driverName.trim(),
      driverPhone: form.driverPhone.trim(),
      sendEmail: form.sendEmail,
      sendText: form.sendText,
      sendToEmail: form.sendToEmail.trim(),
      windowStart: startLabel,
      windowEnd: endLabel,
    };

    setLastDemo(entry);
    setActiveLinks((prev) => [entry, ...prev]);

    setStatus({
      type: "success",
      message:
        "Demo only. This would generate a unique AdbS Truck-Driver Verify Link and deliver it by the methods you chose.",
    });
  }

  // ---------- Panels ----------

  function renderIssuePanel() {
    return (
      <section className="qc-dash-card">
        <h2 className="qc-dash-title">Issue AdbS Verification Link</h2>
        <p className="qc-dash-text">
          Define a specific load and Truck-Driver unit. AdbS will generate a
          verification link that your dock team uses to confirm the USDOT# and
          plate against your record before loading.
        </p>

        <form className="qc-form" onSubmit={handleSubmit}>
          <div className="qc-form-grid-single">
            <div className="qc-field">
              <label className="qc-label">
                Load Reference <span className="qc-required">*</span>
              </label>
              <input
                type="text"
                name="loadRef"
                className="qc-input"
                value={form.loadRef}
                onChange={handleChange}
                placeholder="PO#, load ID, or internal ref"
              />
            </div>

            <div className="qc-field">
              <label className="qc-label">
                Carrier / Legal Name <span className="qc-required">*</span>
              </label>
              <input
                type="text"
                name="carrierName"
                className="qc-input"
                value={form.carrierName}
                onChange={handleChange}
                placeholder="ABC Trucking"
              />
            </div>

            <div className="qc-field">
              <label className="qc-label">
                USDOT# on Truck <span className="qc-required">*</span>
              </label>
              <input
                type="text"
                name="usdot"
                className="qc-input"
                value={form.usdot}
                onChange={handleChange}
                placeholder="As painted on the truck door"
              />
            </div>

            <div className="qc-field">
              <label className="qc-label">
                License Plate on Truck{" "}
                <span className="qc-required">*</span>
              </label>
              <input
                type="text"
                name="plate"
                className="qc-input"
                value={form.plate}
                onChange={handleChange}
                placeholder="Exact plate text"
              />
            </div>

            <div className="qc-field">
              <label className="qc-label">
                Driver Name{" "}
                <span className="qc-label-optional">optional</span>
              </label>
              <input
                type="text"
                name="driverName"
                className="qc-input"
                value={form.driverName}
                onChange={handleChange}
                placeholder="For your internal notes"
              />
            </div>

            <div className="qc-field">
              <label className="qc-label">
                Driver Phone <span className="qc-required">*</span>
              </label>
              <input
                type="text"
                name="driverPhone"
                className="qc-input"
                value={form.driverPhone}
                onChange={handleChange}
                placeholder="123-456-7890"
              />
            </div>

            <div className="qc-field">
              <label className="qc-label">Send Link Via</label>
              <div className="qc-checkbox-row">
                <label className="qc-checkbox">
                  <input
                    type="checkbox"
                    name="sendEmail"
                    checked={form.sendEmail}
                    onChange={handleChange}
                  />
                  <span>Email</span>
                </label>
                <label className="qc-checkbox">
                  <input
                    type="checkbox"
                    name="sendText"
                    checked={form.sendText}
                    onChange={handleChange}
                  />
                  <span>Text</span>
                </label>
              </div>
            </div>

            <div className="qc-field">
              <label className="qc-label">
                Send To Email <span className="qc-required">*</span>
              </label>
              <input
                type="email"
                name="sendToEmail"
                className="qc-input"
                value={form.sendToEmail}
                onChange={handleChange}
                placeholder="dock or dispatcher email"
              />
            </div>

            <div className="qc-field qc-field-row">
              <div className="qc-field">
                <label className="qc-label">
                  Link Start{" "}
                  <span className="qc-label-optional">optional</span>
                </label>
                <input
                  type="date"
                  name="linkStart"
                  className="qc-input"
                  value={form.linkStart}
                  onChange={handleChange}
                />
              </div>
              <div className="qc-field">
                <label className="qc-label">
                  Link Expires{" "}
                  <span className="qc-label-optional">optional</span>
                </label>
                <input
                  type="date"
                  name="linkExpires"
                  className="qc-input"
                  value={form.linkExpires}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {status && (
            <div
              className={
                status.type === "success"
                  ? "qc-status qc-status-success"
                  : "qc-status qc-status-error"
              }
            >
              {status.message}
              {lastDemo && (
                <div className="qc-status-sub">
                  Token:{" "}
                  <span className="qc-mono">{lastDemo.token}</span>
                  <br />
                  Link:{" "}
                  <a
                    href={lastDemo.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "none",
                      color: "#7fd4ff",
                      fontWeight: 700,
                      wordBreak: "break-all",
                    }}
                  >
                    {lastDemo.url}
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="qc-form-actions">
            <button type="submit" className="qc-btn-primary qc-btn-wide">
              Issue Verification Link (Demo)
            </button>
          </div>

          <p className="qc-note qc-mono qc-mt-sm">
            Demo only. In the live system this will generate a unique AdbS
            Truck-Driver Verify Link for this load and deliver it by the
            methods you choose.
          </p>
        </form>
      </section>
    );
  }

  function renderActivePanel() {
    return (
      <section className="qc-dash-card">
        <h2 className="qc-dash-title">Active Verify Links</h2>
        <p className="qc-dash-text">
          In the full system, this will show AdbS Truck-Driver Verify Links
          that are currently valid and waiting to be used at the dock.
        </p>

        {activeLinks.length === 0 && (
          <div className="qc-empty">
            No active links in this demo yet. Once live, each entry will show
            load reference, carrier, link status, and last activity.
          </div>
        )}

        {activeLinks.length > 0 && (
          <ul className="qc-list qc-list-tight">
            {activeLinks.map((link) => (
              <li key={link.token} className="qc-list-item">
                <div className="qc-list-main">
                  <strong>{link.loadRef}</strong> — {link.carrierName}
                </div>
                <div className="qc-list-sub qc-mono">
                  USDOT#: {link.usdot} &nbsp; | &nbsp; Plate: {link.plate}
                </div>
                <div className="qc-list-sub">
                  Send via:{" "}
                  {[
                    link.sendEmail ? "Email" : null,
                    link.sendText ? "Text" : null,
                  ]
                    .filter(Boolean)
                    .join(" + ")}{" "}
                  {link.sendToEmail && (
                    <>
                      • Email to{" "}
                      <span className="qc-mono">{link.sendToEmail}</span>
                    </>
                  )}
                </div>
                <div className="qc-list-sub qc-mono">
                  Window: {link.windowStart} → {link.windowEnd}
                </div>
                <div className="qc-list-sub">
                  Link:{" "}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "none",
                      color: "#7fd4ff",
                      fontWeight: 700,
                      wordBreak: "break-all",
                    }}
                  >
                    {link.url}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  function renderRecentPanel() {
    return (
      <section className="qc-dash-card">
        <h2 className="qc-dash-title">Recent Truck-Driver Checks</h2>
        <p className="qc-dash-text">
          This panel will list recent dock-side verifications, including
          whether the USDOT# and plate matched and if the driver answered
          their registered phone.
        </p>

        <div className="qc-empty">
          No recent checks in this demo. When wired, this becomes your
          at-a-glance history of Truck-Driver confirmations.
        </div>
      </section>
    );
  }

  // ---------- Render ----------

  return (
    <div className="qc-shell qc-dash">
      <div className="qc-inner">
        <header className="qc-dash-header">
          <h1 className="qc-heading">AdbS Control Center</h1>
          <p className="qc-sub">
            For licensed brokers and shippers to issue AdbS Truck-Driver
            Verify Links, monitor active loads, and review recent dock-side
            checks. This build is a visual demo — live wiring comes next.
          </p>
        </header>

        {isMobile ? (
          <>
            {/* Mobile: tabs */}
            <div className="qc-tabs">
              <button
                type="button"
                onClick={() => setActivePanel("issue")}
                className={
                  activePanel === "issue"
                    ? "qc-tab qc-tab-active"
                    : "qc-tab"
                }
              >
                Issue Link
              </button>
              <button
                type="button"
                onClick={() => setActivePanel("active")}
                className={
                  activePanel === "active"
                    ? "qc-tab qc-tab-active"
                    : "qc-tab"
                }
              >
                Active Links
              </button>
              <button
                type="button"
                onClick={() => setActivePanel("recent")}
                className={
                  activePanel === "recent"
                    ? "qc-tab qc-tab-active"
                    : "qc-tab"
                }
              >
                Recent Checks
              </button>
            </div>

            <div className="qc-tabs-panel">
              {activePanel === "issue" && renderIssuePanel()}
              {activePanel === "active" && renderActivePanel()}
              {activePanel === "recent" && renderRecentPanel()}
            </div>
          </>
        ) : (
          // Desktop: 3-panel layout
          <div className="qc-dash-grid qc-dash-grid-3">
            {renderIssuePanel()}
            {renderActivePanel()}
            {renderRecentPanel()}
          </div>
        )}
      </div>
    </div>
  );
}
