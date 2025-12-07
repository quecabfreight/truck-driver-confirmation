import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const STORAGE_KEY_PREFIX = "adbsv1_token_";

function normalize(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

export default function VerifyDriver() {
  const { token } = useParams();
  const [record, setRecord] = useState(null);

  const [usdDotOnTruck, setUsdDotOnTruck] = useState("");
  const [plateOnTruck, setPlateOnTruck] = useState("");
  const [driverAnswer, setDriverAnswer] = useState(""); // "YES" | "NO" | ""

  const [result, setResult] = useState("idle"); // "idle" | "clear" | "caution"
  const [resultText, setResultText] = useState("");
  const [attempts, setAttempts] = useState(0);

  // Load record from localStorage
  useEffect(() => {
    if (!token) return;
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${token}`);
      if (!raw) {
        setRecord(null);
        return;
      }
      const parsed = JSON.parse(raw);
      setRecord(parsed);
    } catch {
      setRecord(null);
    }
  }, [token]);

  // Load attempt count
  useEffect(() => {
    if (!token) return;
    const attemptKey = `adbsv1_attempts_${token}`;
    try {
      const val = parseInt(localStorage.getItem(attemptKey) || "0", 10);
      if (!Number.isNaN(val)) setAttempts(val);
    } catch {
      // ignore
    }
  }, [token]);

  const runChecks = () => {
    if (!record) {
      setResult("caution");
      setResultText(
        "This Truck-Driver verification link is invalid or expired. Hold this load and contact your broker / shipper for instructions."
      );
      return;
    }

    const dotMatches =
      normalize(usdDotOnTruck) === normalize(record.usdDotOnRecord);
    const plateMatches =
      normalize(plateOnTruck) === normalize(record.plateOnRecord);
    const driverYes = driverAnswer === "YES";

    const allClear = dotMatches && plateMatches && driverYes;

    if (allClear) {
      setResult("clear");
      setResultText(
        "All checks for this Truck-Driver have cleared. Proceed with loading according to your internal procedures."
      );
    } else {
      setResult("caution");
      setResultText(
        "One or more checks did not clear. Hold this load and contact your broker / shipper immediately for instructions."
      );

      // Track failed attempts (demo only)
      if (token) {
        const attemptKey = `adbsv1_attempts_${token}`;
        const next = attempts + 1;
        setAttempts(next);
        try {
          localStorage.setItem(attemptKey, String(next));
        } catch {
          // ignore
        }
      }
    }
  };

  const showEscalationHint = result === "caution" && attempts >= 3;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(520px, 620px) 360px",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT: VERIFICATION FORM */}
        <section
          style={{
            background: "#020617",
            borderRadius: "20px",
            padding: "24px 26px 26px",
            border: "1px solid rgba(148,163,184,0.6)",
            boxShadow: "0 20px 55px rgba(0,0,0,0.75)",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              marginBottom: "4px",
            }}
          >
            Truck-Driver Verification
          </h1>
          <p
            style={{
              fontSize: "14px",
              opacity: 0.9,
              marginBottom: "10px",
            }}
          >
            For authorized dock / check-in personnel only.
          </p>
          {record && (
            <p
              style={{
                fontSize: "13px",
                opacity: 0.8,
                marginBottom: "16px",
              }}
            >
              <strong>AdbS ID:</strong> {record.adbSId}
            </p>
          )}

          {/* INPUTS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 18px",
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
                onChange={(e) => setUsdDotOnTruck(e.target.value.toUpperCase())}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
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
                onChange={(e) => setPlateOnTruck(e.target.value.toUpperCase())}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* DRIVER ANSWER RADIO */}
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              DID THE DRIVER ANSWER THEIR REGISTERED PHONE?
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                fontSize: "15px",
              }}
            >
              <label>
                <input
                  type="radio"
                  name="driverAnswer"
                  value="YES"
                  checked={driverAnswer === "YES"}
                  onChange={() => setDriverAnswer("YES")}
                  style={{ marginRight: "6px" }}
                />
                YES
              </label>
              <label>
                <input
                  type="radio"
                  name="driverAnswer"
                  value="NO"
                  checked={driverAnswer === "NO"}
                  onChange={() => setDriverAnswer("NO")}
                  style={{ marginRight: "6px" }}
                />
                NO
              </label>
            </div>
          </div>

          {/* CALL DRIVER BUTTON (DEMO) */}
          <div style={{ marginBottom: "18px" }}>
            <button
              type="button"
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "1px solid #38bdf8",
                background: "transparent",
                color: "white",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (!record || !record.driverPhone) return;
                // Demo only – in production this would be locked to authorized devices.
                window.open(`tel:${record.driverPhone}`, "_self");
              }}
            >
              Call Driver (Demo)
            </button>
          </div>

          {/* RUN CHECKS BUTTON */}
          <button
            type="button"
            onClick={runChecks}
            style={{
              padding: "12px 26px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: 600,
              background:
                "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
            }}
          >
            Run Checks
          </button>

          {/* RESULT BANNER */}
          {result !== "idle" && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "14px",
                border:
                  result === "clear"
                    ? "1px solid rgba(74,222,128,0.8)"
                    : "1px solid rgba(248,113,113,0.9)",
                background:
                  result === "clear"
                    ? "rgba(22,163,74,0.18)"
                    : "rgba(220,38,38,0.18)",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "4px",
                  color: result === "clear" ? "#bbf7d0" : "#fecaca",
                }}
              >
                {result === "clear"
                  ? "CLEAR TO LOAD"
                  : "CAUTION ALERT – DO NOT LOAD"}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "white",
                }}
              >
                {resultText}
              </div>
              {showEscalationHint && (
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "12px",
                    opacity: 0.85,
                    color: "#fecaca",
                  }}
                >
                  Demo note – in production, repeated CAUTION results for the
                  same load would quietly alert the broker / shipper for
                  follow-up.
                </div>
              )}
            </div>
          )}

          {!record && (
            <div
              style={{
                marginTop: "16px",
                fontSize: "13px",
                opacity: 0.85,
              }}
            >
              Demo note – no AdbS record was found for this link. In production
              this would be treated as a high-risk CAUTION.
            </div>
          )}
        </section>

        {/* RIGHT: DOCK CHECKLIST */}
        <section
          style={{
            background: "#020617",
            borderRadius: "20px",
            padding: "22px 22px 24px",
            border: "1px solid rgba(148,163,184,0.6)",
            boxShadow: "0 20px 55px rgba(0,0,0,0.75)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "10px",
            }}
          >
            Dock Checklist
          </h2>
          <ol
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              marginLeft: "18px",
              marginBottom: "18px",
            }}
          >
            <li>Driver remains in cab or waiting area.</li>
            <li>Confirm this is the correct verify screen for the load.</li>
            <li>
              Enter the USDOT# and license plate exactly as shown on the truck.
            </li>
            <li>
              Use the “Call Driver” button to reach the registered phone. If
              anything feels off, mark NO.
            </li>
            <li>
              Only when this screen shows CLEAR TO LOAD should this
              Truck-Driver be loaded.
            </li>
          </ol>
          <p
            style={{
              fontSize: "12px",
              opacity: 0.8,
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
