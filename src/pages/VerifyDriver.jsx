import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const STORAGE_KEY_PREFIX = "adbsv1_token_";
const AUDIT_KEY = "adbsv1_audit_log";

function upperTrim(v) {
  return String(v || "").toUpperCase().trim();
}

function logAudit(token, payload, outcome) {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({
      token,
      adbSId: payload.adbSId || token,
      loadRef: payload.loadRef || "",
      carrierName: payload.carrierName || "",
      outcome,
      timestamp: Date.now(),
    });
    const trimmed = arr.slice(-10);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(trimmed));
  } catch {
    // demo only
  }
}

export default function VerifyDriver() {
  const { token } = useParams();
  const [record, setRecord] = useState(null);
  const [loadError, setLoadError] = useState("");

  const [usdDotOnTruck, setUsdDotOnTruck] = useState("");
  const [plateOnTruck, setPlateOnTruck] = useState("");
  const [driverAnswered, setDriverAnswered] = useState("");
  const [resultStatus, setResultStatus] = useState(null); // "CLEAR" | "NOT_CLEARED" | "REVOKED" | "INVALID"
  const [resultNote, setResultNote] = useState("");

  useEffect(() => {
    if (!token) {
      setLoadError("Invalid verification link.");
      setResultStatus("INVALID");
      return;
    }

    const key = `${STORAGE_KEY_PREFIX}${token}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      setLoadError("This verification link is not recognized or has expired (demo).");
      setResultStatus("INVALID");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setRecord(parsed);
    } catch {
      setLoadError("Unable to read verification data (demo).");
      setResultStatus("INVALID");
    }
  }, [token]);

  const handleRunChecks = () => {
    if (!record) {
      setResultStatus("INVALID");
      setResultNote(
        "This verification link is not recognized. Contact your broker / shipper."
      );
      return;
    }

    const key = `${STORAGE_KEY_PREFIX}${token}`;

    // If revoked, it's automatically NOT CLEARED
    if (record.revoked) {
      setResultStatus("REVOKED");
      setResultNote(
        "This AdbS link was revoked by the broker / shipper. Hold this load."
      );

      // Log audit + bump failedAttempts
      try {
        logAudit(token, record, "NOT_CLEARED");
        const updated = { ...record, failedAttempts: (record.failedAttempts || 0) + 1 };
        localStorage.setItem(key, JSON.stringify(updated));
        setRecord(updated);
      } catch {
        // demo only
      }
      return;
    }

    const dotMatches =
      upperTrim(usdDotOnTruck) === upperTrim(record.usdDotOnRecord);
    const plateMatches =
      upperTrim(plateOnTruck) === upperTrim(record.plateOnRecord);
    const answeredYes = driverAnswered === "YES";

    const allGood = dotMatches && plateMatches && answeredYes;

    if (allGood) {
      setResultStatus("CLEAR");
      setResultNote(
        "All checks for this Truck-Driver have cleared. Proceed with loading according to your internal procedures."
      );
      try {
        logAudit(token, record, "CLEAR");
      } catch {
        // demo only
      }
    } else {
      setResultStatus("NOT_CLEARED");
      setResultNote(
        "One or more checks did not clear. Hold this load and contact your broker / shipper immediately for instructions."
      );
      try {
        logAudit(token, record, "NOT_CLEARED");
        const updated = { ...record, failedAttempts: (record.failedAttempts || 0) + 1 };
        localStorage.setItem(key, JSON.stringify(updated));
        setRecord(updated);
      } catch {
        // demo only
      }
    }
  };

  const disabled = !record || resultStatus === "INVALID";

  return (
    <div
      style={{
        padding: "32px 40px 48px",
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >
      {/* LEFT: VERIFICATION PANEL */}
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
            opacity: 0.85,
            marginBottom: "6px",
          }}
        >
          For authorized dock / check-in personnel only.
        </p>
        {record && (
          <p
            style={{
              fontSize: "12px",
              opacity: 0.85,
              marginBottom: "18px",
            }}
          >
            AdbS ID: <strong>{record.adbSId || token}</strong>
          </p>
        )}

        {loadError && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(127,29,29,0.9)",
              border: "1px solid rgba(248,113,113,0.9)",
              fontSize: "13px",
              color: "#fee2e2",
            }}
          >
            {loadError}
          </div>
        )}

        {/* INPUTS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 16px",
            marginBottom: "18px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              USDOT# on Truck
            </label>
            <input
              value={usdDotOnTruck}
              onChange={(e) =>
                setUsdDotOnTruck(upperTrim(e.target.value))
              }
              style={{
                width: "100%",
                padding: "10px 11px",
                fontSize: "16px",
                borderRadius: "10px",
                border: "1px solid #64748b",
                background: "#0f172a",
                color: "white",
              }}
              disabled={disabled}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              License Plate on Truck
            </label>
            <input
              value={plateOnTruck}
              onChange={(e) =>
                setPlateOnTruck(upperTrim(e.target.value))
              }
              style={{
                width: "100%",
                padding: "10px 11px",
                fontSize: "16px",
                borderRadius: "10px",
                border: "1px solid #64748b",
                background: "#0f172a",
                color: "white",
              }}
              disabled={disabled}
            />
          </div>
        </div>

        {/* DRIVER ANSWERED PHONE */}
        <div
          style={{
            marginBottom: "14px",
            fontSize: "14px",
          }}
        >
          <div style={{ marginBottom: "4px" }}>
            DID THE DRIVER ANSWER THEIR REGISTERED PHONE?
          </div>
          <label style={{ marginRight: "16px" }}>
            <input
              type="radio"
              value="YES"
              checked={driverAnswered === "YES"}
              onChange={(e) => setDriverAnswered(e.target.value)}
              disabled={disabled}
              style={{ marginRight: "4px" }}
            />
            YES
          </label>
          <label>
            <input
              type="radio"
              value="NO"
              checked={driverAnswered === "NO"}
              onChange={(e) => setDriverAnswered(e.target.value)}
              disabled={disabled}
              style={{ marginRight: "4px" }}
            />
            NO
          </label>
        </div>

        {/* CALL DRIVER DEMO BUTTON */}
        <div style={{ marginBottom: "18px" }}>
          <button
            type="button"
            onClick={() => {
              if (!record) return;
              alert(
                "Demo only – in production this would dial the registered phone on file for the carrier."
              );
            }}
            disabled={disabled}
            style={{
              padding: "8px 18px",
              fontSize: "14px",
              borderRadius: "999px",
              border: "1px solid #38bdf8",
              background: "transparent",
              color: "white",
              cursor: disabled ? "default" : "pointer",
            }}
          >
            Call Driver (Demo)
          </button>
        </div>

        {/* RUN CHECKS BUTTON */}
        <button
          type="button"
          onClick={handleRunChecks}
          disabled={disabled}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: 600,
            borderRadius: "999px",
            border: "none",
            cursor: disabled ? "default" : "pointer",
            background: disabled
              ? "rgba(148,163,184,0.4)"
              : "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
            marginBottom: "18px",
          }}
        >
          Run Checks
        </button>

        {/* RESULT PANEL */}
        {resultStatus && (
          <div
            style={{
              marginTop: "4px",
              padding: "14px 16px",
              borderRadius: "14px",
              background:
                resultStatus === "CLEAR"
                  ? "#14532d"
                  : "#7f1d1d",
              border:
                resultStatus === "CLEAR"
                  ? "1px solid #4ade80"
                  : "1px solid #fecaca",
              color:
                resultStatus === "CLEAR" ? "#dcfce7" : "#fee2e2",
              fontSize: "14px",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "16px",
                marginBottom: "6px",
                textAlign: "center",
              }}
            >
              {resultStatus === "CLEAR"
                ? "CLEAR TO LOAD"
                : "NOT CLEARED TO LOAD — HOLD LOAD"}
            </div>
            <div>{resultNote}</div>
          </div>
        )}
      </section>

      {/* RIGHT: DOCK CHECKLIST */}
      <section
        style={{
          flex: 0.8,
          background: "#020617",
          borderRadius: "18px",
          padding: "24px 22px 24px",
          border: "1px solid rgba(148,163,184,0.4)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
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
            paddingLeft: "18px",
            marginBottom: "16px",
          }}
        >
          <li>Driver remains in cab or waiting area.</li>
          <li>
            Confirm this is the correct verify screen for the load you are
            checking in.
          </li>
          <li>Enter the USDOT and license plate exactly as shown on the truck.</li>
          <li>
            Use the “Call Driver” button to reach the registered phone. If
            anything feels off, mark NO.
          </li>
          <li>
            Only when the system returns CLEAR TO LOAD should this
            Truck-Driver be loaded.
          </li>
        </ol>

        <p
          style={{
            fontSize: "12px",
            opacity: 0.8,
          }}
        >
          This demo does not store live data. In production, each decision would
          be logged in the QueCab AdbS Control Center for lane-by-lane
          oversight.
        </p>
      </section>
    </div>
  );
}
