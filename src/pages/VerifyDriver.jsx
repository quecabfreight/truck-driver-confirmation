import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const DOCK_PIN = "2580";
const MAX_TRIES = 3;

function useAudio(src) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = new Audio(src);
  }, [src]);
  return {
    play: () => {
      if (ref.current) {
        ref.current.currentTime = 0;
        ref.current.play().catch(() => {});
      }
    },
  };
}

export default function VerifyDriver() {
  const { token } = useParams();

  // Gate
  const [pin, setPin] = useState("");
  const [tries, setTries] = useState(0);
  const [locked, setLocked] = useState(false);
  const [passed, setPassed] = useState(false);

  // Form
  const [bolUsdot, setBolUsdot] = useState("");     // from paperwork
  const [truckUsdot, setTruckUsdot] = useState(""); // from the truck decal
  const [plate, setPlate] = useState("");           // optional capture (doesn't affect logic)
  const [driverPhone, setDriverPhone] = useState("");

  // Checks
  const [matchYes, setMatchYes] = useState(null);     // auto-computed (read-only)
  const [answeredYes, setAnsweredYes] = useState(null);

  const [flash, setFlash] = useState(false);
  const alertAudio = useAudio("/alert.mp3");
  const tokenShort = useMemo(() => (token || "").slice(0, 12), [token]);

  useEffect(() => {
    if (tries >= MAX_TRIES && !passed) setLocked(true);
  }, [tries, passed]);

  const onPinSubmit = (e) => {
    e.preventDefault();
    if (locked) return;
    if (pin === DOCK_PIN) setPassed(true);
    else setTries((t) => t + 1);
  };

  // Helpers
  const maskUsd = (val) => val.replace(/\D/g, "").slice(0, 10);
  const phoneMask = (val) => {
    const d = val.replace(/\D/g, "").slice(0, 10);
    const a = d.slice(0, 3), b = d.slice(3, 6), c = d.slice(6, 10);
    if (d.length > 6) return `${a}-${b}-${c}`;
    if (d.length > 3) return `${a}-${b}`;
    return a;
  };

  // Auto-evaluate USDOT match when both present
  useEffect(() => {
    if (bolUsdot && truckUsdot) {
      setMatchYes(bolUsdot === truckUsdot);
    } else {
      setMatchYes(null);
    }
  }, [bolUsdot, truckUsdot]);

  const submitVerification = (e) => {
    e.preventDefault();
    const ok = matchYes === true && answeredYes === true;
    if (!ok) {
      setFlash(true);
      alertAudio.play();
      setTimeout(() => setFlash(false), 450);
      alert("CAUTION ALERT – DO NOT LOAD");
      return;
    }
    alert("CLEAR TO LOAD");
  };

  // ----- PIN gate -----
  if (!passed) {
    return (
      <div className="card pin-wrap" style={{ textAlign: "center" }}>
        <img src="/qc-logo.png" alt="QueCab AdbS" className="centered-logo" />
        <h2 style={{ marginTop: 6, marginBottom: 8 }}>Dock PIN Required</h2>
        <div className="subtle">Token: <code>{tokenShort || "—"}</code></div>
        <form onSubmit={onPinSubmit} className="form" style={{ marginTop: 12 }}>
          <input
            className="input pin-input"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
          <div className="pin-meta">
            <div className="subtle">Enter the 4-digit PIN</div>
            <div className="subtle">Attempts: {Math.min(tries, MAX_TRIES)}/{MAX_TRIES}</div>
          </div>
          <button className="btn primary" type="submit" disabled={locked}>
            {locked ? "Locked" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  // ----- Verification form -----
  return (
    <>
      {flash && <div className="flash-overlay" />}
      <div className="card">
        <img src="/qc-logo.png" alt="QueCab AdbS" className="centered-logo" />
        <h2 style={{ textAlign: "center", marginTop: 6, marginBottom: 14 }}>
          Truck-Driver Verification
        </h2>

        <form className="form" onSubmit={submitVerification}>
          <div>
            <div className="form-label">USDOT# on B.O.L.</div>
            <input
              className="input"
              placeholder="e.g., 1234567"
              value={bolUsdot}
              onChange={(e) => setBolUsdot(maskUsd(e.target.value))}
              required
            />
          </div>

          <div>
            <div className="form-label">USDOT# on Truck (door decal)</div>
            <input
              className="input"
              placeholder="e.g., 1234567"
              value={truckUsdot}
              onChange={(e) => setTruckUsdot(maskUsd(e.target.value))}
              required
            />
          </div>

          <div>
            <div className="form-label">License Plate (optional capture)</div>
            <input
              className="input"
              placeholder="e.g., ABC12345"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase().slice(0, 12))}
            />
          </div>

          <div>
            <div className="form-label">Driver Phone (click to call from dock)</div>
            <input
              className="input"
              placeholder="123-456-7890"
              value={driverPhone}
              onChange={(e) => setDriverPhone(phoneMask(e.target.value))}
            />
          </div>

          {/* Check 1: USDOT match (auto) */}
          <div>
            <div className="form-label" style={{ marginBottom: 10 }}>
              DOES THE USDOT# ON THE TRUCK MATCH THE B.O.L.?
            </div>
            <div className="yesno" aria-live="polite">
              <button
                type="button"
                className="btn ok"
                aria-pressed={matchYes === true}
                disabled
                title="Auto-evaluated from the two USDOT fields"
                style={{ opacity: matchYes === true ? 1 : 0.5 }}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn warn"
                aria-pressed={matchYes === false}
                disabled
                title="Auto-evaluated from the two USDOT fields"
                style={{ opacity: matchYes === false ? 1 : 0.5 }}
              >
                No
              </button>
            </div>
            {matchYes === null && (
              <div className="subtle" style={{ marginTop: 6 }}>
                Enter both USDOT numbers to evaluate match.
              </div>
            )}
          </div>

          {/* Check 2: phone answered (manual) */}
          <div>
            <div className="form-label" style={{ marginBottom: 10 }}>
              DID THE DRIVER ANSWER THEIR PHONE?
            </div>
            <div className="yesno">
              <button
                type="button"
                className="btn ok"
                aria-pressed={answeredYes === true}
                onClick={() => setAnsweredYes(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn warn"
                aria-pressed={answeredYes === false}
                onClick={() => setAnsweredYes(false)}
              >
                No
              </button>
            </div>
          </div>

          {driverPhone && (
            <div className="subtle" style={{ marginTop: 6 }}>
              Dock-only call link:{" "}
              <a href={`tel:${driverPhone.replace(/\D/g, "")}`}>{driverPhone}</a>
            </div>
          )}

          <button className="btn primary" type="submit" style={{ marginTop: 8 }}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
