import { useMemo, useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

/* -----------------------
   Local storage helpers (demo)
------------------------ */
function loadOrgs() {
  return JSON.parse(localStorage.getItem("qca_orgs") || "[]");
}
function isOrgActive(org_id) {
  const org = loadOrgs().find(o => o.org_id === org_id);
  return !!org && org.status === "active";
}
function loadAuthByCode(code) {
  const all = JSON.parse(localStorage.getItem("qca_auth") || "[]");
  return all.find(a => a.code === code) || null;
}

/* -----------------------
   Component
------------------------ */
export default function Verify() {
  // Read params ?usdot=...&phone=...&code=...&ref=...
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const usdotExpected = (params.get("usdot") || "1234567").trim();
  const phoneRaw = (params.get("phone") || "").trim();
  const phone = phoneRaw.replace(/[^\d+]/g, "");
  const code = (params.get("code") || "").trim().toUpperCase();

  // Look up the authorization record by code (issued on /issue)
  const record = code ? loadAuthByCode(code) : null;

  // Validate code + expiry + org status
  const codeFound = !!record;
  const notExpired = record ? Date.now() < record.expiresAt : false;
  const orgOk = record ? isOrgActive(record.org_id) : false;
  const allow = codeFound && notExpired && orgOk;

  // Form state
  const [usdotOnTruck, setUsdotOnTruck] = useState("");
  const [truckMatches, setTruckMatches] = useState(false);
  const [answeredPhone, setAnsweredPhone] = useState(false);
  const [result, setResult] = useState(null); // "clear" | "caution" | null

  // Staff-only unlock for phone link
  const [staffUnlocked, setStaffUnlocked] = useState(false);
  const [pin, setPin] = useState("");

  // Live match logic (green check / red X)
  const typed = useMemo(() => usdotOnTruck.trim(), [usdotOnTruck]);
  const hasTyped = typed.length > 0;
  const isMatch = hasTyped && typed === usdotExpected;

  useEffect(() => {
    setTruckMatches(isMatch);
  }, [isMatch]);

  // green flash when it first becomes correct
  const inputRef = useRef(null);
  const prevMatch = useRef(false);
  useEffect(() => {
    if (!prevMatch.current && isMatch && inputRef.current) {
      inputRef.current.classList.remove("okFlash");
      inputRef.current.offsetWidth; // restart animation
      inputRef.current.classList.add("okFlash");
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = 880;
        o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.02);
        o.start(); o.stop(ctx.currentTime + 0.12);
      } catch {}
    }
    prevMatch.current = isMatch;
  }, [isMatch]);

  function handleStaffUnlock(e) {
    e.preventDefault();
    if (pin === "2468") {
      setStaffUnlocked(true);
      setPin("");
    } else {
      setStaffUnlocked(false);
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = 420;
        o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.02);
        o.start(); o.stop(ctx.currentTime + 0.15);
      } catch {}
    }
  }

  function submitCheck(e) {
    e.preventDefault();
    if (isMatch && answeredPhone) {
      setResult("clear");
    } else {
      setResult("caution");
      const el = document.getElementById("caution-banner");
      if (el) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle"; o.frequency.value = 520;
        o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
        o.start(); o.stop(ctx.currentTime + 0.18);
      } catch {}
    }
  }

  // styles
  const card = { maxWidth: 860, margin: "40px auto", padding: 24, borderRadius: 16, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,.08)", fontFamily: "system-ui, sans-serif" };
  const label = { display: "block", marginBottom: 14 };
  const inputBase = { width: "100%", marginTop: 6, padding: 12, borderRadius: 10, border: "1px solid #ddd", fontSize: 18, outline: "none" };
  const inputStyle = {
    ...inputBase,
    border: isMatch ? "2px solid #2E7D32" : hasTyped ? "2px solid #C62828" : inputBase.border,
    boxShadow: isMatch ? "0 0 0 4px rgba(46,125,50,.12)" : hasTyped ? "0 0 0 4px rgba(198,40,40,.08)" : "none"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f8", padding: 24 }}>
      {result === "caution" && (
        <div id="caution-banner" style={{ position: "sticky", top: 0, zIndex: 10, margin: "-24px -24px 24px -24px", padding: "18px 24px", fontWeight: 900, textAlign: "center", letterSpacing: 0.5, color: "#fff", background: "#C62828" }} className="caution-banner">
          CAUTION ALERT — DO NOT LOAD
        </div>
      )}

      <div style={card}>
        {/* guard message if not allowed */}
        {!allow && (
          <div style={{ marginBottom: 16, padding: 14, borderRadius: 10, background: "#FFEBEE", color: "#B71C1C", fontWeight: 800 }}>
            Authorization missing/expired or organization not active.
            Ask the broker/shipper to issue a new code.
          </div>
        )}

        {/* header + staff unlock */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 28, fontWeight: 800, flex: 1 }}>QueCab AdbS</div>
          <details style={{ textAlign: "right" }}>
            <summary style={{ cursor: "pointer", opacity: 0.7 }}>For Staff</summary>
            <form onSubmit={handleStaffUnlock} style={{ marginTop: 8 }}>
              <input
                inputMode="numeric"
                placeholder="PIN (2468)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                style={{ padding: 6, borderRadius: 8, border: "1px solid #ccc", width: 120, marginRight: 8 }}
              />
              <button type="submit" style={{ padding: "6px 10px", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                Unlock
              </button>
              {staffUnlocked && <span style={{ marginLeft: 10, fontWeight: 700, color: "#2E7D32" }}>Unlocked</span>}
            </form>
          </details>
        </div>

        {/* expected USDOT */}
        <div style={{ marginBottom: 16, background: "#f4f5f7", padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>EXPECTED USDOT#</div>
          <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 1 }}>{usdotExpected}</div>
        </div>

        {/* everything below is disabled if not allowed */}
        <div style={{ opacity: allow ? 1 : .6, pointerEvents: allow ? "auto" : "none" }}>
          <form onSubmit={submitCheck}>
            <label style={label}>
              <span style={{ fontWeight: 700 }}>Enter USDOT# seen on truck</span>
              <div style={{ position: "relative" }}>
                <input
                  ref={inputRef}
                  style={inputStyle}
                  value={usdotOnTruck}
                  onChange={(e) => setUsdotOnTruck(e.target.value)}
                  inputMode="numeric"
                  placeholder="Type the USDOT number on the truck"
                  required
                />
                {hasTyped && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      fontSize: 22, fontWeight: 900,
                      color: isMatch ? "#2E7D32" : "#C62828", userSelect: "none"
                    }}
                    title={isMatch ? "Matches" : "Does not match"}
                  >
                    {isMatch ? "✓" : "✕"}
                  </span>
                )}
              </div>
            </label>

            <div style={{ display: "grid", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" checked={truckMatches} onChange={(e) => setTruckMatches(e.target.checked)} />
                <span style={{ fontWeight: 800 }}>DOES THE USDOT# ON THE TRUCK MATCH?</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" checked={answeredPhone} onChange={(e) => setAnsweredPhone(e.target.checked)} />
                <span style={{ fontWeight: 800 }}>DID THE DRIVER ANSWER THEIR PHONE?</span>
              </label>
            </div>

            <button type="submit" style={{ marginTop: 18, width: "100%", padding: 14, border: 0, borderRadius: 12, fontWeight: 800, cursor: "pointer", background: "#111", color: "#fff" }}>
              Submit
            </button>
          </form>

          {result === "clear" && (
            <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: "#E8F5E9", color: "#1B5E20", fontWeight: 800 }}>
              ✅ CLEAR TO LOAD
            </div>
          )}
          {result === "caution" && (
            <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: "#FFEBEE", color: "#B71C1C", fontWeight: 800 }}>
              ⚠️ CAUTION ALERT — DO NOT LOAD
            </div>
          )}

          {phone && staffUnlocked && (
            <div style={{ marginTop: 14 }}>
              <a href={`tel:${phone}`} style={{ fontWeight: 800, textDecoration: "none" }}>
                📞 Call Driver: {formatPhone(phone)}
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .flash { animation: qcFlash 0.8s ease-in-out 0s 2 alternate; }
        @keyframes qcFlash { 0%{filter:brightness(1)} 50%{filter:brightness(1.35)} 100%{filter:brightness(1)} }
        .okFlash { animation: okPulse .5s ease-out 0s 1; }
        @keyframes okPulse { 0% { box-shadow: 0 0 0 0 rgba(46,125,50,.0); } 50% { box-shadow: 0 0 0 8px rgba(46,125,50,.18); } 100% { box-shadow: 0 0 0 0 rgba(46,125,50,.0); } }
      `}</style>
    </div>
  );
}

function formatPhone(p) {
  const d = p.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) return `+1 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  return p;
}
