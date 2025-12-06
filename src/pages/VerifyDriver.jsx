import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const STORAGE_KEY_PREFIX = "adbsv1_token_";
const ATTEMPT_PREFIX = "adbsv1_attempts_";

export default function VerifyDriver() {
  const { token } = useParams();

  const [adbSId, setAdbSId] = useState(token || "");
  const [recordUsdDot, setRecordUsdDot] = useState("");
  const [recordPlate, setRecordPlate] = useState("");

  const [usdDotOnTruck, setUsdDotOnTruck] = useState("");
  const [plateOnTruck, setPlateOnTruck] = useState("");
  const [driverAnswer, setDriverAnswer] = useState("yes"); // yes | no
  const [result, setResult] = useState(null); // "clear" | "caution" | null
  const [escalated, setEscalated] = useState(false);

  useEffect(() => {
    if (!token) return;

    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${token}`);
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      setAdbSId(data.adbSId || token);
      setRecordUsdDot(data.usdDotOnRecord || "");
      setRecordPlate(data.plateOnRecord || "");
      setUsdDotOnTruck(data.usdDotOnRecord || "");
      setPlateOnTruck(data.plateOnRecord || "");
    } catch {
      // ignore
    }
  }, [token]);

  const handleRunChecks = () => {
    setResult(null);

    const norm = (v) => String(v || "").trim().toUpperCase();
    const hasRecord = recordUsdDot || recordPlate;

    const systemMatch = hasRecord
      ? norm(usdDotOnTruck) === norm(recordUsdDot) &&
        norm(plateOnTruck) === norm(recordPlate)
      : true; // if no record in demo, don't block

    const phoneYes = driverAnswer === "yes";

    // Your rule: CLEAR only if systemMatch AND phoneYes.
    // Any miss (including NO on phone) = CAUTION.
    if (systemMatch && phoneYes) {
      setResult("clear");
    } else {
      setResult("caution");

      if (token) {
        const key = `${ATTEMPT_PREFIX}${token}`;
        const raw = localStorage.getItem(key) || "0";
        const n = Number(raw) || 0;
        const next = n + 1;
        localStorage.setItem(key, String(next));
        if (next >= 3) {
          setEscalated(true);
        }
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        minHeight: "calc(100vh - 120px)",
      }}
    >
      {/* LEFT: VERIFICATION PANEL */}
      <section
        style={{
          flex: 1.1,
          background: "#020617",
          borderRadius: "18px",
          padding: "24px 24px 28px",
          border: "1px solid rgba(148,163,184,0.4)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
          color: "white",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS Logo"
            style={{
              width: "64px",
              height: "64px",
              objectFit: "contain",
              marginBottom: "6px",
            }}
          />
        </div>

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
            fontSize: "14px",
            opacity: 0.8,
            marginBottom: "10px",
          }}
        >
          For authorized dock / check-in personnel only.
        </p>
        <div
          style={{
            fontSize: "13px",
            opacity: 0.85,
            marginBottom: "16px",
          }}
        >
          <strong>AdbS ID:</strong> {adbSId}
        </div>

        {/* INPUTS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 16px",
            marginBottom: "18px",
          }}
        >
          <Field
            label="USDOT# on Truck"
            value={usdDotOnTruck}
            onChange={(v) => setUsdDotOnTruck(v.toUpperCase())}
          />
          <Field
            label="License Plate on Truck"
            value={plateOnTruck}
            onChange={(v) => setPlateOnTruck(v.toUpperCase())}
          />
        </div>

        {/* DID DRIVER ANSWER REGISTERED PHONE? */}
        <div
          style={{
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          <div style={{ marginBottom: "6px" }}>
            DID THE DRIVER ANSWER THEIR REGISTERED PHONE?
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <label>
              <input
                type="radio"
                name="driverAnswer"
                value="yes"
                checked={driverAnswer === "yes"}
                onChange={() => setDriverAnswer("yes")}
                style={{ marginRight: "6px" }}
              />
              YES
            </label>
            <label>
              <input
                type="radio"
                name="driverAnswer"
                value="no"
                checked={driverAnswer === "no"}
                onChange={() => setDriverAnswer("no")}
                style={{ marginRight: "6px" }}
              />
              NO
            </label>

            <button
              type="button"
              style={{
                marginLeft: "10px",
                padding: "6px 14px",
                fontSize: "13px",
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

        {/* RUN CHECKS BUTTON */}
        <button
          type="button"
          onClick={handleRunChecks}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: 600,
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background:
              "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
            marginBottom: "16px",
          }}
        >
          Run Checks
        </button>

        {/* RESULT BANNERS */}
        {result === "clear" && (
          <div
            style={{
              marginTop: "4px",
              padding: "16px 18px",
              borderRadius: "14px",
              background: "rgba(22,163,74,0.18)",
              border: "1px solid rgba(22,163,74,0.9)",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "6px",
                color: "#4ade80",
              }}
            >
              CLEAR TO LOAD
            </div>
            <div
              style={{
                fontSize: "14px",
                opacity: 0.9,
              }}
            >
              All checks for this Truck-Driver have cleared. Proceed with loading
              according to your internal procedures.
            </div>
          </div>
        )}

        {result === "caution" && (
          <div
            style={{
              marginTop: "4px",
              padding: "16px 18px",
              borderRadius: "14px",
              background: "rgba(239,68,68,0.18)",
              border: "1px solid rgba(239,68,68,0.95)",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "6px",
                color: "#fecaca",
              }}
            >
              CAUTION ALERT – DO NOT LOAD
            </div>
            <div
              style={{
                fontSize: "14px",
                opacity: 0.95,
              }}
            >
              One or more checks did not clear. Hold this load and contact your
              broker / shipper immediately for instructions.
            </div>
            {escalated && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  opacity: 0.8,
                }}
              >
                Demo note: three or more failed attempts – in production this
                would quietly alert the broker/shipper.
              </div>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: "16px",
            fontSize: "12px",
            opacity: 0.7,
          }}
        >
          This demo does not store live data. In production, each decision would
          be logged in the QueCab AdbS control center.
        </div>
      </section>

      {/* RIGHT: DOCK CHECKLIST */}
      <section
        style={{
          flex: 0.9,
          background: "#020617",
          borderRadius: "18px",
          padding: "24px 24px 28px",
          border: "1px solid rgba(148,163,184,0.4)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
          color: "white",
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
            paddingLeft: "18px",
            marginBottom: "18px",
          }}
        >
          <li>Driver remains in cab or waiting area.</li>
          <li>
            Confirm this is the correct verify screen for the load you are
            checking in.
          </li>
          <li>
            Enter the USDOT and license plate exactly as shown on the truck.
          </li>
          <li>
            Use the &quot;Call Driver&quot; button to reach the registered
            phone. If anything feels off, mark NO.
          </li>
          <li>
            Only when this screen shows CLEAR TO LOAD should this Truck-Driver
            be loaded.
          </li>
        </ol>

        <p
          style={{
            fontSize: "12px",
            opacity: 0.75,
          }}
        >
          This demo does not store live data. In production, each decision would
          be logged in the QueCab AdbS control center.
        </p>
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
