import { useState } from "react";
import Layout from "../components/Layout";

// Format 5855061158 -> 585-506-1158
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

function randomFailedAttempts() {
  return Math.floor(Math.random() * 8); // 0–7, demo only
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

  const [status, setStatus] = useState(null); // { type: "success" | "error", message }
  const [lastIssued, setLastIssued] = useState(null);
  const [links, setLinks] = useState([]);

  const handleDriverPhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setDriverPhone(formatted);
  };

  const handleIssueLink = (e) => {
    e.preventDefault();
    setStatus(null);

    const missingRequired =
      !loadRef.trim() ||
      !carrierName.trim() ||
      !usdDot.trim() ||
      !licensePlate.trim() ||
      !driverPhone.trim() ||
      !sendToEmail.trim();

    if (missingRequired) {
      setStatus({
        type: "error",
        message: "Please complete all required fields before issuing a link.",
      });
      return;
    }

    if (!sendViaEmail && !sendViaText) {
      setStatus({
        type: "error",
        message: 'Select at least one method under "Send Link Via".',
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
      statusText: "Awaiting dock verification",
      failedAttempts: randomFailedAttempts(),
      createdAt: new Date().toISOString(),
    };

    setLastIssued(linkRecord);
    setLinks((prev) => [linkRecord, ...prev]);
    setStatus({
      type: "success",
      message: "Demo Truck-Driver Verify link issued below.",
    });
  };

  const handleRevokeLink = (token) => {
    setLinks((prev) => prev.filter((link) => link.token !== token));
  };

  // Layout styles
  const shellStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const layoutStyle = {
    padding: "32px 16px 72px",
  };

  const titleStyle = {
    fontSize: "1.9rem",
    fontWeight: 700,
    marginBottom: "6px",
  };

  const subtitleStyle = {
    fontSize: "0.95rem",
    opacity: 0.85,
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2.2fr) minmax(0, 2fr) minmax(0, 2fr)",
    gap: "24px",
    marginTop: "24px",
    alignItems: "flex-start",
  };

  const cardStyle = {
    background:
      "linear-gradient(145deg, rgba(5,10,22,0.98), rgba(3,6,14,0.98))",
    borderRadius: "16px",
    padding: "18px 18px 20px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.85)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  const cardTitleStyle = {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: "10px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    marginBottom: "4px",
    opacity: 0.9,
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    height: "40px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.16)",
    backgroundColor: "rgba(2,6,17,0.98)",
    color: "#f7f9ff",
    padding: "0 12px",
    fontSize: "0.9rem",
    outline: "none",
  };

  const twoColRowStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: "12px",
    marginBottom: "12px",
  };

  const rowStyle = {
    marginBottom: "12px",
  };

  const checkboxRowStyle = {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    marginTop: "2px",
  };

  const checkboxLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.85rem",
  };

  const primaryButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 22px",
    borderRadius: "999px",
    border: "none",
    fontSize: "0.95rem",
    fontWeight: 600,
    background:
      "linear-gradient(135deg, #18a34a, #16c95b)",
    color: "#ffffff",
    cursor: "pointer",
    boxShadow:
      "0 0 0 1px rgba(0,0,0,0.5), 0 11px 26px rgba(0,0,0,0.9)",
    marginTop: "4px",
  };

  const revokeButtonStyle = {
    backgroundColor: "#b02a37",
    border: "none",
    borderRadius: "999px",
    padding: "4px 14px",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#ffffff",
    cursor: "pointer",
    boxShadow:
      "0 0 0 1px rgba(0,0,0,0.4), 0 6px 14px rgba(0,0,0,0.7)",
  };

  const statusBannerBase = {
    marginTop: "18px",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "0.9rem",
    fontWeight: 500,
  };

  const statusBannerSuccess = {
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(5,46,22,0.95))",
    border: "1px solid rgba(52,211,153,0.6)",
    color: "#bbf7d0",
  };

  const statusBannerError = {
    background:
      "linear-gradient(135deg, rgba(239,68,68,0.16), rgba(69,10,10,0.95))",
    border: "1px solid rgba(248,113,113,0.7)",
    color: "#fecaca",
  };

  const activeLinkItemStyle = {
    padding: "10px 12px",
    borderRadius: "12px",
    backgroundColor: "rgba(2,8,23,0.95)",
    border: "1px solid rgba(148,163,184,0.3)",
    boxShadow: "0 8px 18px rgba(0,0,0,0.75)",
  };

  return (
    <Layout pageTitle="AdbS Control Center">
      <main
        className="page-container control-center-page"
        style={layoutStyle}
      >
        <div className="content-shell" style={shellStyle}>
          <h1 style={titleStyle}>AdbS Control Center</h1>
          <p style={subtitleStyle}>
            Issue AdbS Truck-Driver verification links and monitor activity in
            front of the dock. Demo mode only – no live data is stored.
          </p>

          {status && (
            <div
              style={{
                ...statusBannerBase,
                ...(status.type === "success"
                  ? statusBannerSuccess
                  : statusBannerError),
              }}
            >
              {status.message}
            </div>
          )}

          <div style={gridStyle}>
            {/* LEFT: Issue link */}
            <section style={cardStyle}>
              <h2 style={cardTitleStyle}>
                Issue AdbS Truck-Driver Verify Link
              </h2>

              <form onSubmit={handleIssueLink}>
                <div style={rowStyle}>
                  <label style={labelStyle}>
                    Load / Reference #<span style={{ color: "#f97373" }}> *</span>
                  </label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={loadRef}
                    onChange={(e) => setLoadRef(e.target.value)}
                    placeholder="Load / PO / Reference #"
                  />
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>
                    Carrier / Legal Name
                    <span style={{ color: "#f97373" }}> *</span>
                  </label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    placeholder="Exact carrier / legal name"
                  />
                </div>

                <div style={twoColRowStyle}>
                  <div>
                    <label style={labelStyle}>
                      USDOT# on Truck
                      <span style={{ color: "#f97373" }}> *</span>
                    </label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={usdDot}
                      onChange={(e) =>
                        setUsdDot(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. 1234567"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      License Plate on Truck
                      <span style={{ color: "#f97373" }}> *</span>
                    </label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={licensePlate}
                      onChange={(e) =>
                        setLicensePlate(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. ABC12345"
                    />
                  </div>
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>Driver Name (optional)</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Driver name (optional)"
                  />
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>
                    Driver Phone #
                    <span style={{ color: "#f97373" }}> *</span>
                  </label>
                  <input
                    type="tel"
                    style={inputStyle}
                    value={driverPhone}
                    onChange={handleDriverPhoneChange}
                    placeholder="585-506-1158"
                  />
                </div>

                <div style={rowStyle}>
                  <span style={labelStyle}>
                    Send Link Via
                    <span style={{ color: "#f97373" }}> *</span>
                  </span>
                  <div style={checkboxRowStyle}>
                    <label style={checkboxLabelStyle}>
                      <input
                        type="checkbox"
                        checked={sendViaEmail}
                        onChange={(e) =>
                          setSendViaEmail(e.target.checked)
                        }
                      />
                      <span>Email</span>
                    </label>
                    <label style={checkboxLabelStyle}>
                      <input
                        type="checkbox"
                        checked={sendViaText}
                        onChange={(e) => setSendViaText(e.target.checked)}
                      />
                      <span>Text</span>
                    </label>
                  </div>
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>
                    Send to Email
                    <span style={{ color: "#f97373" }}> *</span>
                  </label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={sendToEmail}
                    onChange={(e) => setSendToEmail(e.target.value)}
                    placeholder="Where should the link be emailed?"
                  />
                </div>

                <div style={twoColRowStyle}>
                  <div>
                    <label style={labelStyle}>
                      Link Start (optional)
                    </label>
                    <input
                      type="date"
                      style={inputStyle}
                      value={linkStart}
                      onChange={(e) => setLinkStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      Link Expires (optional)
                    </label>
                    <input
                      type="date"
                      style={inputStyle}
                      value={linkExpires}
                      onChange={(e) => setLinkExpires(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <button type="submit" style={primaryButtonStyle}>
                    Issue Verification Link (Demo)
                  </button>
                </div>
              </form>

              {lastIssued && (
                <div
                  style={{
                    ...statusBannerBase,
                    marginTop: "16px",
                    ...statusBannerSuccess,
                  }}
                >
                  <div style={{ marginBottom: "4px" }}>
                    <strong>AdbS ID:</strong> {lastIssued.token}
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Verify URL:</strong>{" "}
                    <a
                      href={lastIssued.verifyUrl}
                      style={{
                        color: "#4db2ff",
                        textDecoration: "none",
                        fontWeight: 600,
                        wordBreak: "break-all",
                      }}
                    >
                      {lastIssued.verifyUrl}
                    </a>
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                    <strong>Load:</strong> {lastIssued.loadRef} –{" "}
                    {lastIssued.carrierName} •{" "}
                    <strong>USDOT / Plate:</strong> {lastIssued.usdDot} /{" "}
                    {lastIssued.licensePlate}
                  </div>
                </div>
              )}
            </section>

            {/* CENTER: Active links */}
            <section style={cardStyle}>
              <h2 style={cardTitleStyle}>Active AdbS Links (Demo)</h2>
              {links.length === 0 ? (
                <p style={{ fontSize: "0.85rem", opacity: 0.85 }}>
                  No active demo links yet. Issue a Truck-Driver Verify Link
                  on the left to see it here.
                </p>
              ) : (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {links.map((link) => (
                    <li key={link.token} style={activeLinkItemStyle}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "4px",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "0.85rem" }}>
                          <strong>AdbS ID:</strong> {link.token}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRevokeLink(link.token)}
                          style={revokeButtonStyle}
                        >
                          Revoke Link
                        </button>
                      </div>
                      <div style={{ fontSize: "0.82rem" }}>
                        <div>
                          <strong>Load:</strong> {link.loadRef} –{" "}
                          {link.carrierName}
                        </div>
                        <div>
                          <strong>USDOT / Plate:</strong> {link.usdDot} /{" "}
                          {link.licensePlate}
                        </div>
                        <div>
                          <strong>Status:</strong> {link.statusText}
                        </div>
                        <div>
                          <strong>Failed attempts (demo):</strong>{" "}
                          {link.failedAttempts}
                        </div>
                        <div>
                          <strong>Verify URL:</strong>{" "}
                          <a
                            href={link.verifyUrl}
                            style={{
                              color: "#4db2ff",
                              textDecoration: "none",
                              fontWeight: 600,
                              wordBreak: "break-all",
                            }}
                          >
                            {link.verifyUrl}
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* RIGHT: Recent checks placeholder */}
            <section style={cardStyle}>
              <h2 style={cardTitleStyle}>Recent Truck-Driver Checks</h2>
              <p style={{ fontSize: "0.85rem", opacity: 0.85 }}>
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
