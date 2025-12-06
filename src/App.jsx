import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

/* ---------- NAV LINK STYLE ---------- */
const navLinkStyle = {
  color: "white",
  textDecoration: "none",
};

/* ---------- SIMPLE LAYOUT WRAPPER ---------- */
function PageShell({ children }) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

/* ---------- HOME PAGE ---------- */
function Home() {
  return (
    <PageShell>
      <div
        style={{
          maxWidth: "780px",
          textAlign: "center",
          padding: "40px 32px 46px",
          background: "#020617",
          borderRadius: "20px",
          border: "1px solid rgba(148,163,184,0.5)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
        }}
      >
        <img
          src="/qc-logo.png"
          alt="QueCab AdbS Logo"
          style={{
            width: "110px",
            height: "110px",
            objectFit: "contain",
            marginBottom: "18px",
          }}
        />
        <h1 style={{ fontSize: "30px", marginBottom: "10px" }}>
          Secure Your Load With QueCab AdbS
        </h1>
        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            marginBottom: "26px",
          }}
        >
          The nation&apos;s first real-time <strong>Truck-Driver</strong>{" "}
          authentication system. Designed for brokers, shippers, and
          loading-dock personnel to kill double-brokering and identity fraud
          before it reaches the dock.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            marginBottom: "18px",
          }}
        >
          <Link to="/join">
            <button
              type="button"
              style={{
                padding: "14px 26px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: 600,
                background:
                  "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
              }}
            >
              Request Access
            </button>
          </Link>

          <Link to="/login">
            <button
              type="button"
              style={{
                padding: "14px 26px",
                borderRadius: "999px",
                border: "1px solid #38bdf8",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: 600,
                background: "transparent",
                color: "white",
              }}
            >
              Log In
            </button>
          </Link>
        </div>

        <p
          style={{
            fontSize: "14px",
            opacity: 0.8,
          }}
        >
          Demo environment only – production version connects to live QueCab
          AdbS control lanes.
        </p>
      </div>
    </PageShell>
  );
}

/* ---------- HOW IT WORKS PAGE ---------- */
function HowItWorks() {
  return (
    <PageShell>
      <div
        style={{
          width: "520px",
          padding: "34px 30px 32px",
          background: "#020617",
          borderRadius: "18px",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 18px 48px rgba(0,0,0,0.7)",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            marginBottom: "4px",
            textAlign: "center",
          }}
        >
          How QueCab AdbS Works
        </h1>
        <p
          style={{
            fontSize: "16px",
            marginBottom: "18px",
            textAlign: "center",
            opacity: 0.85,
          }}
        >
          1 link. 3 checks. Instant verification at the dock.
        </p>

        <ul
          style={{
            fontSize: "15px",
            lineHeight: 1.7,
            marginBottom: "18px",
            paddingLeft: "20px",
          }}
        >
          <li>What is the USDOT number on the truck?</li>
          <li>What is the license plate number on the truck?</li>
          <li>Did the driver answer their registered phone?</li>
        </ul>

        <p
          style={{
            fontSize: "14px",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          If all three checks confirm:
          <br />
          <strong>YES = CLEAR TO LOAD</strong>
        </p>
        <p
          style={{
            fontSize: "14px",
            textAlign: "center",
            color: "#f97373",
          }}
        >
          If anything feels off:
          <br />
          <strong>NO = Caution alert. Hold this load.</strong>
        </p>

        <p
          style={{
            marginTop: "14px",
            fontSize: "13px",
            opacity: 0.8,
            textAlign: "center",
          }}
        >
          The AdbS Truck-Driver Verification Link brings the broker/shipper,
          driver, and dock onto the same screen in seconds.
        </p>
      </div>
    </PageShell>
  );
}

/* ---------- JOIN PAGE ---------- */
function Join() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <PageShell>
      <div
        style={{
          width: "780px",
          background: "#020617",
          borderRadius: "18px",
          border: "1px solid rgba(148,163,184,0.55)",
          boxShadow: "0 20px 55px rgba(0,0,0,0.7)",
          padding: "30px 32px 32px",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            marginBottom: "4px",
          }}
        >
          Request Access
        </h1>
        <p
          style={{
            fontSize: "15px",
            marginBottom: "18px",
            opacity: 0.85,
          }}
        >
          For licensed brokers and shippers who want to deploy QueCab AdbS to
          verify Truck-Driver links in front of the dock.
        </p>

        {submitted && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.7)",
              fontSize: "14px",
            }}
          >
            Demo only – your request would be forwarded to QueCab AdbS support
            or your account admin.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 18px",
            }}
          >
            <JoinField label="Legal Name or Legal Business Name *" />
            <JoinField label="Primary Contact Name *" />
            <JoinField label="Role *" placeholder="Broker or Shipper" />
            <JoinField label="MC Number *" placeholder="MC 000000" />
            <JoinField label="EIN (optional)" />
            <JoinField label="Business Phone *" placeholder="123-456-7890" />
            <JoinField label="Business Email *" />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: "20px",
              padding: "14px 26px",
              fontSize: "18px",
              fontWeight: 600,
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background:
                "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        <p
          style={{
            marginTop: "16px",
            fontSize: "13px",
            opacity: 0.8,
          }}
        >
          Demo only – in production this form would create an access request
          record and notify QueCab AdbS support or your account admin.
        </p>
      </div>
    </PageShell>
  );
}

