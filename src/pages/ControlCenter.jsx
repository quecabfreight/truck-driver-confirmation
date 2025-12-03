import React, { useState } from "react";

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;

  if (len <= 3) return digits;
  if (len <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function randomToken() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 7; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `DEMO-${out}`;
}

export default function ControlCenter() {
  const [loadRef, setLoadRef] = useState("");
  const [carrierName, setCarrierName] = useState("");
  const [usdot, setUsdot] = useState("");
  const [plate, setPlate] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendText, setSendText] = useState(false);
  const [sendToEmail, setSendToEmail] = useState("");
  const [linkStart, setLinkStart] = useState("");
  const [linkExpires, setLinkExpires] = useState("");

  const [activeLinks, setActiveLinks] = useState([]);
  const [recentChecks, setRecentChecks] = useState([]);

  const [isIssuing, setIsIssuing] = useState(false);
  const [issueMessage, setIssueMessage] = useState("");

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://quecabads.com";

  const handleIssueLink = (e) => {
    e.preventDefault();

    if (!loadRef.trim() || !carrierName.trim() || !usdot.trim() || !plate.trim()) {
      setIssueMessage("Load Reference, Carrier, USDOT#, and Plate are required in this demo.");
      return;
    }

    if (!sendEmail && !sendText) {
      setIssueMessage("Select at least one send method (Email and/or Text).");
      return;
    }

    if (sendEmail && !sendToEmail.trim()) {
      setIssueMessage("Enter the email address this demo link would be sent to.");
      return;
    }

    setIsIssuing(true);
    setIssueMessage("");

    setTimeout(() => {
      const token = randomToken();
      const normalizedUsdot = usdot.trim().toUpperCase();
      const normalizedPlate = plate.trim().toUpperCase();
      const url = `${origin}/#/verify/${token}`;
      const now = new Date().toLocaleString();

      const newLink = {
        token,
        url,
        loadRef: loadRef.trim(),
        carrierName: carrierName.trim(),
        usdot: normalizedUsdot,
        plate: normalizedPlate,
        driverName: driverName.trim(),
        driverPhone: driverPhone.trim(),
        sendEmail,
        sendText,
        sendToEmail: sendToEmail.trim(),
        linkStart,
        linkExpires,
        createdAt: now,
      };

      // 🔐 Demo-only: stash expected DOT + plate locally for this token
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(
            `demo_verify_${token}`,
            JSON.stringify({
              loadRef: newLink.loadRef,
              carrierName: newLink.carrierName,
              usdot: newLink.usdot,
              plate: newLink.plate,
            })
          );
        }
      } catch (err) {
        // ignore demo-storage errors
      }

      setActiveLinks((prev) => [newLink, ...prev].slice(0, 8));
      setRecentChecks((prev) =>
        [
          {
            token,
            loadRef: newLink.loadRef,
            carrierName: newLink.carrierName,
            createdAt: now,
            status: "Awaiting dock verification",
          },
          ...prev,
        ].slice(0, 6)
      );

      setIsIssuing(false);
      setIssueMessage("Demo verification link issued – copy the URL from the Active Links column.");

      setDriverName("");
      setDriverPhone("");
    }, 500);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        padding: "40px 0 56px",
        background:
          "linear-gradient(180deg, #050814 0%, #020617 40%, #030712 100%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          padding: "0 24px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "28px",
            gap: "24px",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS"
              style={{
                width: "220px",
                height: "auto",
                display: "block",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: "32px",
                margin: 0,
                marginBottom: "6px",
              }}
            >
              AdbS Control Center
            </h1>
            <p
              style={{
                fontSize: "17px",
                margin: 0,
                opacity: 0.85,
              }}
            >
              Issue AdbS Truck-Driver verification links and monitor activity in
              front of the dock. Demo mode only – no live data is stored.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1.1fr 1.1fr",
            gap: "20px",
          }}
        >
          {/* LEFT – ISSUE LINK */}
          <div
            style={{
              background: "#020617",
              borderRadius: "18px",
              padding: "22px 22px 26px",
              border: "1px solid rgba(148,163,184,0.7)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.65)",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                marginTop: 0,
                marginBottom: "4px",
              }}
            >
              Issue AdbS Verification Link
            </h2>
            <p
              style={{
                fontSize: "15px",
                marginTop: 0,
                marginBottom: "16px",
                opacity: 0.8,
              }}
            >
              Enter the load and carrier details exactly as on your paperwork.
              In production, this link would be distributed to the driver and
              dock teams.
            </p>

            <form onSubmit={handleIssueLink}>
              {/* Load + Carrier */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 1.3fr",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "15px",
                      marginBottom: "4px",
                    }}
                  >
                    Load / Reference #
                  </label>
                  <input
                    type="text"
                    value={loadRef}
                    onChange={(e) => setLoadRef(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#0b1120",
                      color: "white",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "15px",
                      marginBottom: "4px",
                    }}
                  >
                    Carrier / Legal Name
                  </label>
                  <input
                    type="text"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#0b1120",
                      color: "white",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>

              {/* USDOT + Plate */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "15px",
                      marginBottom: "4px",
                    }}
                  >
                    USDOT# on Truck
                  </label>
                  <input
                    type="text"
                    value={usdot}
                    onChange={(e) => setUsdot(e.target.value.toUpperCase())}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#0b1120",
                      color: "white",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "15px",
                      marginBottom: "4px",
                    }}
                  >
                    License Plate on Truck
                  </label>
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#0b1120",
                      color: "white",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>

              {/* Driver row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "15px",
                      marginBottom: "4px",
                    }}
                  >
                    Driver Name (optional)
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#0b1120",
                      color: "white",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "15px",
                      marginBottom: "4px",
                    }}
                  >
                    Driver Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(formatPhone(e.target.value))}
                    placeholder="555-555-1212"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#0b1120",
                      color: "white",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>

              {/* Send via + email */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  marginBottom: "10px",
                  fontSize: "15px",
                }}
              >
                <span style={{ opacity: 0.9 }}>Send link via:</span>
                <label>
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    style={{ marginRight: "6px" }}
                  />
                  Email
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={sendText}
                    onChange={(e) => setSendText(e.target.checked)}
                    style={{ marginRight: "6px" }}
                  />
                  Text
                </label>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "15px",
                    marginBottom: "4px",
                  }}
                >
                  Send To Email
                </label>
                <input
                  type="email"
                  value={sendToEmail}
                  onChange={(e) => setSendToEmail(e.target.value)}
                  placeholder="dispatch@example.com"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #64748b",
                    background: "#0b1120",
                    color: "white",
                    fontSize: "16px",
                  }}
                />
              </div>

              {/* Date window */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "18px",
                  fontSize: "15px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Link Start (optional)
                  </label>
                  <input
                    type="date"
                    value={linkStart}
                    onChange={(e) => setLinkStart(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#0b1120",
                      color: "white",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Link Expires (optional)
                  </label>
                  <input
                    type="date"
                    value={linkExpires}
                    onChange={(e) => setLinkExpires(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      border: "1px solid #64748b",
                      background: "#0b1120",
                      color: "white",
                    }}
                  />
                </div>
              </div>

              {/* BUTTON + MESSAGE */}
              <button
                type="submit"
                disabled={isIssuing}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "18px",
                  fontWeight: 700,
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
                  color: "#020617",
                  boxShadow: "0 10px 30px rgba(15,118,110,0.6)",
                  marginBottom: "10px",
                }}
              >
                {isIssuing ? "Issuing Demo Link…" : "Issue Verification Link (Demo)"}
              </button>

              <div
                style={{
                  fontSize: "14px",
                  minHeight: "20px",
                  color: issueMessage
                    ? issueMessage.startsWith("Demo verification")
                      ? "#bbf7d0"
                      : "#fecaca"
                    : "#9ca3af",
                  background: issueMessage
                    ? issueMessage.startsWith("Demo verification")
                      ? "rgba(22,163,74,0.16)"
                      : "rgba(248,113,113,0.12)"
                    : "transparent",
                  borderRadius: "10px",
                  padding: issueMessage ? "8px 10px" : 0,
                }}
              >
                {issueMessage ||
                  "Demo only – in production this action would dispatch Smart Links to the selected parties."}
              </div>
            </form>
          </div>

          {/* MIDDLE – ACTIVE LINKS */}
          <div
            style={{
              background: "#020617",
              borderRadius: "18px",
              padding: "18px 18px 20px",
              border: "1px solid rgba(148,163,184,0.6)",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                marginTop: 0,
                marginBottom: "10px",
              }}
            >
              Active Verify Links (Demo)
            </h2>
            {activeLinks.length === 0 ? (
              <p
                style={{
                  fontSize: "15px",
                  opacity: 0.8,
                }}
              >
                No active demo links yet. Issue a verification link on the left to
                see it appear here.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  maxHeight: "420px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {activeLinks.map((link) => (
                  <div
                    key={link.token}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid rgba(148,163,184,0.7)",
                      padding: "10px 10px 10px",
                      background:
                        "radial-gradient(circle at top left, rgba(59,130,246,0.20), #020617 52%)",
                      fontSize: "14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {link.loadRef} – {link.carrierName}
                    </div>
                    <div style={{ opacity: 0.9 }}>
                      <div>
                        USDOT {link.usdot} • Plate {link.plate}
                      </div>
                      {link.driverName && (
                        <div>
                          Driver: {link.driverName}
                          {link.driverPhone ? ` • ${link.driverPhone}` : ""}
                        </div>
                      )}
                      <div>
                        Sent via:{" "}
                        {[
                          link.sendEmail ? "Email" : null,
                          link.sendText ? "Text" : null,
                        ]
                          .filter(Boolean)
                          .join(" + ") || "—"}
                      </div>
                      {link.linkStart || link.linkExpires ? (
                        <div>
                          Window:{" "}
                          {link.linkStart ? link.linkStart : "Now"} →{" "}
                          {link.linkExpires ? link.linkExpires : "Open"}
                        </div>
                      ) : null}
                      <div style={{ marginTop: "4px" }}>
                        <span style={{ opacity: 0.8 }}>Verify URL:</span>
                        <br />
                        <span
                          style={{
                            wordBreak: "break-all",
                            fontFamily: "monospace",
                            fontSize: "13px",
                          }}
                        >
                          {link.url}
                        </span>
                      </div>
                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "12px",
                          opacity: 0.7,
                        }}
                      >
                        Created: {link.createdAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT – RECENT CHECKS */}
          <div
            style={{
              background: "#020617",
              borderRadius: "18px",
              padding: "18px 18px 20px",
              border: "1px solid rgba(148,163,184,0.6)",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                marginTop: 0,
                marginBottom: "10px",
              }}
            >
              Recent Truck-Driver Checks (Demo)
            </h2>
            {recentChecks.length === 0 ? (
              <p
                style={{
                  fontSize: "15px",
                  opacity: 0.8,
                }}
              >
                When dock teams complete Truck-Driver verification, the results
                will appear here. In this demo, issuing a link will show a
                pending entry.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: "420px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {recentChecks.map((check) => (
                  <div
                    key={check.token}
                    style={{
                      borderRadius: "10px",
                      border: "1px solid rgba(148,163,184,0.6)",
                      padding: "8px 9px",
                      background:
                        "linear-gradient(135deg, rgba(15,118,110,0.30), #020617)",
                      fontSize: "14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        marginBottom: "2px",
                      }}
                    >
                      {check.loadRef} – {check.carrierName}
                    </div>
                    <div style={{ opacity: 0.9 }}>
                      Token: {check.token}
                      <br />
                      Status: {check.status}
                    </div>
                    <div
                      style={{
                        marginTop: "2px",
                        fontSize: "12px",
                        opacity: 0.7,
                      }}
                    >
                      Created: {check.createdAt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
