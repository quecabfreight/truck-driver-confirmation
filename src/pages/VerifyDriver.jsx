import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const STORAGE_KEY_PREFIX = "adbsv1_token_";
const DEMO_PIN = "1234";

export default function VerifyDriver() {
  const { token } = useParams();

  const [linkData, setLinkData] = useState(null);
  const [linkState, setLinkState] = useState("loading"); 
  // "loading" | "invalid" | "revoked" | "ready" | "used"

  const [pin, setPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);

  const [usdot, setUsdot] = useState("");
  const [plate, setPlate] = useState("");
  const [q1, setQ1] = useState(""); // USDOT matches?
  const [q2, setQ2] = useState(""); // Driver answered?

  const [finalResult, setFinalResult] = useState(null); 
  // "CLEAR" | "NOT_CLEAR" | null

  // Load token payload
  useEffect(() => {
    const key = `${STORAGE_KEY_PREFIX}${token}`;
    const raw = localStorage.getItem(key);

    if (!raw) {
      setLinkState("invalid");
      return;
    }

    try {
      const data = JSON.parse(raw);
      setLinkData(data);

      if (data.revoked) {
        setLinkState("revoked");
      } else if (data.usedAt && data.result) {
        setLinkState("used");
        setFinalResult(data.result);
      } else {
        setLinkState("ready");
      }
    } catch {
      setLinkState("invalid");
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

  const formatUpper = (value) => value.toUpperCase();

  // When both answers are set and PIN is verified, finalize ONCE
  useEffect(() => {
    if (
      linkState === "ready" &&
      pinVerified &&
      q1 &&
      q2 &&
      !finalResult &&
      linkData
    ) {
      const isClear = q1 === "YES" && q2 === "YES";
      const result = isClear ? "CLEAR" : "NOT_CLEAR";
      setFinalResult(result);

      const key = `${STORAGE_KEY_PREFIX}${token}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const data = JSON.parse(raw);
          const updated = {
            ...data,
            usedAt: Date.now(),
            result,
          };
          localStorage.setItem(key, JSON.stringify(updated));
        } catch {
          // ignore parse error
        }
      }

      setLinkState("used");
    }
  }, [linkState, pinVerified, q1, q2, finalResult, linkData, token]);

  // STATUS DISPLAY
  let statusTitle = "";
  let statusDetail = "";
  let statusColor = "#1e293b";

  const resolvedResult = finalResult || (linkData && linkData.result) || null;

  if (resolvedResult === "CLEAR") {
    statusTitle = "CLEAR TO LOAD";
    statusDetail =
      "USDOT# and plate matched your record, and the driver answered their registered phone.";
    statusColor = "#047857";
  } else if (resolvedResult === "NOT_CLEAR") {
    statusTitle = "NOT CLEARED TO LOAD — HOLD LOAD";
    statusDetail =
      "Something did not line up. Hold this load and follow your internal escalation steps.";
    statusColor = "#b91c1c";
  } else if (pinVerified) {
    statusTitle = "";
    statusDetail =
      "Complete both checks to determine if this Truck-Driver is CLEAR TO LOAD or NOT CLEARED TO LOAD.";
    statusColor = "#1e293b";
  }

  // LINK-LEVEL MESSAGES
  if (linkState === "invalid") {
    return (
      <Wrapper>
        <Card>
          <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>
            AdbS Truck-Driver Verification
          </h1>
          <p style={{ fontSize: "16px", opacity: 0.85 }}>
            This AdbS link is invalid or has expired. Please contact the
            broker/shipper that issued this load.
          </p>
        </Card>
      </Wrapper>
    );
  }

  if (linkState === "revoked") {
    return (
      <Wrapper>
        <Card>
          <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>
            AdbS Truck-Driver Verification
          </h1>
          <p
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "#fecaca",
            }}
          >
            This AdbS link has been revoked by the broker/shipper.
          </p>
          <p style={{ fontSize: "14px", opacity: 0.85 }}>
            Do not load this truck. Contact your internal supervisor or the
            broker/shipper for next steps.
          </p>
        </Card>
      </Wrapper>
    );
  }

  const usedOnce =
    linkState === "used" && resolvedResult && linkData && linkData.usedAt;

  return (
    <Wrapper>
      <div
        style={{
          display: "flex",
          gap: "32px",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {/* LEFT COLUMN */}
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
              marginBottom: "16px",
              opacity: 0.7,
            }}
          >
            AdbS ID: <strong>{token}</strong>
          </p>

          {usedOnce && (
            <div
              style={{
                marginBottom: "18px",
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(15,23,42,0.85)",
                border: "1px solid rgba(148,163,184,0.7)",
                fontSize: "14px",
              }}
            >
              This AdbS link has already been used. The result below is locked
              and cannot be changed from this screen.
            </div>
          )}

          {/* PIN GATE */}
          {!pinVerified && !usedOnce && (
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
                Enter the dock PIN to unlock the verification checks. Demo PIN
                is <strong>1234</strong>.
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

          {/* VERIFICATION FORM (only if ready, pin ok, not previously used) */}
          {pinVerified && !usedOnce && (
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
                    onChange={(e) => setUsdot(formatUpper(e.target.value))}
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
                    onChange={(e) => setPlate(formatUpper(e.target.value))}
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

              {/* Question 1 */}
              <div style={{ marginBottom: "20px" }}>
                <p
                  style={{
                    fontSize: "18px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  DOES THE USDOT# ON THE TRUCK MATCH YOUR RECORD?
                </p>
                <div style={{ display: "flex", gap: "18px", fontSize: "18px" }}>
                  <label>
                    <input
                      type="radio"
                      name="q1"
                      value="YES"
                      checked={q1 === "YES"}
                      onChange={(e) => setQ1(e.target.value)}
                      style={{ marginRight: "6px" }}
                    />
                    YES
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="q1"
                      value="NO"
                      checked={q1 === "NO"}
                      onChange={(e) => setQ1(e.target.value)}
                      style={{ marginRight: "6px" }}
                    />
                    NO
                  </label>
                </div>
              </div>

              {/* Question 2 */}
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
                  {/* Call Driver first, then Y/N */}
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
                      name="q2"
                      value="YES"
                      checked={q2 === "YES"}
                      onChange={(e) => setQ2(e.target.value)}
                      style={{ marginRight: "6px" }}
                    />
                    YES
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="q2"
                      value="NO"
                      checked={q2 === "NO"}
                      onChange={(e) => setQ2(e.target.value)}
                      style={{ marginRight: "6px" }}
                    />
                    NO
                  </label>
                </div>
              </div>

              {/* STATUS BOX */}
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
                    Complete both questions to determine if this Truck-Driver is
                    CLEAR TO LOAD or NOT CLEARED TO LOAD.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* When used: show locked status instead of form */}
          {usedOnce && (
            <div
              style={{
                background: "#020617",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(148, 163, 184, 0.6)",
                marginTop: "6px",
              }}
            >
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
                    This AdbS link has already been used.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN – DOCK CHECKLIST */}
        <div style={{ flex: 1 }}>
          <Card>
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
                Confirm this is the correct verify screen for the load you are
                checking in.
              </li>
              <li>Enter the USDOT# and license plate exactly as on the truck.</li>
              <li>
                Use the “Call Driver” button to reach the registered phone. If
                anything feels off, mark NO.
              </li>
              <li>
                Only when both answers are YES should this Truck-Driver be
                CLEAR TO LOAD.
              </li>
            </ol>
            <div
              style={{
                fontSize: "15px",
                opacity: 0.8,
                borderTop: "1px solid rgba(148,163,184,0.4)",
                paddingTop: "10px",
                marginTop: "8px",
              }}
            >
              This demo does not store live data beyond your browser. In
              production, each decision would be logged in the QueCab AdbS
              Control Center.
            </div>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

function Wrapper({ children }) {
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
      {children}
    </div>
  );
}

function Card({ children }) {
  return (
    <div
      style={{
        background: "#020617",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(148, 163, 184, 0.6)",
        maxWidth: "700px",
      }}
    >
      {children}
    </div>
  );
}
