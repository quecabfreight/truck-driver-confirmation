import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LS_EMAIL, LS_CODE, LS_REMEMBER, LS_ROLE, getRoleFromCode } from "../utils/auth";

// auto-format codes like QC-BRK-51164 (keeps your hyphens behavior)
function formatAccessCode(raw) {
  const cleaned = (raw || "").toUpperCase().replace(/[^A-Z0-9-]/g, "");
  // if user types without hyphens, try to insert after QC and BRK/SHP
  if (!cleaned.includes("-") && cleaned.length >= 5) {
    const m = cleaned.match(/^(QC)?([A-Z]{3})?(\d.*)$/);
    if (m) {
      const qc = m[1] ? "QC" : cleaned.startsWith("QC") ? "QC" : "";
      const seg = m[2] || "";
      const rest = m[3] || "";
      if (qc && (seg === "BRK" || seg === "SHP")) return `${qc}-${seg}-${rest}`;
    }
  }
  return cleaned;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    const r = localStorage.getItem(LS_REMEMBER) === "true";
    setRemember(localStorage.getItem(LS_REMEMBER) === null ? true : r);
    if (r) {
      setEmail(localStorage.getItem(LS_EMAIL) || "");
      setCode(localStorage.getItem(LS_CODE) || "");
    }
  }, []);

  const onCodeChange = (e) => setCode(formatAccessCode(e.target.value));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !code.trim()) { alert("Enter Email and Access Code."); return; }

    const role = getRoleFromCode(code);
    if (!role) { alert("Access Code invalid for role. Use a QC-BRK-… or QC-SHP-… code."); return; }

    localStorage.setItem(LS_EMAIL, email.trim());
    localStorage.setItem(LS_CODE, code.trim());
    localStorage.setItem(LS_REMEMBER, "true");
    localStorage.setItem(LS_ROLE, role);

    navigate("/smart"); // brokers/shippers land on the tool
  };

  const toggleRemember = (checked) => {
    setRemember(checked);
    if (!checked) {
      localStorage.removeItem(LS_EMAIL);
      localStorage.removeItem(LS_CODE);
      localStorage.removeItem(LS_ROLE);
      localStorage.setItem(LS_REMEMBER, "false");
    } else {
      localStorage.setItem(LS_EMAIL, email.trim());
      localStorage.setItem(LS_CODE, code.trim());
      localStorage.setItem(LS_REMEMBER, "true");
    }
  };

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>Log In</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)}
                   autoCapitalize="none" autoCorrect="off" inputMode="email" />
          </div>
          <div>
            <label>Access Code</label>
            <input className="input" placeholder="Enter access code"
                   value={code} onChange={onCodeChange} autoCapitalize="characters" autoCorrect="off" />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <input id="remember" type="checkbox" checked={remember}
                   onChange={(e)=>toggleRemember(e.target.checked)} style={{ width:24, height:24 }} />
            <label htmlFor="remember">Remember this device</label>
          </div>
          <button className="btn" type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}
