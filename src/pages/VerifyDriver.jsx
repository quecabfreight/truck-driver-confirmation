import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const STORAGE_KEY_PREFIX = "adbsv1_token_";
const DEMO_PIN = "1234";

export default function VerifyDriver() {
  const { token } = useParams();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pin, setPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);

  const [usdotOnTruck, setUsdotOnTruck] = useState("");
  const [plateOnTruck, setPlateOnTruck] = useState("");
  const [driverAnswered, setDriverAnswered] = useState(""); // "YES" or "NO"

  const [statusMode, setStatusMode] = useState("idle"); // "idle" | "clear" | "not_clear"

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${token}`);
      if (!raw) {
        setRecord(null);
      } else {
        const parsed = JSON.parse(raw);
        setRecord(parsed);
      }
    } catch {
      setRecord(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const normalize = (val) => String(val || "").trim().toUpperCase();

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === DEMO_PIN) {
      setPinVerified(true);
    } else {
      alert("Incorrect PIN for demo. Use 1234.");
    }
  };

  const computeStatus = (dotVal, plateVal, driverAns) => {
    if (!record || record.revoked) {
      setStatusMode("not_clear");
      return;
    }

    const dotNorm = normalize(dotVal);
    const plateNorm = normalize(plateVal);

    const dotMatches =
      dotNorm.length > 0 && dotNorm === normalize(record.usdDotOnRecord);
    const plateMatches =
      plateNorm.length > 0 && plateNorm === normalize(record.plateOnRecord);

    if (dotMatches && plateMatches && driverAns === "YES") {
      setStatusMode("clear");
    } else if (driverAns === "YES" || driverAns === "NO") {
      // Any failed condition → NOT CLEARED
      setStatusMode("not_clear");

      // Quietly bump failed attempts count for this token (demo-only)
      try {
        const key = `${STORAGE_KEY_PREFIX}${token}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          const fails = (parsed.failedAttempts || 0) + 1;
          parsed.failedAttempts = fails;
          localStorage.setItem(key, JSON.stringify(parsed));
        }
      } catch {
        // ignore demo errors
      }
    } else {
      setStatusMode("idle");
    }
  };

  const handleUsdotChange = (value) => {
    const upper = value.toUpperCase();
    setUsdotOnTruck(upper);
    if (driverAnswered) {
      computeStatus(upper, plateOnTruck, driverAnswered);
    }
  };

  const handlePlateChange = (value) => {
    const upper = value.toUpperCase();
    setPlateOnTruck(upper);
    if (driverAnswered) {
      computeStatus(usdotOnTruck, upper, driverAnswered);
    }
  };

  const handleDriverAnsweredChange = (value) => {
    setDriverAnswered(value);
    computeStatus(usdotOnTruck, plateOnTruck, value);
  };

  if (loading) {
    return null;
  }

  // If token not found at all
  if (!record) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "40px",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            width: "100%",
            background: "#020617",
            borderRadius: "18px",
            padding: "28px 26px",
            border: "1px solid rgba(248,113,113,0.7)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.75)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              marginBottom: "10px",
              color: "#fecaca",
            }}
          >
            NOT CLEARED TO LOAD — HOLD LOAD
          </div>
          <div
            style={{
              fontSize: "16px",
              opacity: 0.9,
            }}
          >
            This AdbS Truck-Driver verification link is not recognized. Hold this
            load and contact your dispatcher or broker/shipper immediately.
          </div>
        </div>
      </div>
    );
  }

  // If revoked by broker/shipper
  if (record.revoked) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "40px",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            width: "100%",
            background: "#020617",
            borderRadius: "18px",
            padding: "28px 26px",
            border: "1px solid rgba(248,113,113,0.7)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.75)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              marginBottom: "10px",
              color: "#fecaca",
            }}
          >
            NOT CLEARED TO LOAD — HOLD LOAD
          </div>
          <div
            style={{
              fontSize: "16px",
              opacity: 0.9,
            }}
          >
            This verification link has been revoked by the broker/shipper. Hold
            this load and await updated instructions.
          </div>
        </div>
      </div>
    );
  }

  const isClear = statusMode === "clear";
  const isNotClear = statusMode === "not_clear";

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
          padding: "0 24px 40px",
        }}
      >
        {/* LEFT COLUMN – PIN + VERIFICATION FORM */}
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
              marginBottom: "6px",
              opacity: 0.8,
            }}
          >
            AdbS ID: <strong>{record.adbSId || token}</strong>
          </p>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "18px",
              opacity: 0.75,
            }}
          >
            Load: <strong>{record.loadRef}</strong> &mdash;{" "}
            <strong>{record.carrierName}</strong>
          </p>

          {/* DOCK PIN GATE */}
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
                    width: "170px",
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
                    value={usdotOnTruck}
                    onChange={(e) => handleUsdotChange(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "18px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#020617",
                      color: "white",
                      textTransform: "uppercase",
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
                    value={plateOnTruck}
                    onChange={(e) => handlePlateChange(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "18px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#020617",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                  />
                </div>
              </div>

              {/* DRIVER ANSWERED QUESTION + CALL BUTTON */}
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
                    onClick={() => {
                      if (record.driverPhone) {
                        alert(
                          `Demo only: this would call the registered driver phone: ${record.driverPhone}`
                        );
                      } else {
                        alert(
                          "Demo only: in production this would call the registered driver phone."
                        );
                      }
                    }}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "999px",
                      border: "1px solid #38bdf8",
                      background: "transparent",
                      color: "#e5e7eb",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    Call Driver (Demo)
                  </button>

                  <label>
                    <input
                      type="radio"
                      name="driverAnswered"
                      value="YES"
                      checked={driverAnswered === "YES"}
                      onChange={() => handleDriverAnsweredChange("YES")}
                      style={{ marginRight: "6px" }}
                    />
                    YES
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="driverAnswered"
                      value="NO"
                      checked={driverAnswered === "NO"}
                      onChange={() => handleDriverAnsweredChange("NO")}
                      style={{ marginRight: "6px" }}
                    />
                    NO
                  </label>
                </div>
              </div>

              {/* STATUS BOX – CLEAR / NOT CLEARED */}
              <div
                style={{
                  borderRadius: "16px",
                  padding: "20px 22px",
                  marginTop: "4px",
                  background: isClear
                    ? "#16a34a"
                    : isNotClear
                    ? "#b91c1c"
                    : "#020617",
                  border:
                    statusMode === "idle"
                      ? "1px dashed rgba(148,163,184,0.6)"
                      : "1px solid rgba(15,23,42,0.9)",
                  textAlign: "center",
                  minHeight: "90px",
                }}
              >
                {isClear && (
                  <>
                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: 800,
                        marginBottom: "6px",
                      }}
                    >
                      CLEAR TO LOAD
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        opacity: 0.95,
                      }}
                    >
                      USDOT and license plate match the broker/shipper record,
                      and the driver answered their registered phone.
                    </div>
                  </>
                )}

                {isNotClear && (
                  <>
                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: 800,
                        marginBottom: "6px",
                      }}
                    >
                      NOT CLEARED TO LOAD — HOLD LOAD
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        opacity: 0.95,
                      }}
                    >
                      Hold this load. Contact your dispatcher or
                      broker/shipper for further instructions.
                    </div>
                  </>
                )}

                {statusMode === "idle" && !isClear && !isNotClear && (
                  <div
                    style={{
                      fontSize: "16px",
                      opacity: 0.9,
                    }}
                  >
                    Enter the USDOT and license plate from the truck, then call
                    the driver and record whether they answered. The system will
                    determine if this Truck-Driver is CLEAR TO LOAD or NOT
                    CLEARED TO LOAD.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN – DOCK CHECKLIST */}
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
                Confirm this is the correct AdbS link for the load you are
                checking in.
              </li>
              <li>Enter the USDOT and license plate exactly as on the truck.</li>
              <li>
                Use the “Call Driver” action to reach the registered phone. If
                anything feels off, select NO.
              </li>
              <li>
                Only when the system returns CLEAR TO LOAD should the
                Truck-Driver be loaded.
              </li>
            </ol>
            <div
              style={{
                fontSize: "14px",
                opacity: 0.8,
                borderTop: "1px solid rgba(148,163,184,0.4)",
                paddingTop: "10px",
                marginTop: "8px",
              }}
            >
              Demo only – in production, each decision would be logged in the
              QueCab AdbS Control Center for the broker/shipper.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
