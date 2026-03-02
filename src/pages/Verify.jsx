// /src/pages/Verify.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}
function toUpper(s) {
  return String(s || "").toUpperCase();
}
function formatPhoneHyphen(s) {
  const d = onlyDigits(s).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}
async function safeJson(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

export default function Verify() {
  const nav = useNavigate();
  const { token } = useParams();

  const [enteredDot, setEnteredDot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");
  const [driverAnswered, setDriverAnswered] = useState("");

  const [dockPin, setDockPin] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [phoneUnlocked, setPhoneUnlocked] = useState(false);
  const [callCompleted, setCallCompleted] = useState(false);

  const [pinError, setPinError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);

  const clean = useMemo(() => ({
    token: String(token || "").trim(),
    dot: toUpper(enteredDot).trim(),
    plate: toUpper(enteredPlate).trim(),
    pin: onlyDigits(dockPin).slice(0, 6)
  }), [token, enteredDot, enteredPlate, dockPin]);

  async function revealPhone() {
    setPinError("");
    try {
      const res = await fetch("/api/reveal_driver_phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: clean.token, dock_pin: clean.pin }),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        setPinError(data?.error || "Authorization failed.");
        return;
      }
      setDriverPhone(formatPhoneHyphen(data.driver_phone));
      setPhoneUnlocked(true);
    } catch {
      setPinError("Network error.");
    }
  }

  async function submitVerification() {
    setSubmitError("");
    try {
      const res = await fetch("/api/submit_verify_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: clean.token,
          entered_usdot: clean.dot,
          entered_plate: clean.plate,
          driver_answered: driverAnswered === "YES"
        })
      });
      const data = await safeJson(res);
      if (!res.ok) {
        setSubmitError(data?.error || "Submit failed.");
        return;
      }
      setResult(data);
    } catch {
      setSubmitError("Network error.");
    }
  }

  const input = {
    width: "100%",
    padding: "14px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "white"
  };

  const button = {
    padding: "14px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(0,100,200,0.6)",
    color: "white",
    cursor: "pointer"
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto", color: "white" }}>
      
      <h2>DOES THE USDOT# ON THE TRUCK MATCH?</h2>

      {/* DOT / PLATE FIRST */}
      <div style={{ marginTop: "20px" }}>
        <label>Enter USDOT#</label>
        <input
          style={input}
          value={enteredDot}
          onChange={(e) => setEnteredDot(toUpper(e.target.value))}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>Enter Plate</label>
        <input
          style={input}
          value={enteredPlate}
          onChange={(e) => setEnteredPlate(toUpper(e.target.value))}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>DID THE DRIVER ANSWER THEIR PHONE?</label>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button style={button} onClick={() => setDriverAnswered("YES")}>YES</button>
          <button style={button} onClick={() => setDriverAnswered("NO")}>NO</button>
        </div>
      </div>

      <div style={{ marginTop: "25px" }}>
        <button style={button} onClick={submitVerification}>
          SUBMIT VERIFICATION
        </button>
      </div>

      {submitError && <div style={{ color: "red" }}>{submitError}</div>}
      {result && (
        <div style={{ marginTop: "20px", fontSize: "22px", fontWeight: "bold" }}>
          {result.result || result.verdict}
        </div>
      )}

      {/* PHONE SECTION NOW LAST */}
      <div style={{ marginTop: "40px" }}>
        <h3>Dock Authorization Required</h3>
        <label>Enter Dock PIN</label>
        <input
          style={input}
          value={dockPin}
          onChange={(e) => setDockPin(e.target.value)}
        />
        <button style={{ ...button, marginTop: "10px" }} onClick={revealPhone}>
          Authorize
        </button>

        {pinError && <div style={{ color: "red" }}>{pinError}</div>}

        {phoneUnlocked && (
          <div style={{ marginTop: "15px", fontSize: "20px" }}>
            <a href={`tel:${onlyDigits(driverPhone)}`} style={{ color: "white" }}>
              {driverPhone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
