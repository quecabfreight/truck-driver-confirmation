import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PublicSite() {
  useEffect(() => { document.title = "QueCab AdbS — Secure Your Load"; }, []);
  const [year] = useState(new Date().getFullYear());

  return (
    <div id="qsite">
      <style>{`
        #qsite, #qsite * { box-sizing: border-box; }
        #qsite { 
          --bg:#0b0d11; --fg:#eaf2f2; --muted:rgba(234,242,242,.76);
          --brand:#00ffa2; --brand2:#00c2ff; --ink:#07110c;
          --card:rgba(255,255,255,.06); --stroke:rgba(255,255,255,.12);
          font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color: var(--fg); background:
            radial-gradient(1200px 600px at 80% -20%, rgba(0,255,162,.14), transparent 60%),
            radial-gradient(900px 500px at 10% -10%, rgba(0,194,255,.12), transparent 60%),
            var(--bg);
          font-size: 18px; line-height: 1.6;
        }
        #qsite a { color: inherit; text-decoration: none; }
        #qsite .wrap { max-width: 1240px; margin: 0 auto; padding: 0 24px; }
        #qsite h1 { font-size: 64px; line-height: 1.05; margin: 0 0 16px; font-weight: 900; }
        #qsite h2 { font-size: 40px; line-height: 1.15; margin: 0 0 16px; font-weight: 900; }
        #qsite h3 { font-size: 22px; line-height: 1.25; margin: 0 0 8px; font-weight: 800; }
        #qsite p  { margin: 0 0 12px; color: var(--muted); }
        #qsite .section { padding: 72px 0; }
        #qsite .navWrap{position:sticky;top:0;z-index:10;backdrop-filter:saturate(140%) blur(10px);
          background:linear-gradient(180deg,rgba(11,13,17,.88),rgba(11,13,17,.62));border-bottom:1px solid var(--stroke)}
        #qsite .nav{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0;}
        #qsite .brand{display:flex;align-items:center;gap:12px;}
        #qsite .brand img{width:44px;height:44px}
        #qsite .brandName{font-weight:900;letter-spacing:.2px}
        #qsite .navLinks{display:flex;gap:16px;flex-wrap:wrap}
        #qsite .btn{padding:10px 14px;border-radius:12px;border:1px solid var(--stroke);background:rgba(255,255,255,.04)}
        #qsite .btnGhost{padding:10px 14px;border-radius:12px;border:1px solid var(--stroke);background:transparent}
        #qsite .btnPrimary{padding:12px 16px;border-radius:12px;font-weight:900;color:var(--ink);
          background:linear-gradient(180deg,var(--brand),#00d48a);border:1px solid var(--brand);box-shadow:0 12px 30px rgba(0,255,162,.25)}
        #qsite .hero{display:grid;grid-template-columns:1.1fr .9fr;gap:28px;align-items:center}
        #qsite .heroCard{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));
          border:1px solid var(--stroke);border-radius:18px;padding:24px;text-align:center;box-shadow:0 18px 40px rgba(0,0,0,.35)}
        #qsite .heroLogo{width:300px;max-width:90%;margin-bottom:10px}
        #qsite .grid3{display:grid;gap:18px;grid-template-columns:repeat(3,minmax(0,1fr))}
        #qsite .grid2{display:grid;gap:18px;grid-template-columns:repeat(2,minmax(0,1fr))}
        #qsite .card{background:var(--card);border:1px solid var(--stroke);border-radius:16px;padding:18px}
        #qsite .steps{display:grid;gap:16px}
        #qsite .step{display:grid;grid-template-columns:72px 1fr;gap:16px;align-items:start}
        #qsite .dot{width:72px;height:72px;border-radius:12px;display:grid;place-items:center;font-weight:900;color:var(--ink);
          background:linear-gradient(160deg,var(--brand) 0%, var(--brand2) 100%);box-shadow:0 8px 20px rgba(0,0,0,.35)}
        #qsite .tier{border-radius:16px;padding:20px;border:1px solid var(--stroke);background:var(--card)}
        #qsite .tier.hot{border:2px solid var(--brand);background:linear-gradient(180deg,rgba(0,255,162,.16),rgba(0,255,162,.06));
          box-shadow:0 14px 34px rgba(0,255,162,.22)}
        #qsite .price{font-size:34px;font-weight:900}
        #qsite .quote{font-style:italic}
        #qsite footer{border-top:1px solid var(--stroke);padding:28px 0;background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,0))}
        #qsite .footRow{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
        @media (max-width:1000px){#qsite h1{font-size:44px} #qsite .hero{grid-template-columns:1fr}
          #qsite .grid3,#qsite .grid2{grid-template-columns:1fr} #qsite .section{padding:56px 0}}
      `}</style>

      <div className="navWrap">
        <div className="wrap nav">
          <div className="brand">
            <img src="/qc-logo.png" alt="QueCab AdbS" />
            <div className="brandName">QueCab AdbS™</div>
          </div>
          <div className="navLinks">
            <a href="#how" className="btn">How it works</a>
            <a href="#features" className="btn">Features</a>
            <a href="#pricing" className="btn">Pricing</a>
            <a href="#faq" className="btn">FAQ</a>
            <Link to="/login" className="btn">Log in</Link>
            <Link to="/join" className="btnPrimary">Request Access</Link>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="wrap hero">
          <div>
            <h1>Verify the truck. Load the right freight.</h1>
            <p>One link confirms <b>USDOT#</b>, <b>carrier</b>, and <b>driver identity</b>. Built for docks of any size — big text, clean screens, and a clear result:
              <b> CLEAR TO LOAD</b> or <b>DO NOT LOAD</b>.
            </p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:14}}>
              <Link to="/join" className="btnPrimary">Request Demo / Join</Link>
              <Link to="/checkin" className="btnGhost">Generate Verify Link</Link>
              <Link to="/about" className="btn">See Details</Link>
            </div>
          </div>
          <div className="heroCard">
            <img src="/qc-logo.png" alt="QueCab emblem" className="heroLogo" />
            <div style={{fontWeight:900,opacity:.9}}>QueCab AdbS™ — Secure Your Load</div>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop:24}}>
        <div className="wrap grid3">
          <div className="card" style={{textAlign:"center"}}><div style={{fontSize:38,fontWeight:900}}>1 Link</div><div>Driver & Dock share the same simple flow</div></div>
          <div className="card" style={{textAlign:"center"}}><div style={{fontSize:38,fontWeight:900}}>3 Checks</div><div>USDOT# • Plate • Live driver call</div></div>
          <div className="card" style={{textAlign:"center"}}><div style={{fontSize:38,fontWeight:900}}>0 Nonsense</div><div>Big text. No training. No guesswork.</div></div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="wrap">
          <h2>Built for real docks</h2>
          <div className="grid3">
            <div className="card"><h3>Dock-ready UI</h3><p>Readable at a glance. Designed for noisy, fast-moving floors — not office monitors.</p></div>
            <div className="card"><h3>Proof of call</h3><p>Dock marks whether the driver answered. Eliminate “we tried” gray areas.</p></div>
            <div className="card"><h3>Outcome signal</h3><p>Clear green vs red result: <b>CLEAR TO LOAD</b> or <b>DO NOT LOAD</b>. No ambiguity.</p></div>
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="wrap">
          <h2>How it works</h2>
          <div className="steps">
            <div className="card step"><div className="dot">1</div><div><b>Create an AdbS Verify Link</b> for each shipment. Share it by text — no login needed for drivers.</div></div>
            <div className="card step"><div className="dot">2</div><div><b>Driver confirms identity</b> with USDOT# & License Plate. Dock types what they see on the truck.</div></div>
            <div className="card step"><div className="dot">3</div><div>Dock <b>calls the driver</b>. All “Yes” → CLEAR TO LOAD; any “No” → DO NOT LOAD. Alerts go to the broker/shipper.</div></div>
          </div>
        </div>
      </section>

      <section id="pricing" className="section">
        <div className="wrap">
          <h2>Pricing</h2>
          <div className="grid3">
            <div className="tier">
              <div style={{display:"flex",justifyContent:"space-between"}}><h3>Starter</h3><div className="price">$— /mo</div></div>
              <ul><li>Single dock</li><li>Core verification flow</li></ul>
              <div style={{marginTop:10}}><Link to="/join" className="btnPrimary">Start</Link></div>
            </div>
            <div className="tier hot">
              <div style={{display:"flex",justifyContent:"space-between"}}><h3>Pro</h3><div className="price">$— /mo</div></div>
              <ul><li>Multiple docks</li><li>Alerts + simple reporting</li></ul>
              <div style={{marginTop:10}}><Link to="/join" className="btnPrimary">Upgrade</Link></div>
            </div>
            <div className="tier">
              <div style={{display:"flex",justifyContent:"space-between"}}><h3>Enterprise</h3><div className="price">Custom</div></div>
              <ul><li>SSO + integrations</li><li>Contract support</li></ul>
              <div style={{marginTop:10}}><Link to="/join" className="btnPrimary">Talk to us</Link></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>What operations folks say</h2>
          <div className="grid2">
            <div className="card quote">“Dock team got it in 2 minutes. No training, just worked. The red ‘Do Not Load’ saved us a headache the first week.”
              <div style={{marginTop:8,fontStyle:"normal",opacity:.8}}>— Ops Manager, Regional Shipper</div>
            </div>
            <div className="card quote">“It cut the back-and-forth. We send one link, the dock verifies, done. Cleaner proof for our carrier partners too.”
              <div style={{marginTop:8,fontStyle:"normal",opacity:.8}}>— Senior Broker, Freight Desk</div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <div className="wrap">
          <h2>FAQ</h2>
          <div className="grid2">
            <div className="card"><h3>Do drivers need an app?</h3><p>No. They tap a link sent by text. Done.</p></div>
            <div className="card"><h3>What if the dock can’t reach the driver?</h3><p>Mark “No” to the call question. The system flags DO NOT LOAD.</p></div>
            <div className="card"><h3>Does this replace our TMS?</h3><p>No. It runs alongside your ops. Pro/Enterprise can integrate later.</p></div>
            <div className="card"><h3>Who can request access?</h3><p>Brokers & shippers only. Drivers don’t need accounts.</p></div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap" style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
          <div><h3 style={{margin:0}}>QueCab AdbS™</h3><div style={{opacity:.8}}>Secure your load — verify before you load.</div></div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Link to="/join" className="btnPrimary">Request Access</Link>
            <Link to="/checkin" className="btn">Generate Verify Link</Link>
            <Link to="/about" className="btn">How it works</Link>
            <Link to="/login" className="btn">Log in</Link>
          </div>
        </div>
        <div className="wrap" style={{marginTop:16,opacity:.7}}>© {year} QueCab AdbS — All rights reserved.</div>
      </footer>
    </div>
  );
}
