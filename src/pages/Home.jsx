import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isBrokerOrShipper } from "../utils/auth";

export default function Home() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const update = () => setAllowed(isBrokerOrShipper());
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <h1>QueCab AdbS — Truck-Driver Confirmation</h1>

      <div className="tile-row" style={{ marginTop: 24 }}>
        <Link to="/join" className="tile">Request Access</Link>
        <Link to="/login" className="tile">Already Authorized? Log In</Link>
        <Link to="/about" className="tile">About</Link>
        {allowed && <Link to="/smart" className="tile">Check In Link</Link>}
      </div>
    </div>
  );
}
