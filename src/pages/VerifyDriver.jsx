import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function VerifyDriver() {
  const { token } = useParams();
  const [passedPin, setPassedPin] = useState(false);
  const [pin, setPin] = useState("");
  const [usdMatch, setUsdMatch] = useState("");
  const [ansCall, setAnsCall] = useState("");
  const audioRef = useRef(null);

  // keep existing behavior idea: PIN gate first
  const submitPin = (e) => {
    e.preventDefault();
    // demo: accept any 4+ chars; real logic unchanged elsewhere
    if ((pin || "").trim().length >= 4) setPassedPin(true);
  };

  const bothYes = usdMatch === "Yes" && ansCall === "Yes";
  const showResult = usdMatch && ansCall;

  useEffect(() => {
    if (showResult && !bothYes && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [showResult, bothYes]);

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
            />
            <button className="btn">Continue</button>
          </form>
        </div>
      ) : (
        <div className="card">
          <h1>Truck-Driver Verification</h1>
          <p className="muted" style={{ marginBottom: 12 }}>Token: {token}</p>

          <div className="form">
            <div>
              <label>USDOT matches?</label>
              <select className="input select" value={usdMatch} onChange={(e)=>setUsdMatch(e.target.value)}>
                <option value="">Select…</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div>
              <label>Driver answered call?</label>
              <select className="input select" value={ansCall} onChange={(e)=>setAnsCall(e.target.value)}>
                <option value="">Select…</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          {showResult && (
            <div
              className={`banner ${bothYes ? "success" : "danger flash-danger"}`}
              style={{ marginTop: 16 }}
            >
              {bothYes ? "✅ CLEAR TO LOAD" : "🚫 CAUTION ALERT — DO NOT LOAD"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
