import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY_PREFIX = "adbsv1_token_";
const ATTEMPT_PREFIX = "adbsv1_attempts_";

// Auto-format phone as 123-456-7890
function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function generateToken() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 7; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `DEMO-${out}`;
}

export default function ControlCenter() {
  const navigate = useNavigate();
  const [loadRef, setLoadRef] = useState("12345");
  const [carrierName, setCarrierName] = useState("ABC Trucking");
  const [usdDot, setUsdDot] = useState("ABC12345");
  const [plate, setPlate] = useState("ABC12345");
  const [driverName, setDriverName] = useState("John Doe");
  const [driverPhone, setDriverPhone] = useState("123-456-7890");
  const [sendEmail, setSendEmail] = useState("quecabinc@gmail.com");
  const [linkExpires, setLinkExpires] = useState("12/31/2025");

  const [issuedToken, setIssuedToken] = useState("");
  const [issuedUrl, setIssuedUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [activeLinks, setActiveLinks] = useState([]);
  const [recentChecks] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("adbsv1_demoAuth");
    if (!raw) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(STORAGE_KEY_PREFIX)
    );
    const items = keys
      .map((key) => {
        try {
          return JSON.parse(localStorage.getItem(key) || "{}");
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 5);
    setActiveLinks(items);
  }, []);

  const handleIssueLink = () => {
    setStatusMessage("");
    const token = generateToken();
    const verifyUrl = `${window.location.origin}/#/verify/${token}`;

    const payload = {
      token,
      adbSId: token,
      loadRef,
      carrierName,
      usdDotOnRecord: usdDot,
      plateOnRecord: plate,
      driverName,
      driverPhone,
      sendEmail,
      linkExpires,
      createdAt: Date.now(),
    };

    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${token}`,
      JSON.stringify(payload)
    );
    localStorage.setItem(`${ATTEMPT_PREFIX}${token}`, "0");

    setIssuedToken(token);
    setIssuedUrl(verifyUrl);
    setStatusMessage(
      "Demo only – this link would be sent to the driver and dock in production."
    );
    setActiveLinks((prev) => [payload, ...prev].slice(0, 5));
  };

  return (
    <div
      style={{
        padding: "32px 40px 48px",
        display: "flex",
        gap: "24px",
        color: "white",
      }}
    >
      {/* LEFT: ISSUE LINK */}
      <section
        style={{
          flex: 1.2,
          background: "#020617",
          borderRadius: "18px",
          padding: "24px 24px 28px",
          border: "1px solid rgba(148,163,184,0.4)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "6px",
          }}
        >
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS Logo"
            style={{ width: "40px", height: "40px", objectFit: "contain" }}
          />
          <h2
            style={{
              fontSize: "24px",
            }}
          >
            AdbS Control Center
          </h2>
        </div>

        <p
          style={{
            fontSize: "14px",
            opacity: 0.85,
            marginBottom: "20px",
          }}
        >
          Issue AdbS Truck-Driver verification links and monitor activity in
          front of the dock. Demo mode only – no live data is stored.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px 18px",
            marginBottom: "18px",
          }}
        >
          <Field
            label="Load / Reference #"
            value={loadRef}
            onChange={setLoadRef}
          />
          <Field
            label="Carrier / Legal Name"
            value={carrierName}
            onChange={setCarrierName}
          />
          <Field
            label="USDOT# on Record"
            value={usdDot}
            onChange={(v) => setUsdDot(v.toUpperCase())}
          />
          <Field
            label="License Plate on Record"
            value={plate}
            onChange={(v) => setPlate(v.toUpperCase())}
          />
          <Field
            label="Driver Name (optional)"
            value={driverName}
            onChange={setDriverName}
          />
          <Field
            label="Driver Phone #"
            value={driverPhone}
            onChange={(v) => setDriverPhone(formatPhone(v))}
          />
          <Field
            label="Send link via email"
            value={sendEmail}
            onChange={setSendEmail}
          />
          <Field
            label="Link expires (optional)"
            value={linkExpires}
            onChange={setLinkExpires}
          />
        </div>

        <button
          type="button"
          onClick={handleIssueLink}
          style={{
            marginTop: "8px",
            padding: "14px 24px",
            fontSize: "18px",
            fontWeight: 600,
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background:
              "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
          }}
        >
          Issue Verification Link (Demo)
        </button>

        {issuedToken && (
          <div
            style={{
              marginTop: "18px",
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.7)",
              fontSize: "14px",
            }}
          >
            <div style={{ marginBottom: "4px" }}>
              <strong>AdbS ID:</strong> {issuedToken}
            </div>
            <div style={{ marginBottom: "4px" }}>
              <strong>Verify URL:</strong>{" "}
              <span style={{ wordBreak: "break-all" }}>{issuedUrl}</span>
            </div>
            <div style={{ opacity: 0.8 }}>{statusMessage}</div>
          </div>
        )}

        {!issuedToken && (
          <div
            style={{
              marginTop: "16px",
              fontSize: "13px",
              opacity: 0.75,
            }}
          >
            Demo only – in production this panel would send the AdbS
            Truck-Driver Verification Link to the driver and check-in device.
          </div>
        )}
      </section>

      {/* RIGHT: ACTIVE LINKS + RECENT CHECKS */}
      <section
        style={{
          flex: 0.9,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "18px",
        }}
      >
        <div
          style={{
            background: "#020617",
            borderRadius: "18px",
            padding: "20px",
            border: "1px solid rgba(148,163,184,0.4)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              marginBottom: "10px",
            }}
          >
            Active AdbS Links (Demo)
          </h3>
          {activeLinks.length === 0 ? (
            <p
              style={{
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              No demo links yet. Issue a Truck-Driver verification link to see
              it listed here.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "14px",
              }}
            >
              {activeLinks.map((item) => (
                <div
                  key={item.token}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: "#020617",
                    border: "1px solid rgba(55,65,81,0.9)",
                  }}
                >
                  <div>
                    <strong>AdbS ID:</strong> {item.adbSId}
                  </div>
                  <div>
                    <strong>Load:</strong> {item.loadRef} – {item.carrierName}
                  </div>
                  <div>
                    <strong>USDOT / Plate:</strong> {item.usdDotOnRecord} /{" "}
                    {item.plateOnRecord}
                  </div>
                  <div style={{ opacity: 0.8 }}>
                    <strong>Status:</strong> Awaiting dock verification
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            background: "#020617",
            borderRadius: "18px",
            padding: "20px",
            border: "1px solid rgba(148,163,184,0.4)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              marginBottom: "10px",
            }}
          >
            Recent Truck-Driver Checks (Demo)
          </h3>
          {recentChecks.length === 0 ? (
            <p
              style={{
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              Demo only – in production, this panel would show the most recent
              CLEAR TO LOAD and CAUTION ALERT results for your lanes.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "14px",
          marginBottom: "4px",
        }}
      >
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 11px",
          fontSize: "16px",
          borderRadius: "10px",
          border: "1px solid #64748b",
          background: "#0f172a",
          color: "white",
        }}
      />
    </div>
  );
}
