// /src/pages/Verify.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header.jsx";

function onlyDigits(v) {
  return String(v || "").replace(/\D+/g, "");
}
function upperTrim(v) {
  return String(v || "").trim().toUpperCase();
}

export default function Verify() {
  const nav = useNavigate();
  const { token } = useParams();

  const [enteredUsdot, setEnteredUsdot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");

  const [driverPhone, setDriverPhone] = useState(""); // optional display (can be set later if you decide)
  const [callClicked, setCallClicked] = useState(false);

  const [driverAnswered, setDriverAnswered] = useState(null); // true/false/null
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null); // "clear" | "caution"
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [revoked, setRevoked] = useState(false);

  const normalized = useMemo(() => {
    return {
      token: String(token || "").trim(),
      entered_usdot: onlyDigits(enteredUsdot),
      entered_plate: upperTrim(enteredPlate),
      driver_answered: driverAnswered,
      ready:
        !!String(token || "").trim() &&
        !!onlyDigits(enteredUsdot) &&
        !!upperTrim(enteredPlate) &&
        callClicked === true &&
        (driverAnswered === true || driverAnswered === false),
    };
  }, [token, enteredUsdot, enteredPlate, callClicked, driverAnswered]);

  async function submit() {
    setErrorMsg("");
    setResult(null);

    if (!normalized.token) {
      setErrorMsg("Missing verify token.");
      return;
    }
    if (!normalized.entered_usdot) {
      setErrorMsg("Enter USDOT#.");
      return;
    }
    if (!normalized.entered_plate) {
      setErrorMsg("Enter Plate.");
      return;
    }
    if (!callClicked) {
      setErrorMsg("Click CALL DRIVER before submitting.");
      return;
    }
    if (!(driverAnswered === true || driverAnswered === false)) {
      setErrorMsg("Select Driver Answered: YES or NO.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit_verify_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: normalized.token,
          entered_usdot: normalized.entered_usdot,
          entered_plate: normalized.entered_plate,
          driver_answered: normalized.driver_answered,
        }),
      });

      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        const msg = (data && (data.error || data.message)) || `Verify failed (${res.status}).`;
        setErrorMsg(msg);
        setRevoked(!!data?.revoked);
        return;
      }

      const r = String(data?.result || "").toLowerCase();
      const isClear = r === "clear";
      setResult(isClear ? "clear" : "caution");

      if (typeof data?.attempts_remaining === "number") {
        setAttemptsRemaining(data.attempts_remaining);
      } else {
        setAttemptsRemaining(null);
      }

      setRevoked(!!data?.revoked);
    } catch {
      setErrorMsg("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const page = {
    minHeight: "100vh",
    background: "transparent",
  };

  const wrap = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "18px 16px 60px",
  };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const h1 = {
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: 0.2,
    margin: 0,
  };

  const lead = {
    marginTop: 10,
    fontSize: 15,
    opacity: 0.9,
    lineHeight: 1.45,
  };

  const bigQuestion = {
    fontSize: 22,
    fontWeight: 950,
    letterSpacing: 0.2,
    margin: "14px 0 6px",
    textTransform: "uppercase",
  };

  const label = { fontSize: 14, opacity: 0.92, marginBottom: 6 };

  const input = {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 18,
    outline: "none",
  };

  const btn = (primary) => ({
    padding: "14px 14px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(140,190,255,0.42)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary
      ? "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))"
      : "rgba(255,255,255,0.06)",
    color: "#e6edf5",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
    letterSpacing: 0.2,
  });

  const ynBtn = (active, yes) => ({
    flex: 1,
    padding: "14px 12px",
    borderRadius: 12,
    border: active
      ? yes
        ? "1px solid rgba(80,190,120,0.55)"
        : "1px solid rgba(255,90,90,0.55)"
      : "1px solid rgba(255,255,255,0.16)",
    background: active
      ? yes
        ? "rgba(80,190,120,0.16)"
        : "rgba(255,90,90,0.16)"
      : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 18,
    fontWeight: 950,
    cursor: "pointer",
    letterSpacing: 0.2,
  });

  const submitDisabled = loading || revoked || !normalized.ready;

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        <div style={card}>
          <div style={h1}>Dock Verification</div>

          <div style={lead}>
            <b>DOES THE USDOT# ON THE TRUCK MATCH?</b>
            <br />
            <b>DID THE DRIVER ANSWER THEIR PHONE?</b>
            <br />
            Both must be YES to clear the <b>Truck-Driver</b> for loading.
          </div>

          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={label}>Enter USDOT#</div>
              <input
                style={input}
                value={enteredUsdot}
                onChange={(e) => {
                  // Keep typing natural; we normalize digits-only for comparison.
                  setEnteredUsdot(upperTrim(e.target.value));
                }}
                placeholder="123456"
                inputMode="text"
                autoComplete="off"
              />
              <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
                Tip: Type what you see. (Compared digits-only.)
              </div>
            </div>

            <div>
              <div style={label}>Enter Plate</div>
              <input
                style={input}
                value={enteredPlate}
                onChange={(e) => setEnteredPlate(upperTrim(e.target.value))}
                placeholder="ABC1234"
                inputMode="text"
                autoComplete="off"
              />
              <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
                Auto-uppercase while typing.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={bigQuestion}>Call the Driver</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              <a
                href={driverPhone ? `tel:${onlyDigits(driverPhone)}` : "tel:"}
                onClick={() => setCallClicked(true)}
                style={{
                  ...btn(true),
                  textAlign: "center",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
                title="CALL DRIVER"
              >
                CALL DRIVER {callClicked ? "✅" : ""}
              </a>

              <div style={{ opacity: 0.78, fontSize: 13 }}>
                After calling, select whether the driver answered.
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={label}>Driver Answered Phone?</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  style={ynBtn(driverAnswered === true, true)}
                  onClick={() => setDriverAnswered(true)}
                  type="button"
                >
                  YES
                </button>
                <button
                  style={ynBtn(driverAnswered === false, false)}
                  onClick={() => setDriverAnswered(false)}
                  type="button"
                >
                  NO
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            <button style={btn(true)} onClick={submit} disabled={submitDisabled}>
              {loading ? "Submitting..." : revoked ? "LINK LOCKED" : "SUBMIT VERIFICATION"}
            </button>

            <div style={{ opacity: 0.72, fontSize: 12 }}>
              Submit unlocks only after USDOT + Plate + CALL DRIVER + YES/NO are completed.
            </div>

            {errorMsg ? (
              <div
                style={{
                  border: "1px solid rgba(255,80,80,0.35)",
                  background: "rgba(255,80,80,0.08)",
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 14,
                }}
              >
                <b>Error:</b> {errorMsg}
              </div>
            ) : null}

            {result === "clear" ? (
              <div
                style={{
                  marginTop: 6,
                  border: "1px solid rgba(80,190,120,0.45)",
                  background: "rgba(80,190,120,0.12)",
                  padding: 16,
                  borderRadius: 14,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 950, letterSpacing: 0.6 }}>
                  CLEAR TO LOAD
                </div>
                <div style={{ marginTop: 8, opacity: 0.9 }}>
                  Truck-Driver verification passed.
                </div>
              </div>
            ) : null}

            {result === "caution" ? (
              <div
                style={{
                  marginTop: 6,
                  border: "1px solid rgba(255,90,90,0.45)",
                  background: "rgba(255,90,90,0.12)",
                  padding: 16,
                  borderRadius: 14,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: 0.6 }}>
                  CAUTION — DO NOT LOAD
                </div>
                <div style={{ marginTop: 8, opacity: 0.92 }}>
                  Verification failed. Follow your dock policy and move to NEXT.
                </div>

                {typeof attemptsRemaining === "number" ? (
                  <div style={{ marginTop: 10, fontWeight: 900 }}>
                    Attempts remaining: {attemptsRemaining}
                  </div>
                ) : null}

                {revoked ? (
                  <div style={{ marginTop: 10, fontWeight: 900 }}>
                    This link is now locked.
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 16, opacity: 0.65, fontSize: 12 }}>
            If this screen is open, it is intended for authorized dock/check-in personnel.
            <div style={{ marginTop: 8 }}>
              <button style={btn(false)} onClick={() => nav("/")}>Back Home</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
