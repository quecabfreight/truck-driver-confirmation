import React from "react";
import { Link } from "react-router-dom";

/**
 * Home:
 * - Big metallic logo centered top
 * - Three rows as before
 * - Copy consistent with your earlier spec
 */
export default function Home(){
  return (
    <main style={{padding:"16px"}}>
      {/* Big centered logo */}
      <div className="center" style={{margin:"10px 0 18px"}}>
        <img
          src="/qc-logo.png"
          alt="QueCab AdbS"
          style={{ maxWidth: 260, height: "auto", display:"block" }}
        />
      </div>

      <section className="card">
        <h2 className="h2">Request Access</h2>
        <p className="lead">Brokers &amp; Shippers only.</p>
        <Link to="/join" className="btn">Go to /join</Link>
      </section>

      <section className="card">
        <h2 className="h2">Already Authorized? Log In</h2>
        <p className="lead">Use your business email and access code.</p>
        <Link to="/login" className="btn">Go to /login</Link>
      </section>

      <section className="card">
        <h2 className="h2">About</h2>
        <p className="lead">
          QueCab AdbS — Truck-Driver confirmation built for busy docks.
        </p>
      </section>

      <footer>© 2025 QueCab AdbS</footer>
    </main>
  );
}
