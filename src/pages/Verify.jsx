import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { formatPhone } from "../utils/formatPhone";
import "./verify.css";

export default function Verify() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  // Bootstrapped details (from QR/link):
  const dot = params.get("dot") || "";           // USDOT number
  const driver = params.get("driver") || "";     // Driver name
  const phoneRaw = params.get("phone") || "";    // Driver phone
  const carrier = params.get("carrier") || "";   // Carrier name
  const loadId = params.get("load") || "";       // Optional

  const phone = useMemo(()=>formatPhone(phoneRaw), [phoneRaw]);

  // Two mandatory checks
  const [matchDot, setMatchDot] = useState(null);    // true/false
  const [answered, setAnswered] = useState(null);    // true/false

  // Result state
  const [verdict, setVerdict] = useState(null); // "clear" | "caution" | null
  const [flash, setFlash] = useState(false);

  // Sound (neutral short tone)
  const audioRef = useRef(null);
  useEffect(() => {
    if (!verdict) return;
    if (verdict === "caution") {
      setFlash(true);
      // play subtle tone once
      try { audioRef.current?.play?.(); } catch {}
      const t = setTimeout(() => setFlash(false), 1600);
      return () => clearTimeout(t);
    }
  }, [verdict]);

  const role = localStorage.getItem("qc_role"); // "checker" enables tel link

  function handleSubmit(e) {
    e.preventDefault();
    // Both must be YES to clear
    if (matchDot && answered) setVerdict("clear");
    else setVerdict("caution");
  }

  function requireLoginIfNoRole() {
    if (!role) nav("/login");
  }

  return (
    <div className={`verify-wrap ${verdict === "caution" && flash ? "flash" : ""}`}>
      <audio ref={audioRef} preload="auto">
        {/* 500ms neutral sine tone (tiny base64 wav) */}
        <source src="data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAABAAACaWQAAACAAAAAgP///wAAAP///wAAAP///wAAAP///wAA" type="audio/wav" />
      </audio>

      <header className="verify-header">
        <div className="brand">QueCab <span className="sub">AdbS</span></div>
        <div className="meta">
          {carrier && <div className="chip">{carrier}</div>}
          {loadId && <div className="chip">Load #{loadId}</div>}
        </div>
      </header>

      <main className="verify-main">
        <div className="dot-box">
          <div className="dot-label">USDOT#</div>
          <div className="dot-value">{dot || "—"}</div>
        </div>

        <div className="driver-card">
          <div className="driver-line">
            <span className="muted">Driver:</span>
            <strong>{driver || "—"}</strong>
          </div>

          <div className="driver-line">
            <span className="muted">Phone:</span>
            {role === "checker" ? (
              phone ? <a className="tel-link" href={`tel:${phone.replace(/[^0-9]/g,"")}`}>{phone}</a> : <span>—</span>
            ) : (
              <button className="tel-locked" onClick={requireLoginIfNoRole} title="Authorized personnel only">
                {phone || "—"} <span className="lock">🔒</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checks">
          <CheckRow
            label="DOES THE USDOT# ON THE TRUCK MATCH?"
            value={matchDot}
            setValue={setMatchDot}
          />
          <CheckRow
            label="DID THE DRIVER ANSWER THEIR PHONE?"
            value={answered}
            setValue={setAnswered}
          />

          <button className="submit">SUBMIT</button>
        </form>

        {verdict && (
          <ResultBanner verdict={verdict} />
        )}

        <SendActionPanel dot={dot} driver={driver} phone={phone} />
      </main>
    </div>
  );
}

function CheckRow({ label, value, setValue }) {
  return (
    <div className="check-row">
      <div className="label">{label}</div>
      <div className="yn">
        <button
          type="button"
          className={`yn-btn ${value === true ? "on" : ""}`}
          onClick={() => setValue(true)}
        >Y</button>
        <button
          type="button"
          className={`yn-btn ${value === false ? "on" : ""}`}
          onClick={() => setValue(false)}
        >N</button>
      </div>
    </div>
  );
}

function ResultBanner({ verdict }) {
  if (verdict === "clear") {
    return (
      <div className="result clear">
        <div className="title">CLEAR TO LOAD</div>
        <div className="desc">Both checks returned YES.</div>
      </div>
    );
  }
  return (
    <div className="result caution">
      <div className="title">CAUTION ALERT – DO NOT LOAD</div>
      <div className="desc">At least one check was NO. Escalate per policy.</div>
    </div>
  );
}

function SendActionPanel({ dot, driver, phone }) {
  const [open, setOpen] = useState(false);
  const [viaEmail, setViaEmail] = useState(true);
  const [viaSms, setViaSms] = useState(false);
  const [toEmail, setToEmail] = useState("");
  const [toSms, setToSms] = useState(phone || "");

  function sendNow() {
    // Hook into your existing mail/SMS back end here.
    // For now we console.log to prove flow without regressions.
    console.log("SEND:", { viaEmail, viaSms, toEmail, toSms, dot, driver, phone });
    setOpen(false);
    alert("Sent (demo). Wire to Email/SMS service in server.");
  }

  return (
    <div className="send-panel">
      <button className="send-btn" onClick={()=>setOpen(true)}>Send via Email / Text</button>
      {open && (
        <div className="modal-backdrop" onClick={()=>setOpen(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3 className="modal-title">Send Confirmation</h3>
            <label className="row">
              <input type="checkbox" checked={viaEmail} onChange={()=>setViaEmail(v=>!v)} />
              <span>Email</span>
            </label>
            {viaEmail && (
              <input
                className="input"
                placeholder="recipient@example.com"
                value={toEmail}
                onChange={(e)=>setToEmail(e.target.value)}
              />
            )}

            <label className="row mt">
              <input type="checkbox" checked={viaSms} onChange={()=>setViaSms(v=>!v)} />
              <span>Text (SMS)</span>
            </label>
            {viaSms && (
              <input
                className="input"
                placeholder="123-456-7890"
                value={toSms}
                onChange={(e)=>setToSms(formatPhone(e.target.value))}
              />
            )}

            <div className="modal-actions">
              <button className="ghost" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="primary" onClick={sendNow}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
