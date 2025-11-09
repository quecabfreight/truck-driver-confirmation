import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LS_EMAIL = "adbs_login_email";
const LS_CODE = "adbs_login_code";
const LS_REMEMBER = "adbs_login_remember";

// auto-format codes like QC-BRK-51164
function formatAccessCode(raw) {
  const cleaned = (raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const m = cleaned.match(/^([A-Z]*)(\d*)$/);
  if (!m) return cleaned;
  const letters = m[1] || "", digits = m[2] || "";
  if (letters.length >= 5) {
    const p1 = letters.slice(0,2), p2 = letters.slice(2,5), rest = letters.slice(5);
    return p1 + (letters.length>2?("-"+p2):"") + rest + (digits?("-"+digits):"");
  }
  if (letters.length <= 2) return letters + (letters.length===2 && digits?("-"+digits):digits);
  const p1 = letters.slice(0,2), p2 = letters.slice(2);
  return p1 + "-" + p2 + (digits?("-"+digits):"");
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
    // minimal guard: need something in both fields
    if (!email.trim() || !code.trim()) {
      alert("Enter Email and Access Code.");
      return;
    }
    // force remember so /smart becomes available immediately
    localStorage.setItem(LS_EMAIL, email.trim());
    localStorage.setItem(LS_CODE, code.trim());
    localStorage.setItem(LS_REMEMBER, "true");
    setRemember(true);
    // go straight to Check In
    navigate("/smart");
  };

  const toggleRemember = (checked) => {
    setRemember(checked);
    if (!checked) {
      localStorage.removeItem(LS_EMAIL);
      localStorage.removeItem(LS_CODE);
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
            <input
              className="input"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
            />
          </div>
          <div>
            <label>Access Code</label>
            <input
              className="input"
              placeholder="Enter access code"
              value={code}
              onChange={onCodeChange}
              autoCapitalize="characters"
              autoCorrect="off"
              inputMode="text"
            />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e)=>toggleRemember(e.target.checked)}
              style={{ width:24, height:24 }}
            />
            <label htmlFor="remember">Remember this device</label>
          </div>
          <button className="btn" type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}
