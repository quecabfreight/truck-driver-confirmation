import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function VerifyDriver() {
  const { token } = useParams();

  const [pin, setPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);

  const [usdot, setUsdot] = useState("");
  const [plate, setPlate] = useState("");
  const [phoneResult, setPhoneResult] = useState(""); // YES / NO

  const [expectedUsdot, setExpectedUsdot] = useState("");
  const [expectedPlate, setExpectedPlate] = useState("");

  const [failCount, setFailCount] = useState(0);

  const lastOutcomeRef = useRef(null);

  const DEMO_PIN = "1234";

  // Load expected USDOT + Plate for this token (demo only)
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(`demo_verify_${token}`);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setExpectedUsdot((parsed.usdot || "").toUpperCase());
      setExpectedPlate((parsed.plate || "").toUpperCase());
    } catch {
      // ignore demo errors
    }
  }, [token]);

  // Load existing fail count for this token (demo only)
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(`demo_fail_${token}`);
      const n = parseInt(raw || "0", 10);
      setFailCount(Number.isNaN(n) ? 0 : n);
    } catch {
      // ignore
    }
  }, [token]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === DEMO_PIN) {
      setPinVerified(true);
    } else {
      alert("Incorrect PIN for demo. Use 1234.");
    }
  };

  const normalizedUsdot = usdot.trim().toUpperCase();
  const normalizedPlate = plate.trim().toUpperCase();

  const dotAndPlateEntered = normalizedUsdot && normalizedPlate;
  const systemMatch =
    dotAndPlateEntered &&
    expectedUsdot &&
    expectedPlate &&
    normalizedUsdot === expectedUsdot &&
    normalizedPlate === expectedPlate;

  // We only decide after the phone YES/NO is set.
  const canDecide =
    pinVerified &&
    dotAndPlateEntered &&
    expectedUsdot &&
    expectedPlate &&
    phoneResult;

  // Status box content (what dock actually sees)
  let statusTitle = "";
  let statusDetail = "";
  let statusColor = "#1e293b"; // neutral

  if (canDecide) {
    if (systemMatch && phoneResult === "YES") {
      statusTitle = "CLEAR TO LOAD";
      statusDetail =
        "All checks for this Truck-Driver have cleared. Proceed with loading according to your internal procedures.";
      statusColor = "#047857"; // green
    } else {
      statusTitle = "CAUTION ALERT – DO NOT LOAD";
      statusDetail =
        "One or more checks did not clear. Hold this load and contact the broker / shipper for instructions.";
      statusColor = "#b91c1c"; // red
    }
  }

  // Track failed attempts (CAUTION outcomes) – demo only
  useEffect(() => {
    if (!canDecide) return;

    const outcome =
      systemMatch && phoneResult === "YES" ? "CLEAR" : "CAUTION";

    // Avoid double-counting the same outcome over and over
    if (outcome === lastOutcomeRef.current) return;
    lastOutcomeRef.current = outcome;

    if (outcome === "CAUTION") {
      try {
        if (typeof window === "undefined") return;
        const key = `demo_fail_${token}`;
        const current = parseInt(
          window.localStorage.getItem(key) || "0",
          10
        );
        const next = (Number.isNaN(current) ? 0 : current) + 1;
        window.localStorage.setItem(key, String(next));
        setFailCount(next);
      } catch {
        // ignore
      }
    }
  }, [canDecide, systemMatch, phoneResult, token]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "32px",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {/* LEFT COLUMN – PIN + verification */}
        <div style={{ flex: 2 }}>
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            Truck-Driver Verification
          </h1>
          <p
            style={{
              fontSize: "18px",
              marginBottom: "4px",
              opacity: 0.85,
            }}
          >
            For authorized dock / check-in personnel only.
          </p>
          <p
            style={{
              fontSize: "16px",
              marginBottom: "20px",
              opacity: 0.7,
            }}
          >
            Demo token: <strong>{token}</strong>
          </p>

          {/* PIN GATE */}
          {!pinVerified && (
            <div
              style={{
                background: "#020617",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(148, 163, 184, 0.6)",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "12px",
                }}
              >
                Dock Access PIN
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  marginBottom: "16px",
                  opacity: 0.85,
                }}
              >
                Enter the dock PIN to unlock the verification checks. Demo PIN is{" "}
                <strong>1234</strong>.
              </p>
              <form
                onSubmit={handlePinSubmit}
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={8}
                  style={{
                    fontSize: "22px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #64748b",
                    background: "#020617",
                    color: "white",
                    width: "160px",
                    letterSpacing: "0.25em",
                    textAlign: "center",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    fontSize: "18px",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #0ea5e9, #22c55e, #0ea5e9)",
                    color: "#0b1120",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Unlock
                </button>
              </form>
            </div>
          )}

          {/* MAIN VERIFICATION FORM */}
          {pinVerified && (
            <div
              style={{
                background: "#020617",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(148, 163, 184, 0.6)",
              }}
            >
              {/* Truck identifiers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "16px",
                      marginBottom: "6px",
                    }}
                  >
                    USDOT# on Truck
                  </label>
                  <input
                    type="text"
                    value={usdot}
                    onChange={(e) =>
                      setUsdot(e.target.value.toUpperCase())
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "18px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#020617",
                      color: "white",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "16px",
                      marginBottom: "6px",
                    }}
                  >
                    License Plate on Truck
                  </label>
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) =>
                      setPlate(e.target.value.toUpperCase())
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "18px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#020617",
                      color: "white",
                    }}
                  />
                </div>
              </div>

              {/* Phone check – Call button then YES/NO */}
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    fontSize: "18px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  DID THE DRIVER ANSWER THEIR REGISTERED PHONE?
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "18px",
                    alignItems: "center",
                    fontSize: "18px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Demo only: in production this would call the registered driver phone."
                      )
                    }
                    style={{
                      fontSize: "16px",
                      padding: "8px 14px",
                      borderRadius: "999px",
                      border: "1px solid #38bdf8",
                      background: "transparent",
                      color: "#e5e7eb",
                      cursor: "pointer",
                    }}
                  >
                    Call Driver (Demo)
                  </button>

                  <label>
                    <input
                      type="radio"
                      name="phoneResult"
                      value="YES"
                      checked={phoneResult === "YES"}
                      onChange={(e) => setPhoneResult(e.target.value)}
                      style={{ marginRight: "6px", marginLeft: "6px" }}
                    />
                    YES
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="phoneResult"
                      value="NO"
                      checked={phoneResult === "NO"}
                      onChange={(e) => setPhoneResult(e.target.value)}
                      style={{ marginRight: "6px" }}
                    />
                    NO
                  </label>
                </div>
              </div>

              {/* STATUS BOX – only shows final result, not which check failed */}
              <div
                style={{
                  borderRadius: "14px",
                  padding: "18px 20px",
                  background: statusColor,
                  minHeight: "76px",
                }}
              >
                {statusTitle ? (
                  <>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        marginBottom: "6px",
                      }}
                    >
                      {statusTitle}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        opacity: 0.95,
                      }}
                    >
                      {statusDetail}
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      fontSize: "16px",
                      opacity: 0.85,
                    }}
                  >
                    Enter the USDOT# and plate from the truck, call the
                    registered driver, then record YES or NO. The system
                    will determine whether this Truck-Driver is CLEAR TO
                    LOAD or requires a CAUTION ALERT.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN – Dock Checklist / demo note */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: "#020617",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(148, 163, 184, 0.6)",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                marginBottom: "12px",
              }}
            >
              Dock Checklist
            </h2>
            <ol
              style={{
                fontSize: "16px",
                lineHeight: 1.6,
                paddingLeft: "20px",
                marginBottom: "16px",
              }}
            >
              <li>Driver remains in cab or waiting area.</li>
              <li>
                Confirm this is the correct verify screen for the load you
                are checking in.
              </li>
              <li>
                Enter the USDOT# and license plate exactly as shown on the
                truck.
              </li>
              <li>
                Use the “Call Driver” button to reach the registered phone.
                If anything feels off, mark NO.
              </li>
              <li>
                Only when this screen shows CLEAR TO LOAD should this
                Truck-Driver be loaded.
              </li>
            </ol>
            <div
              style={{
                fontSize: "14px",
                opacity: 0.85,
                borderTop: "1px solid rgba(148,163,184,0.4)",
                paddingTop: "10px",
                marginTop: "8px",
              }}
            >
              In production, multiple failed verification attempts for the
              same load quietly alert the broker / shipper for follow-up.
            </div>
            {failCount >= 3 && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "#fca5a5",
                }}
              >
                Demo note: you&apos;ve reached 3 CAUTION results for this
                demo link. In the live system, this would have triggered an
                alert to the broker / shipper.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
