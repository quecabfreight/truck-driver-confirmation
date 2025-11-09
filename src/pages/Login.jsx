import React, { useEffect, useState } from "react";

const LS_EMAIL = "adbs_login_email";
const LS_CODE = "adbs_login_code";
const LS_REMEMBER = "adbs_login_remember";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  // Load saved values on first load
  useEffect(() => {
    const savedRemember = localStorage.getItem(LS_REMEMBER);
    const isRemembered = savedRemember === "true";
    setRemember(savedRemember === null ? true : isRemembered);

    if (isRemembered) {
      const savedEmail = localStorage.getItem(LS_EMAIL) || "";
      const savedCode = localStorage.getItem(LS_CODE) || "";
      setEmail(savedEmail);
      setCode(savedCode);
    }
  }, []);

  // Save as you type (only if remember = true)
  useEffect(() => {
    if (remember) {
      localStorage.setItem(LS_EMAIL, email || "");
      localStorage.setItem(LS_CODE, code || "");
      localStorage.setItem(LS_REMEMBER, "true");
    }
  }, [email, code, remember]);

  const toggleRemember = (checked) => {
    setRemember(checked);
    if (!checked) {
      // wipe saved data immediately
      localStorage.removeItem(LS_EMAIL);
      localStorage.removeItem(LS_CODE);
      localStorage.setItem(LS_REMEMBER, "false");
    } else {
      // save current values
      localStorage.setItem(LS_EMAIL, email || "");
      localStorage.setItem(LS_CODE, code || "");
      localStorage.setItem(LS_REMEMBER, "true");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Persist one more time on submit if remember is on
    if (remember) {
      localStorage.setItem(LS_EMAIL, email || "");
      localStorage.setItem(LS_CODE, code || "");
      localStorage.setItem(LS_REMEMBER, "true");
    }
    // (Phase 1) No real auth yet — stay on page
    // Later we’ll route after backend wires in.
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setCode(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => toggleRemember(e.target.checked)}
              style={{ width: 24, height: 24 }}
            />
            <label htmlFor="remember">Remember this device</label>
          </div>

          <button className="btn" type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}
