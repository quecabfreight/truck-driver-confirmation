import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const STORAGE_KEY_PREFIX = "adbsv1_token_";
const ATTEMPT_PREFIX = "adbsv1_attempts_";

export default function VerifyDriver() {
  const { token } = useParams();

  const [record, setRecord] = useState(null);
  const [usdDotOnTruck, setUsdDotOnTruck] = useState("");
  const [plateOnTruck, setPlateOnTruck] = useState("");
  const [driverAnswered, setDriverAnswered] = useState(null); // "YES" | "NO" | null
  const [status, setStatus] = useState("idle"); // "idle" | "clear" | "caution"
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!token) return;

    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${token}`);
    if (!raw) {
      setRecord(null);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setRecord(parsed);
      // Prefill truck fields with what’s on record (demo convenience)
      setUsdDotOnTruck(parsed.usdDotOnRecord || "");
      setPlateOnTruck(parsed.plateOnRecord || "");
    } catch {
      setRecord(null);
    }

    const rawAttempts = localStorage.getItem(`${ATTEMPT_PREFIX}${token}`);
    if (rawAttempts) {
      const n = parseInt(rawAttempts, 10);
      if (!isNaN(n)) setAttempts(n);
    }
  }, [token]);

  if (!record) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div
          style={{
            background: "#020617",
            padding: "28px 32px",
            borderRadius: "16px",
            border: "1px solid rgba(148,163,184,0.5)",
            maxWidth: "520px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
            Truck-Driver Verification
          </h1>
          <p style={{ fontSize: "15px", opacity: 0.9 }}>
            This demo link is not currently active. In production, this message
            would show if the AdbS Truck-Driver Verification Link expired or
            was revoked by the broker / shipper.
          </p>
        </div>
      </div>
    );
  }

  const handleCallDriver = () => {
    alert("Demo only – in production this would call the registered driver phone.");
  };

  const handleRunChecks = () => {
    // Normalize for case / spacing
    const normalize = (val) => String(val || "").trim().toUpperCase();

    const usdTruck = normalize(usdDotOnTruck);
    const plateTruck = normalize(plateOnTruck);
    const usdRecord = normalize(record.usdDotOnRecord);
    const plateRecord = normalize(record.plateOnRecord);

    const usdMatches = usdTruck !== "" && usdTruck === usdRecord;
    const plateMatches = plateTruck !== "" && plateTruck === plateRecord;
    const phoneOK = driverAnswered === "YES";

    const allGood = usdMatches && plateMatches && phoneOK;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    localStorage.setItem(`${ATTEMPT_PREFIX}${token}`, String(nextAttempts));

    if (allGood) {
      setStatus("clear");
    } else {
      setStatus("caution");
    }
  };

  // Status panel styles
  let statusTitle = "Waiting for checks…";
  let statusDetail =
    "Enter USDOT and plate from the truck, run checks after calling the driver.";
  let statusStyle = {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(148,163,184,0.7)",
  };

  if (status === "clear") {
    statusTitle = "CLEAR TO LOAD";
    statusDetail =
      "USDOT#, plate, and driver phone all matched the broker / shipper record.";
    statusStyle = {
      background: "#16a34a",
      border: "1px solid #22c55e",
    };
  } else if (status === "caution") {
    statusTitle = "CAUTION ALERT – DO NOT LOAD";
    statusDetail =
      "One or more checks did not clear. Hold this load and contact your broker / shipper immediately for instructions.";
    statusStyle = {
      background: "#b91c1c",
      border: "1px solid #f97373",
    };
  }

  const extraNotice =
    attempts >= 3
      ? "Demo note: multiple failed attempts – in production this would quietly alert the broker / shipper."
      : "";

  return (
    <div
      style={{
        padding: "32px 40px 48px",
        display: "flex",
        gap: "24px",
        color: "white",
      }}
    >
      {/* LEFT: MAIN VERIFY PANEL */}
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
            fontSize: "24px",
            marginBottom: "4px",
          }}
        >
          Truck-Driver Verification
        </h1>
        <p
          style={{
            fontSize: "14px",
            opacity: 0.85,
            marginBottom: "10px",
          }}
        >
          For authorized dock / check-in personnel only.
          <br />
          AdbS ID: {token}
        </p>

        {/* FIELDS */}
        <div
          style={{
            marginTop: "14px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px 18px",
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
                padding: "10px 11px",
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
                padding: "10px 11px",
                fontSize: "16px",
                borderRadius: "10px",
                border: "1px solid #64748b",
                background: "#0f172a",
                color: "white",
              }}
            />
          </div>
        </div>

        {/* PHONE CHECK ROW */}
        <div
          style={{
            marginTop: "18px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "14px 18px",
          }}
        >
          <button
            type="button"
            onClick={handleCallDriver}
            style={{
              padding: "10px 20px",
              borderRadius: "999px",
              border: "1px solid #38bdf8",
              background: "transparent",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Call Driver (Demo)
          </button>

          <div style={{ fontSize: "15px" }}>
            DID THE DRIVER ANSWER THEIR REGISTERED PHONE?
            <label style={{ marginLeft: "14px", marginRight: "10px" }}>
              <input
                type="radio"
                name="driverAnswered"
                value="YES"
                checked={driverAnswered === "YES"}
                onChange={() => setDriverAnswered("YES")}
                style={{ marginRight: "4px" }}
              />
              YES
            </label>
            <label>
              <input
                type="radio"
                name="driverAnswered"
                value="NO"
                checked={driverAnswered === "NO"}
                onChange={() => setDriverAnswered("NO")}
                style={{ marginRight: "4px" }}
              />
              NO
            </label>
          </div>
        </div>

        {/* RUN CHECKS BUTTON */}
        <div style={{ marginTop: "18px" }}>
          <button
            type="button"
            onClick={handleRunChecks}
            style={{
              padding: "12px 32px",
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
        </div>

        {/* STATUS PANEL – BIG GREEN/RED BAR */}
        <div
          style={{
            marginTop: "20px",
            padding: "16px 18px",
            borderRadius: "14px",
            ...statusStyle,
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            {statusTitle}
          </div>
          <div style={{ fontSize: "14px" }}>{statusDetail}</div>
          {extraNotice && (
            <div
              style={{
                marginTop: "6px",
                fontSize: "12px",
                opacity: 0.9,
              }}
            >
              {extraNotice}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "10px",
            fontSize: "12px",
            opacity: 0.75,
          }}
        >
          This demo does not store live data. In production, each decision would
          be logged in the QueCab AdbS Control Center.
        </div>
      </section>

      {/* RIGHT: DOCK CHECKLIST */}
      <section
        style={{
          flex: 0.9,
          background: "#020617",
          borderRadius: "18px",
          padding: "22px 22px 24px",
          border: "1px solid rgba(148,163,184,0.4)",
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
          <li>
            Enter the USDOT# and license plate exactly as shown on the truck.
          </li>
          <li>
            Use the “Call Driver” button to reach the registered phone. If
            anything feels off, mark NO.
          </li>
          <li>
            Only when this screen shows CLEAR TO LOAD should this Truck-Driver
            be loaded.
          </li>
        </ol>

        <p
          style={{
            fontSize: "12px",
            opacity: 0.8,
          }}
        >
          This demo does not store live data. In production, each decision would
          be logged in the QueCab AdbS Control Center for audit and lane
          monitoring.
        </p>
      </section>
    </div>
  );
}
