import React from "react";
import { Link } from "react-router-dom";

/* Self-contained styles so nothing else gets touched */
const S = {
  page:{ fontSize:"60px", lineHeight:1.25 },
  wrap:{ maxWidth:"1200px", margin:"0 auto", padding:"0 24px" },
  logo:{ display:"block", width:"320px", maxWidth:"90vw", margin:"28px auto 16px" },
  h1:{ fontSize:"82px", lineHeight:1.05, fontWeight:900, textAlign:"center", margin:"0 0 14px" },
  sub:{ fontSize:"60px", textAlign:"center", margin:"0 auto 28px", maxWidth:"1000px", opacity:0.95 },
  ctas:{ display:"flex", flexDirection:"column", alignItems:"center", gap:"18px", marginTop:"10px" },
  btn:{ fontSize:"60px", fontWeight:800, minHeight:"80px", padding:"0 28px",
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        textDecoration:"none", color:"inherit",
        borderRadius:"14px", border:"1px solid rgba(255,255,255,0.10)", background:"rgba(17,17,19,0.6)" },
  h2:{ fontSize:"69px", lineHeight:1.1, fontWeight:900, margin:"36px 0 12px" },
  grid3:{ display:"grid", gap:"18px", gridTemplateColumns:"1fr", marginTop:"6px" },
  card:{ border:"1px solid rgba(255,255,255,0.10)", borderRadius:"14px", padding:"18px 22px", background:"rgba(17,17,19,0.45)" },
  li:{ margin:"0 0 8px" },
  foot:{ textAlign:"center", margin:"40px 0 24px", fontWeight:700, opacity:.9 }
};

export default function PublicSite(){
  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS logo" style={S.logo} />

        <h1 style={S.h1}>QueCab AdbS — Truck-Driver Confirmation</h1>
        <p style={S.sub}>
          Secure your load — verify before you load. Instantly confirm USDOT#, carrier, and driver identity to stop double-brokering.
        </p>

        <div style={S.ctas}>
          <Link to="/join"   style={S.btn}>Request Access</Link>
          <Link to="/login"  style={S.btn}>Log In</Link>
          <Link to="/checkin"style={S.btn}>Generate Verify Link</Link>
          <Link to="/about"  style={S.btn}>How It Works (details)</Link>
        </div>

        <h2 style={S.h2}>How It Works</h2>
        <div style={S.grid3}>
          <div style={S.card}>
            <strong>1) Create Verify Link</strong>
            <ul><li style={S.li}>Broker/Shipper makes one link per shipment.</li></ul>
          </div>
          <div style={S.card}>
            <strong>2) Driver Receives Link</strong>
            <ul><li style={S.li}>Gets it by text, taps, confirms identity.</li></ul>
          </div>
          <div style={S.card}>
            <strong>3) Dock Confirms</strong>
            <ul>
              <li style={S.li}>Types USDOT# & Plate, calls driver, submits.</li>
              <li style={S.li}>All “Yes” → <b>CLEAR TO LOAD</b>. Any “No” → <b>DO NOT LOAD</b>.</li>
            </ul>
          </div>
        </div>

        <h2 style={S.h2}>Pricing</h2>
        <div style={{...S.grid3, gridTemplateColumns:"1fr"}}>
          <div style={S.card}>
            <strong>Starter</strong>
            <ul>
              <li style={S.li}>Single dock / low volume</li>
              <li style={S.li}>Core verification workflow</li>
            </ul>
          </div>
          <div style={S.card}>
            <strong>Pro</strong>
            <ul>
              <li style={S.li}>Multiple docks / higher volume</li>
              <li style={S.li}>Alerts + simple reporting</li>
            </ul>
          </div>
          <div style={S.card}>
            <strong>Enterprise</strong>
            <ul>
              <li style={S.li}>Ops integrations + SSO</li>
              <li style={S.li}>Custom terms & support</li>
            </ul>
          </div>
        </div>

        <div style={{...S.ctas, marginTop:"22px"}}>
          <Link to="/join" style={S.btn}>Request Demo / Join Waitlist</Link>
        </div>

        <h2 style={S.h2}>Press · Partners · Contact</h2>
        <div style={S.card}>
          <div style={{display:"grid", gap:"10px"}}>
            <div><b>Press</b>: media@quecabadbs.com</div>
            <div><b>Partners</b>: partners@quecabadbs.com</div>
            <div><b>General</b>: hello@quecabadbs.com</div>
          </div>
        </div>

        <div style={S.foot}>© {new Date().getFullYear()} QueCab AdbS — Secure Your Load</div>
      </div>
    </div>
  );
}