function JoinField({ label, placeholder }) {
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
        placeholder={placeholder}
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

/* ---------- LOGIN PAGE ---------- */
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const normalizedCode = String(accessCode || "").trim().toUpperCase();

    if (normalizedCode === "DEMO123") {
      if (rememberDevice) {
        localStorage.setItem(
          "adbsv1_demoAuth",
          JSON.stringify({
            email,
            ts: Date.now(),
          })
        );
      } else {
        localStorage.removeItem("adbsv1_demoAuth");
      }
      navigate("/control-center");
    } else {
      setError(
        "Demo login failed. Use access code DEMO123 with any business email."
      );
    }
  };

  return (
    <PageShell>
      <div
        style={{
          background: "#020617",
          padding: "40px",
          borderRadius: "18px",
          width: "480px",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.65)",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS Logo"
            style={{
              width: "70px",
              height: "70px",
              objectFit: "contain",
              marginBottom: "8px",
            }}
          />
          <div style={{ fontSize: "12px", opacity: 0.6 }}>LOGIN DEMO</div>
        </div>

        <h1
          style={{
            fontSize: "30px",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Log In
        </h1>
        <p
          style={{
            fontSize: "16px",
            marginBottom: "24px",
            textAlign: "center",
            opacity: 0.85,
          }}
        >
          For authorized brokers and shippers using QueCab AdbS.
        </p>

        {error && (
          <div
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.7)",
              color: "#fecaca",
              padding: "10px 14px",
              borderRadius: "10px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                fontSize: "18px",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Business Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "18px",
                borderRadius: "10px",
                border: "1px solid #64748b",
                background: "#0f172a",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                fontSize: "18px",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Access Code
            </label>
            <input
              type="text"
              required
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "18px",
                borderRadius: "10px",
                border: "1px solid #64748b",
                background: "#0f172a",
                color: "white",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "22px",
              fontSize: "16px",
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              Remember this device
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "18px",
              fontWeight: 600,
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background:
                "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
            }}
          >
            Log In (Demo – use DEMO123)
          </button>
        </form>

        <div
          style={{
            marginTop: "18px",
            fontSize: "13px",
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Demo only – in production this login opens the QueCab AdbS Control
          Center.
        </div>
      </div>
    </PageShell>
  );
}

/* ---------- CONTROL CENTER & VERIFY DRIVER ---------- */

const STORAGE_KEY_PREFIX = "adbsv1_token_";

function generateToken() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 7; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `DEMO-${out}`;
}

function ControlCenter() {
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
      usdDotOnRecord: usdDot.toUpperCase(),
      plateOnRecord: plate.toUpperCase(),
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
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "4px",
          }}
        >
          AdbS Control Center
        </h2>
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
          <CCField label="Load / Reference #" value={loadRef} onChange={setLoadRef} />
          <CCField
            label="Carrier / Legal Name"
            value={carrierName}
            onChange={setCarrierName}
          />
          <CCField
            label="USDOT# on Record"
            value={usdDot}
            onChange={(v) => setUsdDot(v.toUpperCase())}
          />
          <CCField
            label="License Plate on Record"
            value={plate}
            onChange={(v) => setPlate(v.toUpperCase())}
          />
          <CCField
            label="Driver Name (optional)"
            value={driverName}
            onChange={setDriverName}
          />
          <CCField
            label="Driver Phone #"
            value={driverPhone}
            onChange={setDriverPhone}
          />
          <CCField
            label="Send link via email"
            value={sendEmail}
            onChange={setSendEmail}
          />
          <CCField
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

      {/* RIGHT SIDE: ACTIVE LINKS + RECENT CHECKS */}
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

function CCField({ label, value, onChange }) {
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

/* ---------- VERIFY DRIVER PAGE ---------- */

function VerifyDriver() {
  const { token } = useParams();
  const [record, setRecord] = useState(null);
  const [usdDotOnTruck, setUsdDotOnTruck] = useState("");
  const [plateOnTruck, setPlateOnTruck] = useState("");
  const [driverAnswered, setDriverAnswered] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!token) return;
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${token}`);
    if (raw) {
      try {
        setRecord(JSON.parse(raw));
      } catch {
        setRecord(null);
      }
    }
  }, [token]);

  const handleCallDriver = () => {
    window.alert(
      "Demo only – in production this would call the registered driver phone."
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!record) return;

    const usdOk =
      usdDotOnTruck.trim().toUpperCase() ===
      String(record.usdDotOnRecord || "").trim().toUpperCase();
    const plateOk =
      plateOnTruck.trim().toUpperCase() ===
      String(record.plateOnRecord || "").trim().toUpperCase();

    if (driverAnswered === "yes" && usdOk && plateOk) {
      setResult("clear");
    } else {
      setResult("caution");
    }
  };

  if (!record) {
    return (
      <PageShell>
        <div
          style={{
            background: "#020617",
            padding: "30px 32px",
            borderRadius: "16px",
            border: "1px solid rgba(248,113,113,0.7)",
            maxWidth: "540px",
          }}
        >
          <h1 style={{ fontSize: "22px", marginBottom: "8px" }}>
            Truck-Driver Verification
          </h1>
          <p style={{ fontSize: "15px", opacity: 0.85 }}>
            Demo only – this verification link is not associated with a stored
            record. The AdbS ID may have expired or was never created on this
            device.
          </p>
        </div>
      </PageShell>
    );
  }

  const clear = result === "clear";
  const caution = result === "caution";

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        padding: "32px 24px 40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 640px) 320px",
          gap: "24px",
          maxWidth: "1120px",
          width: "100%",
        }}
      >
        {/* LEFT: VERIFICATION */}
        <section
          style={{
            background: "#020617",
            borderRadius: "18px",
            border: "1px solid rgba(148,163,184,0.55)",
            padding: "22px 22px 26px",
          }}
        >
          <h1
            style={{
              fontSize: "22px",
              marginBottom: "4px",
            }}
          >
            Truck-Driver Verification
          </h1>
          <p
            style={{
              fontSize: "13px",
              opacity: 0.8,
              marginBottom: "10px",
            }}
          >
            For authorized dock / check-in personnel only.
            <br />
            AdbS ID: {record.adbSId}
          </p>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px 14px",
                marginBottom: "16px",
              }}
            >
              <VerifyField
                label="USDOT# on Truck"
                value={usdDotOnTruck}
                onChange={(v) => setUsdDotOnTruck(v.toUpperCase())}
              />
              <VerifyField
                label="License Plate on Truck"
                value={plateOnTruck}
                onChange={(v) => setPlateOnTruck(v.toUpperCase())}
              />
            </div>

            <div
              style={{
                marginBottom: "14px",
                fontSize: "15px",
              }}
            >
              <div style={{ marginBottom: "6px" }}>
                DID THE DRIVER ANSWER THEIR REGISTERED PHONE?
              </div>
              <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                <label>
                  <input
                    type="radio"
                    name="driverAnswered"
                    value="yes"
                    checked={driverAnswered === "yes"}
                    onChange={(e) => setDriverAnswered(e.target.value)}
                    style={{ marginRight: "6px" }}
                  />
                  YES
                </label>
                <label>
                  <input
                    type="radio"
                    name="driverAnswered"
                    value="no"
                    checked={driverAnswered === "no"}
                    onChange={(e) => setDriverAnswered(e.target.value)}
                    style={{ marginRight: "6px" }}
                  />
                  NO
                </label>
                <button
                  type="button"
                  onClick={handleCallDriver}
                  style={{
                    marginLeft: "18px",
                    padding: "6px 12px",
                    fontSize: "14px",
                    borderRadius: "999px",
                    border: "1px solid #38bdf8",
                    background: "transparent",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Call Driver (Demo)
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: "8px",
                padding: "12px 20px",
                fontSize: "17px",
                fontWeight: 600,
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                background:
                  "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
              }}
            >
              Run Checks
            </button>
          </form>

          {clear && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "rgba(22,163,74,0.1)",
                border: "1px solid rgba(34,197,94,0.8)",
                fontSize: "15px",
              }}
            >
              <strong>CLEAR TO LOAD</strong>
              <br />
              All checks for this Truck-Driver have cleared. Proceed with
              loading according to your internal procedures.
            </div>
          )}

          {caution && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.9)",
                fontSize: "15px",
              }}
            >
              <strong>CAUTION ALERT – DO NOT LOAD</strong>
              <br />
              One or more checks did not clear. Hold this load and contact your
              broker / shipper immediately for instructions.
            </div>
          )}
        </section>

        {/* RIGHT: DOCK CHECKLIST */}
        <section
          style={{
            background: "#020617",
            borderRadius: "18px",
            border: "1px solid rgba(148,163,184,0.55)",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              marginBottom: "10px",
            }}
          >
            Dock Checklist
          </h2>
          <ol
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              paddingLeft: "20px",
            }}
          >
            <li>Driver remains in cab or waiting area.</li>
            <li>Confirm this is the correct verify screen for the load.</li>
            <li>
              Enter the USDOT and license plate exactly as shown on the truck.
            </li>
            <li>
              Use the “Call Driver” button to reach the registered phone. If
              anything feels off, mark NO.
            </li>
            <li>
              Only when the screen shows CLEAR TO LOAD should this
              Truck-Driver be loaded.
            </li>
          </ol>
          <p
            style={{
              marginTop: "12px",
              fontSize: "12px",
              opacity: 0.75,
            }}
          >
            This demo does not store live data. In production, each decision
            would be logged in the QueCab AdbS Control Center.
          </p>
        </section>
      </div>
    </div>
  );
}

function VerifyField({ label, value, onChange }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "13px",
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
          padding: "9px 10px",
          fontSize: "15px",
          borderRadius: "10px",
          border: "1px solid #64748b",
          background: "#0f172a",
          color: "white",
        }}
      />
    </div>
  );
}

/* ---------- APP SHELL WITH ROUTES ---------- */

export default function App() {
  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #050814 0%, #0b0f19 40%, #131e33 100%)",
          color: "white",
        }}
      >
        {/* TOP NAV BAR */}
        <header
          style={{
            padding: "18px 48px",
            borderBottom: "1px solid rgba(148,163,184,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS Logo"
              style={{ width: "54px", height: "54px", objectFit: "contain" }}
            />
            <span style={{ fontSize: "22px", fontWeight: 700 }}>
              QueCab AdbS
            </span>
          </div>

          <nav
            style={{
              display: "flex",
              gap: "26px",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            <Link to="/" style={navLinkStyle}>
              Home
            </Link>
            <Link to="/how-it-works" style={navLinkStyle}>
              How It Works
            </Link>
            <Link to="/login" style={navLinkStyle}>
              Log In
            </Link>
            <Link to="/join" style={navLinkStyle}>
              Request Access
            </Link>
          </nav>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ padding: "32px 24px 48px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/control-center" element={<ControlCenter />} />
            <Route path="/verify/:token" element={<VerifyDriver />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
