import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LS_EMAIL = "qc_login_email";
const LS_REMEMBER = "qc_login_remember";
const LS_SESSION = "qc_session";

const normalizeEmail = (v) => (v || "").trim().toLowerCase();
const normalizeCode  = (v) => (v || "").trim().toUpperCase();

function parseAccessCode(raw) {
  const code = normalizeCode(raw).replace(/\s+/g, "");
  const withHyphens = code.includes("-")
    ? code
    : code.replace(/^QC(BRK|SHP)(\d{5})$/, "QC-$1-$2");
  const m = withHyphens.match(/^QC-(BRK|SHP)-(\d{5})$/i);
  if (!m) return null;
  const role = m[1].toUpperCase() === "BRK" ? "broker" : "shipper";
  return { role, code: `QC-${m[1].toUpperCase()}-${m[2]}` };
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If we already have a session, bounce to "/"
  useEffect(() => {
    try {
      const s = localStorage.getItem(LS_SESSION);
      if (s) {
        try { navigate("/", { replace: true }); } catch {}
        // Hard fallback in case SPA nav is ignored
        setTimeout(() => {
          if (window?.location?.pathname !== "/") window.location.replace("/");
        }, 10);
      }
    } catch {}
  }, [navigate]);

  // Prefill email/remember
  useEffect(() => {
    const r = localStorage.getItem(LS_REMEMBER);
    const e = localStorage.getItem(LS_EMAIL);
    if (r !== null) setRemember(r === "1");
    if (e) setEmail(e);
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const nEmail = normalizeEmail(email);
    const parsed = parseAccessCode(code);

    localStorage.setItem(LS_REMEMBER, remember ? "1" : "0");
    if (remember) localStorage.setItem(LS_EMAIL, nEmail);
    else localStorage.removeItem(LS_EMAIL);

    if (!nEmail) { setError("Enter your business email."); setSubmitting(false); return; }
    if (!parsed) { setError("Enter a valid access code (e.g., QC-BRK-12345)."); setSubmitting(false); return; }

    const session = { email: nEmail, role: parsed.role, code: parsed.code, ts: Date.now() };
    try { localStorage.setItem(LS_SESSION, JSON.stringify(session)); } catch {}

    // Try SPA navigate first
    try { navigate("/", { replace: true }); } catch {}
    // Then hard redirect immediately (no timeout)
    if (window?.location?.pathname !== "/") window.location.replace("/");
  }

  // ==== (styles + markup exactly as your last good version; trimmed for brevity) ====
  const page = { minHeight:"100vh", width:"100%", background:"var(--bg)", color:"var(--text)", display:"flex", flexDirection:"column", fontSize:"17px" };
  const watermarkWrap = { position:"relative", flex:1, width:"100%", display:"flex", justifyContent:"center", padding:"42px 16px", overflow:"hidden" };
  const watermark = { position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"url('/qc-logo.png')", backgroundRepeat:"no-repeat", backgroundPosition:"center 10%", backgroundSize:"min(70vmin, 680px)", opacity:0.06, filter:"grayscale(100%)" };
  const card = { position:"relative", width:"100%", maxWidth:560, background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, boxShadow:"0 42px 120px rgba(0,0,0,0.22)", padding:24, zIndex:1 };
  const header = { display:"flex", flexDirection:"column", alignItems:"center", gap:14 };
  const logoBox = { width:180, height:180, borderRadius:18, background:"linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.60))", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 18px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)" };
  const hTitle = { fontSize:"20px", fontWeight:900, letterSpacing:"-0.01em" };
  const hSub = { fontSize:"12px", fontWeight:800, color:"var(--muted)", letterSpacing:"0.08em", textTransform:"uppercase" };
  const form = { marginTop:12 }, row = { marginTop:16 };
  const label = { fontSize:"0.98rem", fontWeight:900, letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:8 };
  const input = { width:"100%", fontSize:"1.05rem", lineHeight:1.5, color:"var(--text)", background:"color-mix(in oklab, var(--card) 96%, white 4%)", border:"1px solid var(--border)", borderRadius:10, padding:"13px 14px", outline:"none", boxShadow:"inset 0 1px 2px rgba(0,0,0,0.06)" };
  const rememberRow = { display:"flex", alignItems:"center", gap:10, marginTop:8, color:"var(--muted)", fontSize:"13px", fontWeight:800 };
  const btn = { width:"100%", marginTop:18, fontSize:"1.05rem", fontWeight:900, letterSpacing:"0.06em", textTransform:"uppercase", color:"#e5e7eb", background:"linear-gradient(180deg, rgba(18,18,18,1), rgba(0,0,0,1))", border:"1px solid rgba(255,255,255,0.10)", borderRadius:12, padding:"13px 15px", cursor:"pointer", boxShadow:"0 18px 40px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)", opacity: submitting ? 0.7 : 1 };
  const linkRow = { marginTop:16, fontSize:"14px", color:"var(--muted)" };
  const err = { marginTop:10, color:"#ffb4b4", fontSize:"14px", fontWeight:900 };

  return (
    <div style={page}>
      <div style={watermarkWrap}>
        <div style={watermark} />
        <div style={card}>
          <div style={header}>
            <div style={logoBox}><img src="/qc-logo.png" alt="QueCab AdbS" style={{ width: 150, height: "auto", opacity: 0.92 }} /></div>
            <div style={hTitle}>QueCab AdbS</div>
            <div style={hSub}>Broker / Shipper Access</div>
          </div>
          <form onSubmit={onSubmit} style={form} noValidate>
            <div style={row}>
              <div style={label}>Business Email</div>
              <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" spellCheck="false" required />
            </div>
            <div style={row}>
              <div style={label}>Access Code</div>
              <input style={input} type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="QC-BRK-12345" required />
            </div>
            <div style={rememberRow}>
              <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <label htmlFor="remember">Remember this device</label>
            </div>
            {error && <div style={err}>{error}</div>}
            <button type="submit" style={btn} disabled={submitting}>{submitting ? "Signing in…" : "Sign In"}</button>
            <div style={linkRow}>Need access? <Link to="/join">Request Authorization</Link></div>
            <div style={{ marginTop: 6, color: "var(--muted)", fontSize: "12px" }}>
              Authorized use only; activity may be monitored and recorded. By continuing you consent to monitoring.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
