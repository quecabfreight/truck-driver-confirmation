import { useState } from "react";
import Layout from "../components/Layout";

function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function generateDemoToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i += 1) {
    const idx = Math.floor(Math.random() * chars.length);
    result += chars[idx];
  }
  return `DEMO-${result}`;
}

export default function ControlCenter() {
  const [loadRef, setLoadRef] = useState("");
  const [carrierName, setCarrierName] = useState("");
  const [usdDot, setUsdDot] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [sendViaEmail, setSendViaEmail] = useState(true);
  const [sendViaText, setSendViaText] = useState(false);
  const [sendToEmail, setSendToEmail] = useState("");
  const [linkStart, setLinkStart] = useState("");
  const [linkExpires, setLinkExpires] = useState("");

  const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }
  const [lastIssued, setLastIssued] = useState(null);
  const [links, setLinks] = useState([]);

  const handleDriverPhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setDriverPhone(formatted);
  };

  const handleIssueLink = (e) => {
    e.preventDefault();
    setStatus(null);

    if (
      !loadRef.trim() ||
      !carrierName.trim() ||
      !usdDot.trim() ||
      !licensePlate.trim() ||
      !driverPhone.trim() ||
      !sendToEmail.trim()
    ) {
      setStatus({
        type: "error",
        message: "Please complete all required fields before issuing a link.",
      });
      return;
    }

    if (!sendViaEmail && !sendViaText) {
      setStatus({
        type: "error",
        message: "Select at least one method under “Send Link Via”.",
      });
      return;
    }

    const token = generateDemoToken();
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    const verifyUrl = `${baseUrl}/#/verify/${token}`;

    const linkRecord = {
      token,
      verifyUrl,
      loadRef,
      carrierName,
      usdDot,
      licensePlate,
      driverName,
      driverPhone,
      sendViaEmail,
      sendViaText,
      sendToEmail,
      linkStart,
      linkExpires,
      createdAt: new Date().toISOString(),
    };

    setLastIssued(linkRecord);
    setLinks((prev) => [linkRecord, ...prev]);
    setStatus({
      type: "success",
      message: "Demo Truck-Driver Verify link issued below.",
    });
  };

  return (
    <Layout pageTitle="AdbS Control Center">
      <main className="page-container control-center-page">
        <div className="content-shell">
          <h1 className="page-title">AdbS Control Center</h1>
          <p className="page-subtitle">
            Issue QueCab AdbS Truck-Driver Verify Links, review active links,
            and track recent checks. This demo issues mock links for testing.
          </p>

          {status && (
            <div
              className={`status-banner ${
                status.type === "success"
                  ? "status-banner-success"
                  : "status-banner-error"
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="control-center-grid">
            {/* Left panel: Issue AdbS Verification Link */}
            <section className="card control-card issue-link-card">
              <h2 className="card-title">Issue AdbS Truck-Driver Verify Link</h2>
              <form onSubmit={handleIssueLink} className="form-grid">
                <div className="form-row">
                  <label className="form-label">
                    Load Reference<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={loadRef}
                    onChange={(e) => setLoadRef(e.target.value)}
                    placeholder="Load / PO / Reference #"
                  />
                </div>

                <div className="form-row">
                  <label className="form-label">
                    Carrier / Legal Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    placeholder="Exact carrier / legal name"
                  />
                </div>

                <div className="form-row two-col">
                  <div className="col">
                    <label className="form-label">
                      USDOT# on Truck<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={usdDot}
                      onChange={(e) => setUsdDot(e.target.value.toUpperCase())}
                      placeholder="e.g. 1234567"
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">
                      License Plate on Truck<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={licensePlate}
                      onChange={(e) =>
                        setLicensePlate(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. ABC1234"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">Driver Name (optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Driver name (optional)"
                  />
                </div>

                <div className="form-row">
                  <label className="form-label">
                    Driver Phone<span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={driverPhone}
                    onChange={handleDriverPhoneChange}
                    placeholder="585-506-1158"
                  />
                </div>

                <div className="form-row">
                  <span className="form-label">
                    Send Link Via<span className="required">*</span>
                  </span>
                  <div className="checkbox-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={sendViaEmail}
                        onChange={(e) => setSendViaEmail(e.target.checked)}
                      />
                      <span>Email</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={sendViaText}
                        onChange={(e) => setSendViaText(e.target.checked)}
                      />
                      <span>Text</span>
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">
                    Send To Email<span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={sendToEmail}
                    onChange={(e) => setSendToEmail(e.target.value)}
                    placeholder="Where should the link be emailed?"
                  />
                </div>

                <div className="form-row two-col">
                  <div className="col">
                    <label className="form-label">Link Start (optional)</label>
                    <input
                      type="date"
                      className="form-input"
                      value={linkStart}
                      onChange={(e) => setLinkStart(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">
                      Link Expires (optional)
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={linkExpires}
                      onChange={(e) => setLinkExpires(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-button">
                    Issue Demo Verify Link
                  </button>
                </div>
              </form>

              {lastIssued && (
                <div className="status-banner status-banner-success last-issued-banner">
                  <div className="last-issued-title">
                    Latest demo Truck-Driver Verify Link:
                  </div>
                  <div className="last-issued-body">
                    <div>
                      <strong>Token:</strong> {lastIssued.token}
                    </div>
                    <div>
                      <strong>Verify URL:</strong>{" "}
                      <a
                        href={lastIssued.verifyUrl}
                        style={{
                          color: "#4db2ff",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        {lastIssued.verifyUrl}
                      </a>
                    </div>
                    <div className="last-issued-meta">
                      <span>
                        <strong>Load:</strong> {lastIssued.loadRef}
                      </span>
                      <span>
                        <strong>Carrier:</strong> {lastIssued.carrierName}
                      </span>
                      <span>
                        <strong>USDOT:</strong> {lastIssued.usdDot}
                      </span>
                      <span>
                        <strong>Plate:</strong> {lastIssued.licensePlate}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Center panel: Active Verify Links */}
            <section className="card control-card active-links-card">
              <h2 className="card-title">Active Verify Links (demo)</h2>
              {links.length === 0 ? (
                <p className="card-empty">
                  No active demo links yet. Issue a Truck-Driver Verify Link on
                  the left to see it here.
                </p>
              ) : (
                <ul className="active-links-list">
                  {links.map((link) => (
                    <li key={link.token} className="active-link-item">
                      <div className="active-link-main">
                        <div className="active-link-row">
                          <strong>Load:</strong> {link.loadRef}
                        </div>
                        <div className="active-link-row">
                          <strong>Carrier:</strong> {link.carrierName}
                        </div>
                        <div className="active-link-row">
                          <strong>USDOT / Plate:</strong> {link.usdDot} /{" "}
                          {link.licensePlate}
                        </div>
                        <div className="active-link-row">
                          <strong>Send:</strong>{" "}
                          {[
                            link.sendViaEmail ? "Email" : null,
                            link.sendViaText ? "Text" : null,
                          ]
                            .filter(Boolean)
                            .join(" & ")}{" "}
                          → {link.sendToEmail}
                        </div>
                        <div className="active-link-row">
                          <strong>Window:</strong>{" "}
                          {link.linkStart || "Immediate"}{" "}
                          {link.linkExpires
                            ? `→ Expires ${link.linkExpires}`
                            : ""}
                        </div>
                      </div>
                      <div className="active-link-url">
                        <a
                          href={link.verifyUrl}
                          style={{
                            color: "#4db2ff",
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                        >
                          {link.verifyUrl}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Right panel: Recent Truck-Driver Checks */}
            <section className="card control-card recent-checks-card">
              <h2 className="card-title">Recent Truck-Driver Checks</h2>
              <p className="card-empty">
                No recent checks in this demo. Once the Verify screen is wired
                to return outcomes, completed Truck-Driver verifications will
                appear here.
              </p>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}
