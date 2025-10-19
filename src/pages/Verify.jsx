import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { formatPhone } from "../utils/formatPhone";
import "./verify.css";

export default function Verify() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  // Accept both ?dot= and ?usdot= (either will work)
  const dot = params.get("dot") || params.get("usdot") || "";
  const driver = params.get("driver") || "";
  const phoneRaw = params.get("phone") || "";
  const carrier = params.get("carrier") || "";
  const loadId = params.get("load") || "";

  const phone = useMemo(() => formatPhone(phoneRaw), [phoneRaw]);

  const [matchDot, setMatchDot] = useState(null);
  const [answered, setAnswered] = useState(null);

  const [verdict, setVerdict] = useState(null);
  const [flash, setFlash] = useState(false);

  const audioRef = useRef(null);
  useEffect(() => {
    if (!verdict) return;
    if (verdict === "caution") {
      setFlash(true);
      try { audioRef.current?.play?.(); } catch {}
      const t = setTimeout(() => setFlash(false), 1600);
      return () => clearTimeout(t);
    }
  }, [verdict]);

  const role = localStorage.getItem("qc_role");

  function handleSubmit(e) {
    e.preventDefault();
    if (matchDot && answered) setVerdict("clear");
    else setVerdict("caution");
  }

  function requireLoginIfNoRole() {
    if (!role) nav("/login");
  }

  return (
    <div className={`verify-wrap ${verdict === "caution" && flash ? "flash" : ""}`}>
      <audio ref={audioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAABAAACaWQAAACAAAAAgP///wAAAP///wAAAP///wAAAP///wAA"
          type="audio/wav"
        />
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
              phone ? (
                <a className="tel-link" href={`tel:${phone.replace(/[^0-9]/g, "")}`}>{phone}</a>
              ) : (
                <span>—</span>
              )
            ) : (
              <button
                className="tel-locked"
                onClick={requireLoginIfNoRole}
                title="Authorized personnel only"
              >
                {phone || "—"} <span className="lock">🔒</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checks">
          <CheckRow label="DOES THE USDOT# ON THE TRUCK MATCH?" value={matchDot} setValue={setMatchDot} />
          <CheckRow label="DID THE DRIVER ANSWER THEIR PHONE?" value={answered} setValue={setAnswered} />
          <button className="submit">SUBMIT</button>
        </form>

        {verdict && <ResultBanner verdict={verdict} />}

        <div className="verify-footer-link">
          <Link to="/join" className="footer-cta">Join QueCab AdbS</Link>
        </div>
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
