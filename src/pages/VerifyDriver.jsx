import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function YnButtons({ label, value, onChange, showCheck=false }) {
  const yes = value === "Yes";
  const no  = value === "No";
  return (
    <div>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
        {label}
        {showCheck && yes && <span style={{ color: "#2aa865", marginLeft: 10 }}>✅</span>}
        {showCheck && no  && <span style={{ color: "#c62828", marginLeft: 10 }}>❌</span>}
      </label>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          className="btn"
          style={{ background: yes ? "#2aa865" : "var(--button-bg)", color: yes ? "#fff" : "var(--button-text)" }}
          onClick={() => onChange("Yes")}
        >
          Y
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: no ? "#c62828" : "var(--button-bg)", color: no ? "#fff" : "var(--button-text)" }}
          onClick={() => onChange("No")}
        >
          N
        </button>
      </div>
    </div>
  );
}

export default function VerifyDriver() {
  const { token } = useParams();
  const query = useQuery();
  const tel = query.get("tel") || "";              // driver phone from SmartLink (dock-only)
  const [passedPin, setPassedPin] = useState(false);
  const [pin, setPin] = useState("");

  const [usdMatch, setUsdMatch] = useState("");
  const [plateMatch, setPlateMatch] = useState("");
  const [ansCall, setAnsCall] = useState("");

  const audioRef = useRef(null);

  const submitPin = (e) => {
    e.preventDefault();
    if ((pin || "").trim().length >= 4) setPassedPin(true);
  };

  const allYes = usdMatch === "Yes" && plateMatch === "Yes" && ansCall === "Yes";
  const showResult = usdMatch && plateMatch && ansCall;

  useEffect(() => {
    if (showResult && !allYes && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [showResult, allYes]);

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <audio ref={audioRef} src="/alert.mp3" preload="auto" />

      {!passedPin ? (
        <div className="card">
          <h1>Enter PIN</h1>
          <form className="form" onSubmit={submitPin}>
            <input
              className="input"
              placeholder="PIN"
              value={pin}
              onChange={(e)=>setPin(e.target.value)}
              inputMode="numeric"
            />
            <button className="btn">Continue</button>
          </form>
        </div>
      ) : (
        <div className="card">
          <h1>Truck-Driver Verification</h1>
          <p className="muted" style={{ marginBottom: 12 }}>Token: {token}</p>

          {/* Dock-only clickable phone (after PIN) */}
          {tel && (
            <p style={{ marginBottom: 16 }}>
              <strong>Call Driver:</strong>{" "}
              <a href={`tel:${tel}`} style={{ textDecoration: "none", fontWeight: 900 }}>
                {tel}
              </a>
            </p>
          )}

          <div className="form">
            <YnButtons
              label="Does the USDOT# on the truck match?"
              value={usdMatch}
              onChange={setUsdMatch}
              showCheck
            />
            <YnButtons
              label="Does the license plate match?"
              value={plateMatch}
              onChange={setPlateMatch}
              showCheck
            />
            <YnButtons
              label="Did the driver answer their phone when called?"
              value={ansCall}
              onChange={setAnsCall}
            />
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button
              className="btn"
              onClick={() => {
                if (!usdMatch || !plateMatch || !ansCall) {
                  alert("Please answer all three questions.");
                }
              }}
            >
              SUBMIT
            </button>
          </div>

          {showResult && (
            <div
              className={`banner ${allYes ? "success" : "danger flash-danger"}`}
              style={{ marginTop: 16 }}
            >
              {allYes ? "✅ CLEAR TO LOAD" : "🚫 CAUTION ALERT — DO NOT LOAD"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
