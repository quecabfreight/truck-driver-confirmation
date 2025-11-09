import React, { useEffect, useState } from "react";

const LS_EMAIL = "adbs_login_email";
const LS_CODE = "adbs_login_code";
const LS_REMEMBER = "adbs_login_remember";

/**
 * Auto-format access codes like "QC-BRK-51164".
 * Rules:
 * - Uppercase everything.
 * - Strip non-alphanumerics during typing.
 * - If the code starts with 5+ letters, format as: AA-AAA-##### (QC-BRK-51164 style).
 * - Otherwise, just insert hyphens between letter groups and the digit group when possible.
 */
function formatAccessCode(raw) {
  const cleaned = (raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Split leading letters and trailing digits
  const match = cleaned.match(/^([A-Z]*)(\d*)$/);
  if (!match) return cleaned;

  const letters = match[1] || "";
  const digits = match[2] || "";

  // If we have 5+ letters up front, use AA-AAA-##### mask
  if (letters.length >= 5) {
    const part1 = letters.slice(0, 2);
    const part2 = letters.slice(2, 5);
    const restLetters = letters.slice(5); // unlikely, but append without extra hyphens

    let out = part1;
    if (letters.length > 2) out += "-" + part2;
    if (restLetters) out += restLetters; // append any extra letters directly

    if (digits.length > 0) out += "-" + digits;
    return out;
  }

  // If <5 letters, be graceful:
  // Add a hyphen after first 2 letters if we have more letters or any digits following.
  if (letters.length <= 2) {
    let out = letters;
    if (letters.length === 2 && (digits.length > 0)) out += "-";
    return out + digits;
  }

  // 3–4 letters: split 2 / remaining, then digits
  const part1 = letters.slice(0, 2);
  const part2 = letters.slice(2);
  let out = part1 + "-" + part2;
  if (digits.length > 0) out += "-" + digits;
  return out;
}

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
      localStorage.removeItem(LS_EMAIL);
      localStorage.removeItem(LS_CODE);
      localStorage.setItem(LS_REMEMBER, "false");
    } else {
      localStorage.setItem(LS_EMAIL, email || "");
      localStorage.setItem(LS_CODE, code || "");
      localStorage.setItem(LS_REMEMBER, "true");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (remember) {
      localStorage.setItem(LS_EMAIL, email || "");
      localStorage.setItem(LS_CODE, code || "");
      localStorage.setItem(LS_REMEMBER, "true");
    }
    // Phase 1: stay on page; routing will come after backend wires in.
  };

  const onCodeChange = (e) => {
    const next = formatAccessCode(e.target.value);
    setCode(next);
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
              onChange={onCodeChange}
              autoCapitalize="characters"
              autoCorrect="off"
              inputMode="text"
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
