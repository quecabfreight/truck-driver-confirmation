// /src/pages/SiteLanding.jsx — NEW FILE
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SiteLanding() {
  const [mode, setMode] = useState("dark");
  useEffect(() => { document.title = "QueCab AdbS — Secure Your Load"; }, []);

  return (
    <div id="qc-site" data-mode={mode}>
      <style>{`
        /* Hard overrides so this page is full-bleed and unaffected by app shell */
        #qc-site{
          position:relative;
          width:100vw;
          margin-left:calc(50% - 50vw);
          margin-right:calc(50% - 50vw);
          min-height:100vh;
          color:#e9eef3;
          font-family: "Segoe UI", Roboto, system-ui, -apple-system, Arial, sans-serif;
          isolation:isolate;
          overflow-x:hidden;
          background:
            radial-gradient(1200px 600px at 20% -10%, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 60%),
            radial-gradient(1000px 500px at 100% 40%, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 60%),
            linear-gradient(135deg, #2b2e32 0%, #17191d 55%, #0e1013 100%);
          background-attachment: fixed;
        }
        #qc-site *, #qc-site *::before, #qc-site *::after { box-sizing:border-box; }

        .wrap{
          width:min(1280px, 96vw);
          max-width:1280px !important;  /* force wide on desktop */
          margin:0 auto;
          padding:28px 20px 80px;
        }

        header{ display:flex; align-items:center; justify-content:space-between; gap:16px; padding:6px 0 24px; }
        .brand{ display:flex; align-items:center; gap:14px; font-weight:900; letter-spacing:.4px; }
        .badge{
          width:58px; height:58px; border-radius:14px;
          background:
            radial-gradient(circle at 30% 30%, #7d8792, #3c4249 40%, #1b1e22 72%),
            linear-gradient(160deg, #9aa2aa, #464b52 45%, #1c2024);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 10px 32px rgba(0,0,0,.35);
        }
        .brand h1{ margin:0; font-size:clamp(28px,4vw,42px); line-height:1.05; text-shadow:0 0 24px rgba(0,255,162,.25); }
        .brand small{ display:block; color:#a8b3bf; font-weight:700; letter-spacing:.12em; margin-top:2px; }

        nav a, nav button{
          color:#e9eef3; text-decoration:none; font-weight:700;
          padding:10px 12px; border-radius:10px; margin-left:6px;
          border:1px solid rgba(255,255,255,.18); background:rgba(255,255,255,.03);
        }
        nav a:hover, nav button:hover{ background:rgba(255,255,255,.06); }

        .hero{
          position:relative; border-radius:22px; overflow:hidden;
          background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
          border:1px solid rgba(255,255,255,.08);
          box-shadow: 0 30px 90px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.12);
          padding: clamp(28px, 6vw, 56px);
        }
        .hero::after{
          content:""; position:absolute; inset:0;
          background:
            radial-gradient(500px 200px at 25% -5%, rgba(255,255,255,.22), transparent 60%),
            radial-gradient(700px 300px at 95% 0%, rgba(0,255,162,.15), transparent 60%);
          pointer-events:none;
        }
        .hero h2{ font-size: clamp(42px, 7vw, 86px); margin:0 0 12px; line-height:.98; }
        .hero p{ font-size: clamp(18px, 2.2vw, 24px); max-width: 900px; }

        .cta{ display:flex; gap:16px; margin-top:22px; flex-wrap:wrap; }
        .btn{ border:0; cursor:pointer; font-weight:900; letter-spacing:.02em; text-transform:uppercase; border-radius:14px; padding:16px 22px; transition:transform .15s ease, box-shadow .15s ease; }
        .btn-primary{ background:linear-gradient(180deg, #00ffa2, #39ffd3); color:#052017; box-shadow:0 12px 40px rgba(0,255,162,.35); }
        .btn-primary:hover{ transform:translateY(-1px) scale(1.02); box-shadow:0 16px 50px rgba(0,255,162,.45); }
        .btn-ghost{ background:rgba(255,255,255,.06); color:#e9eef3; border:1px solid rgba(255,255,255,.18); }

        .grid{ display:grid; gap:22px; margin-top:32px; grid-template-columns:repeat(12, 1fr); }
        .card{
          grid-column: span 12;
          background: rgba(10,12,14,.65);
          border:1px solid rgba(255,255,255,.08);
          border-radius:18px; padding:26px;
          box-shadow:0 20px 60px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.1);
        }
        .card h3{ margin:0 0 10px; font-size: clamp(24px, 3vw, 34px); color:#0cf6a0; }
        .card p{ margin:0; font-size: clamp(16px, 1.8vw, 20px); }

        @media(min-width:800px){
          .card--third { grid-column: span 4; }
          .card--half  { grid-column: span 6; }
        }

        .kpis{ display:flex; gap:16px; flex-wrap:wrap; margin-top:10px; }
        .kpi{ border:1px solid rgba(255,255,255,.12); border-radius:14px; background:rgba(255,255,255,.04); padding:12px 14px; min-width:170px; }
        .kpi b{ font-size:22px; display:block; }
        .kpi small{ color:#a8b3bf; font-weight:700; }

        .footer{ margin-top:60px; text-align:center; color:#a8b3bf; }
        .footer a{ color:#e9eef3; text-decoration:none; border-bottom:1px dashed rgba(255,255,255,.25); }
      `}</style>

      <div className="wrap">
        <header>
          <div className="brand">
            <div className="badge" aria-hidden="true" />
            <div>
              <h1>QueCab AdbS</h1>
              <small>SECURE YOUR LOAD</small>
            </div>
          </div>
          <nav>
            <Link to="/join">Request Access</Link>
            <Link to="/login">Log In</Link>
            <button onClick={() => setMode(m => m === "dark" ? "light" : "dark")}>
              {mode === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </nav>
        </header>

        <section className="hero">
          <h2>Verify before you load.<br/>Stop double-brokering cold.</h2>
          <p>
            QueCab AdbS™ confirms <strong>USDOT#</strong>, <strong>Plate</strong>, and live driver
            contact before any freight is loaded. Built for docks of any size — big text, clean
            screens, no gimmicks — so your team knows exactly when to <strong>CLEAR TO LOAD</strong> or
            <strong style={{color:"#ff5555"}}> DO NOT LOAD</strong>.
          </p>
          <div className="cta">
            <Link to="/join" className="btn btn-primary">Request Demo</Link>
            <Link to="/login" className="btn btn-ghost">Broker Log In</Link>
          </div>
          <div className="kpis" style={{marginTop:22}}>
            <div className="kpi"><b>1 Link</b><small>Driver ➜ Dock</small></div>
            <div className="kpi"><b>3 Checks</b><small>USDOT • Plate • Live call</small></div>
            <div className="kpi"><b>0 Nonsense</b><small>No training required</small></div>
          </div>
        </section>

        <section style={{marginTop:34}}>
          <div className="grid">
            <div className="card card--third">
              <h3>① Broker creates Verify Link</h3>
              <p>One link per shipment. Share via text or email — done in seconds.</p>
            </div>
            <div className="card card--third">
              <h3>② Driver taps + shows IDs</h3>
              <p>Dock compares USDOT# + Plate on screen with what they see.</p>
            </div>
            <div className="card card--third">
              <h3>③ Dock calls the driver</h3>
              <p>If the driver answers and data matches, it’s <b>CLEAR TO LOAD</b>. Any mismatch triggers a caution alert.</p>
            </div>
          </div>
        </section>

        <section style={{marginTop:12}}>
          <div className="grid">
            <div className="card card--half">
              <h3>Built for real docks</h3>
              <p>Large typography, ultra-high contrast, and ruthless simplicity. No training required.</p>
            </div>
            <div className="card card--half">
              <h3>Anti-fraud by design</h3>
              <p>Real-time checks and a single source of truth prevent identity swaps and load hijacks.</p>
            </div>
            <div className="card card--third">
              <h3>Instant setup</h3>
              <p>No hardware. No IT ticket. Create links and ship.</p>
            </div>
            <div className="card card--third">
              <h3>Clear audit trail</h3>
              <p>Every verification writes a record for ops, claims, and compliance.</p>
            </div>
            <div className="card card--third">
              <h3>Light/Dark ready</h3>
              <p>Works indoors, outdoors, and in cabs without blasting eyes at night.</p>
            </div>
          </div>
        </section>

        <section style={{marginTop:12}}>
          <div className="card" style={{textAlign:"center"}}>
            <h3 style={{fontSize:"clamp(26px,3.5vw,40px)"}}>Ready to make “Verify before you load” your default?</h3>
            <div className="cta" style={{justifyContent:"center", marginTop:16}}>
              <Link to="/join" className="btn btn-primary">Request Access</Link>
              <Link to="/login" className="btn btn-ghost">Broker Log In</Link>
            </div>
          </div>
        </section>

        <div className="footer">
          © {new Date().getFullYear()} QueCab AdbS™ — Secure Your Load
        </div>
      </div>
    </div>
  );
}
