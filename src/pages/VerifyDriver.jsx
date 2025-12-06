import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const STORAGE_KEY_PREFIX = "adbsv1_token_";

export default function VerifyDriver() {
  const { token } = useParams();
  const [record, setRecord] = useState(null);
  const [usdDotOnTruck, setUsdDotOnTruck] = useState("");
  const [plateOnTruck, setPlateOnTruck] = useState("");
  const [driverAnswered, setDriverAnswered] = useState("");
  const [result, setResult] = useState(null); // "clear" | "caution" | null

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

    // System quietly compares, but only the final result is obvious.
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
      <div
        style={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
        }}
      >
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
      </div>
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

          {/* RESULT PANEL */}
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
              All checks for this Truck-Driver have cleared. Proceed with loading
              according to your internal procedures.
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
            <li>Enter the USDOT and license plate exactly as shown on the truck.</li>
            <li>
              Use the “Call Driver” button to reach the registered phone. If
              anything feels off, mark NO.
            </li>
            <li>
              Only when the screen shows CLEAR TO LOAD should this Truck-Driver
              be loaded.
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
