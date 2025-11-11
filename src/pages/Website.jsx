// /src/pages/Website.jsx — public website
import React from "react";

const S = {
  base:{ fontSize:"60px", lineHeight:1.25 },
  wrap:{ maxWidth:"1200px", margin:"0 auto", padding:"0 20px" },
  logo:{ display:"block", width:"260px", maxWidth:"90vw", margin:"34px auto 10px" },
  h1:{ fontSize:"76px", lineHeight:1.1, fontWeight:900, textAlign:"center", margin:"6px 0 14px" },
  sub:{ fontSize:"60px", fontWeight:600, textAlign:"center", margin:"0 auto 28px", maxWidth:"980px" },
  ctas:{ display:"flex", flexDirection:"column", alignItems:"center", gap:"18px", marginTop:"10px" },
  btn:{
    fontSize:"60px", lineHeight:1.25, fontWeight:800,
    minHeight:"80px", padding:"0 28px",
    textDecoration:"none", color:"inherit",
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    borderRadius:"14px", border:"1px solid rgba(255,255,255,0.10)",
    background:"rgba(17,17,19,0.6)"
  },
  h2:{ fontSize:"69px", lineHeight:1.15, fontWeight:800, margin:"26px 0 10px" },
  p:{ margin:"0 0 12px" },
  li:{ margin:"0 0 8px" },
  footer:{ margin:"40px 0 24px", textAlign:"center", fontWeight:700, opacity:.9 }
};

export default function Website(){
  return (
    <div style={S.base}>
      <div style={S.wrap}>
        <div style={S.logo}>
          <img src="/qc-logo.png" alt="QueCab AdbS logo" style={{ width:"100%", height:"auto", display:"block" }}/>
        </div>

        <h1 style={S.h1}>QueCab AdbS — Truck-Driver Confirmation</h1>
        <p style={S.sub}>
          Secure your load — verify before you load. Instantly confirm USDOT#, carrier, and driver identity to stop double-brokering.
        </p>

        <div style={S.ctas}>
          <a href="#/join"  style={S.btn}>Request Access</a>
          <a href="#/login" style={S.btn}>Log In</a>
          <a href="#/checkin" style={S.btn}>Generate Verify Link</a>
          <a href="#/about" style={S.btn}>How It Works</a>
        </div>

        <h2 style={S.h2}>What it is</h2>
        <p style={S.p}>Brokers & Shippers helping dock staff confirm the proper trucks and drivers with giant, clean screens.</p>

        <h2 style={S.h2}>How it works</h2>
        <ol style={{ paddingLeft:"1.2em", margin:0 }}>
          <li style={S.li}>Broker/Shipper creates one Verify Link per shipment.</li>
          <li style={S.li}>Driver gets the link by text and taps it.</li>
          <li style={S.li}>Dock opens the link, types USDOT# & Plate, calls the driver, then submits.</li>
        </ol>

        <h2 style={S.h2}>Results</h2>
        <ul style={{ paddingLeft:"1.2em", margin:0 }}>
          <li style={S.li}>All “Yes” → <strong>CLEAR TO LOAD.</strong></li>
          <li style={S.li}>Any “No” → <strong>CAUTION ALERT — DO NOT LOAD.</strong> (subtle red flash + tone to broker)</li>
        </ul>

        <div style={S.footer}>© {new Date().getFullYear()} QueCab AdbS — Secure Your Load</div>
      </div>
    </div>
  );
}
