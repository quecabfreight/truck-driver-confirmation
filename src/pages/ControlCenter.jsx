import React, { useEffect, useState } from "react";

const STORAGE_KEY = "adbsv1-demo-links";

function loadStoredLinks() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredLinks(list) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function makeDemoToken() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `DEMO-${code}`;
}

function formatUpper(value) {
  return (value || "").toUpperCase();
}

function formatPhone(value) {
  const digits = (value || "").replace(/\D/g, "").slice(0, 10);

  if (!digits) return "";

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function ControlCenter() {
  const [form, setForm] = useState({
    loadReference: "",
    carrierName: "",
    usdotOnRecord: "",
    plateOnRecord: "",
    driverName: "",
    driverPhone: "",
    sendViaEmail: true,
    sendViaText: false,
    sendToEmail: "",
    linkStartDate: "",
    linkExpiryDate: "",
  });

  const [activeLinks, setActiveLinks] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setActiveLinks(loadStoredLinks());
  }, []);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    let nextValue = type === "checkbox" ? checked : value;

    // Auto-uppercase USDOT / plate
    if (name === "usdotOnRecord" || name === "plateOnRecord") {
      nextValue = formatUpper(nextValue);
    }

    // Auto-format driver phone
    if (name === "driverPhone") {
      nextValue = formatPhone(nextValue);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  function handleIssueLink(e) {
    e.preventDefault();
    setStatus(null);

    if (!form.loadReference || !form.carrierName) {
      setStatus({
        type: "error",
        message: "Enter at least a Load Reference and Carrier / Legal Name.",
      });
      return;
    }

    if (!form.usdotOnRecord || !form.plateOnRecord) {
      setStatus({
        type: "error",
        message: "Enter the USDOT# and license plate from your paperwork.",
      });
      return;
    }

    if (!form.driverPhone) {
      setStatus({
        type: "error",
        message: "Enter a driver phone number for this load.",
      });
      return;
    }

    const token = makeDemoToken();
    const createdAt = new Date().toISOString();

    const linkRecord = {
      token,
      createdAt,
      loadReference: form.loadReference.trim(),
      carrierName: form.carrierName.trim(),
      usdotOnRecord: form.usdotOnRecord.trim(),
      plateOnRecord: form.plateOnRecord.trim(),
      driverName: form.driverName.trim(),
      driverPhone: form.driverPhone.trim(),
      sendViaEmail: form.sendViaEmail,
      sendViaText: form.sendViaText,
      sendToEmail: form.sendToEmail.trim(),
      linkStartDate: form.linkStartDate.trim(),
      linkExpiryDate: form.linkExpiryDate.trim(),
    };

    const updated = [linkRecord, ...activeLinks];
    setActiveLinks(updated);
    saveStoredLinks(updated);

    setStatus({
      type: "success",
      message:
        "Demo only. In the live system this would generate a unique AdbS Truck-Driver Verify Link and deliver it by the methods you chose. The link is now shown in Active Verify Links.",
    });
  }

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://quecabadbs.com";

  return (
    <div className="qc-shell qc-dash">
      <div className="qc-inner">
        <header className="qc-dash-header">
          <h1 className="qc-heading">AdbS Control Center</h1>
          <p className="qc-sub">
            For licensed brokers and shippers to issue AdbS Truck-Driver Verify Links,
            monitor active loads, and review recent dock-side checks. This build is a
            visual demo – live wiring comes next.
          </p>
        </header>

        <div className="qc-dash-grid qc-dash-grid-3">
          {/* LEFT – ISSUE LINK */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Issue AdbS Verification Link</h2>
            <p className="qc-dash-text">
              Define a specific load and Truck-Driver unit. AdbS will generate a
              verification link that your dock team uses to confirm the USDOT# and plate
              against your record before loading.
            </p>

            <form className="qc-form" onSubmit={handleIssueLink}>
              <div className="qc-form-grid-2">
                <div className="qc-field">
                  <label className="qc-label">
                    Load Reference <span className="qc-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="loadReference"
                    className="qc-input"
                    value={form.loadReference}
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
                    USDOT# on Record <span className="qc-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="usdotOnRecord"
                    className="qc-input"
                    value={form.usdotOnRecord}
                    onChange={handleChange}
                    placeholder="Uppercase or numbers as on paperwork"
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">
                    License Plate on Record <span className="qc-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="plateOnRecord"
                    className="qc-input"
                    value={form.plateOnRecord}
                    onChange={handleChange}
                    placeholder="Exact plate text"
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">Driver Name (optional)</label>
                  <input
                    type="text"
                    name="driverName"
                    className="qc-input"
                    value={form.driverName}
                    onChange={handleChange}
                    placeholder="John Doe"
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
              </div>

              <div className="qc-field qc-field-row">
                <label className="qc-label">Send Link Via</label>
                <div className="qc-checkbox-row">
                  <label className="qc-checkbox">
                    <input
                      type="checkbox"
                      name="sendViaEmail"
                      checked={form.sendViaEmail}
                      onChange={handleChange}
                    />
                    <span>Email</span>
                  </label>
                  <label className="qc-checkbox">
                    <input
                      type="checkbox"
                      name="sendViaText"
                      checked={form.sendViaText}
                      onChange={handleChange}
                    />
                    <span>Text</span>
                  </label>
                </div>
              </div>

              <div className="qc-field">
                <label className="qc-label">Send To Email *</label>
                <input
                  type="email"
                  name="sendToEmail"
                  className="qc-input"
                  value={form.sendToEmail}
                  onChange={handleChange}
                  placeholder="dock or dispatcher email for now"
                />
              </div>

              <div className="qc-form-grid-2">
                <div className="qc-field">
                  <label className="qc-label">Link Start (optional)</label>
                  <input
                    type="text"
                    name="linkStartDate"
                    className="qc-input"
                    value={form.linkStartDate}
                    onChange={handleChange}
                    placeholder="MM/DD/YYYY"
                  />
                </div>

                <div className="qc-field">
                  <label className="qc-label">Link Expires (optional)</label>
                  <input
                    type="text"
                    name="linkExpiryDate"
                    className="qc-input"
                    value={form.linkExpiryDate}
                    onChange={handleChange}
                    placeholder="MM/DD/YYYY"
                  />
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
                </div>
              )}

              <div className="qc-form-actions">
                <button type="submit" className="qc-btn-primary qc-btn-wide">
                  Issue Verification Link (Demo)
                </button>
              </div>

              <p className="qc-note qc-mono qc-mt-sm">
                Demo only. In the live system this will generate a unique AdbS Truck-Driver
                Verify Link for this load and deliver it by the methods you choose.
              </p>
            </form>
          </section>

          {/* MIDDLE – ACTIVE LINKS */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Active Verify Links</h2>
            <p className="qc-dash-text">
              In the full system, this will show AdbS Truck-Driver Verify Links that are
              currently valid and waiting to be used at the dock.
            </p>

            {activeLinks.length === 0 ? (
              <p className="qc-note">No active links in this demo yet.</p>
            ) : (
              <ul className="qc-list-plain qc-list-links">
                {activeLinks.map((link) => {
                  const fullUrl = `${baseUrl}/#/verify/${link.token}`;
                  return (
                    <li key={link.token} className="qc-link-row">
                      <div className="qc-link-main">
                        <div className="qc-link-title">
                          <span className="qc-mono">
                            {link.loadReference || "Load"} — {link.carrierName || "Carrier"}
                          </span>
                        </div>
                        <div className="qc-link-meta">
                          USDOT#: {link.usdotOnRecord || "?"} &nbsp;•&nbsp; Plate:{" "}
                          {link.plateOnRecord || "?"}
                        </div>
                        <div className="qc-link-meta">
                          Window:{" "}
                          {link.linkStartDate || "start now"} &nbsp;→&nbsp;{" "}
                          {link.linkExpiryDate || "no expiry in this demo"}
                        </div>
                        <div className="qc-link-url">
                          Link:{" "}
                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="qc-inline-link"
                          >
                            {fullUrl}
                          </a>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="qc-note qc-mono qc-mt-sm">
              Demo only. Clicking a link opens the Truck-Driver Verification screen for
              that token. In the live system, these links will also track status and
              activity.
            </p>
          </section>

          {/* RIGHT – RECENT CHECKS (STILL STATIC DEMO) */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Recent Truck-Driver Checks</h2>
            <p className="qc-dash-text">
              This panel will list recent dock-side verifications, including whether the
              USDOT# and plate matched and if the driver answered their registered phone.
              When wired, this becomes your at-a-glance history of Truck-Driver
              confirmations.
            </p>
            <div className="qc-empty-panel">
              <p className="qc-note">No recent checks in this demo.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
