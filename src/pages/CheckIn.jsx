// /src/pages/CheckIn.jsx — XL form, matches About scale
import React, { useState } from "react";

const XL = {
  base:{ fontSize:"60px", lineHeight:1.25 },
  wrap:{ maxWidth:"720px", margin:"0 auto" },
  logo:{ display:"block", width:"220px", maxWidth:"90vw", margin:"24px auto" },
  h1:{ fontSize:"69px", lineHeight:1.2, fontWeight:800, margin:"0 0 14px", textAlign:"center" },
  label:{ display:"inline-block", fontWeight:800, margin:"12px 0 6px" },
  input:{
    fontSize:"60px", lineHeight:1.25, color:"inherit",
    minHeight:"80px", padding:"0 28px",
    borderRadius:"14px", border:"1px solid rgba(255,255,255,0.10)",
    background:"rgba(17,17,19,0.6)", width:"100%"
  },
  row:{ display:"flex", justifyContent:"center", marginTop:"16px" },
  btn:{
    fontSize:"60px", lineHeight:1.25, fontWeight:800,
    minHeight:"80px", padding:"0 28px",
    borderRadius:"14px", border:"1px solid rgba(255,255,255,0.10)",
    background:"rgba(17,17,19,0.6)", color:"inherit", cursor:"pointer"
  }
};

export default function CheckIn() {
  const [dot, setDot] = useState("");
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");

  const handleGenerate = (e) => {
    e.preventDefault();
    alert(`Verify Link (placeholder)\nUSDOT: ${dot}\nPlate: ${plate}\nPhone: ${phone}`);
  };

  return (
    <div style={XL.base}>
      <div style={XL.logo}>
        <img src="/qc-logo.png" alt="QueCab AdbS logo" style={{ width:"100%", height:"auto", display:"block" }}/>
      </div>

      <section style={XL.wrap}>
        <h1 style={XL.h1}>Generate AdbS Truck-Driver Verification Link</h1>

        <form onSubmit={handleGenerate}>
          <label htmlFor="usdot" style={XL.label}>USDOT#</label>
          <input id="usdot" type="text" value={dot} onChange={(e)=>setDot(e.target.value)} style={XL.input} />

          <label htmlFor="plate" style={XL.label}>License Plate</label>
          <input id="plate" type="text" value={plate} onChange={(e)=>setPlate(e.target.value)} style={XL.input} />

          <label htmlFor="driverPhone" style={XL.label}>Driver Phone</label>
          <input id="driverPhone" type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} style={XL.input} />

          <div style={XL.row}>
            <button type="submit" style={XL.btn}>Generate AdbS Truck-Driver Verify Link</button>
          </div>
        </form>
      </section>
    </div>
  );
}
