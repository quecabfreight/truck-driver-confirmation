import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LS_EMAIL = "adbs_login_email";
const LS_CODE = "adbs_login_code";
const LS_REMEMBER = "adbs_login_remember";

function isAuthed() {
  const remembered = localStorage.getItem(LS_REMEMBER) === "true";
  const email = (localStorage.getItem(LS_EMAIL) || "").trim();
  const code = (localStorage.getItem(LS_CODE) || "").trim();
  return remembered && email && code;
}

export default function Home() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(isAuthed());
    // also update if user toggles remember or edits fields in this tab
    const onStorage = () => setAllowed(isAuthed());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <h1>QueCab AdbS — Truck-Driver Confirmation</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        Realistic, dock-friendly UI. Big type. No gimmicks.
      </p>

      <div className="tile-row">
        <Link to="/join" className="tile">Request Access</Link>
        <Link to="/login" className="tile">Already Authorized? Log In</Link>
        <Link to="/about" className="tile">About</Link>
        {allowed && <Link to="/smart" className="tile">Check In Link</Link>}
      </div>
    </div>
  );
}
