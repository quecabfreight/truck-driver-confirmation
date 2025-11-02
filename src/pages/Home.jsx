import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // Page + card styling matches the approved dark, realistic look.
  const page = {
    minHeight: "100vh",
    width: "100%",
    background: "var(--bg)",
    color: "var(--text)",
    display: "flex",
    flexDirection: "column",
  };

  const shell = {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "48px 16px 72px",
  };

  const card = {
    width: "100%",
    maxWidth: 860,
    borderRadius: 18,
    background: "var(--card)",
    border: "1px solid var(--border)",
    boxShadow: "0 42px 120px rgba(0,0,0,0.22)",
    padding: "28px",
  };

  const inner = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const logoBlock = {
    width: "100%",
    maxWidth: 560,
    borderRadius: 18,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.60))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
    padding: "28px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  };

  const logoImg = {
    width: 220,
    height: "auto",
    opacity: 0.95,
    display: "block",
  };

  const title = {
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: "-0.01em",
    marginTop: 6,
  };

  const subtitle = {
    marginTop: 4,
    fontSize: 14,
    fontWeight: 700,
    color: "var(--muted)",
  };

  const row = {
    width: "100%",
    maxWidth: 860,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginTop: 18,
  };

  const cta = {
    width: "100%",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "color-mix(in oklab, var(--card) 95%, white 5%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    padding: "16px 18px",
  };

  const ctaTitle = { fontWeight: 900, fontSize: 16, letterSpacing: "0.01em" };
  const ctaSub = { marginTop: 4, color: "var(--muted)", fontSize: 14 };

  const footer = {
    marginTop: 18,
    width: "100%",
    textAlign: "center",
    color: "var(--muted)",
    fontSize: 13,
    paddingTop: 12,
    borderTop: "1px solid var(--border)",
  };

  const linkReset = {
    color: "inherit",
    textDecoration: "none",
    display: "block",
  };

  return (
    <div style={page}>
      <div style={shell}>
        <div style={card}>
          <div style={inner}>
            <div style={logoBlock}>
              <img src="/qc-logo.png" alt="QueCab AdbS" style={logoImg} />
            </div>

            <div style={title}>QueCab AdbS</div>
            <div style={subtitle}>Secure Your Load</div>

            <div style={row}>
              <Link to="/join" style={linkReset}>
                <div style={cta}>
                  <div style={ctaTitle}>Request Access</div>
                  <div style={ctaSub}>
                    Brokers / Shippers — apply for authorization.
                  </div>
                </div>
              </Link>

              <Link to="/login" style={linkReset}>
                <div style={cta}>
                  <div style={ctaTitle}>Already Authorized? Log In</div>
                  <div style={ctaSub}>
                    Use your QueCab AdbS code to unlock verification tools.
                  </div>
                </div>
              </Link>

              <div style={cta}>
                <div style={ctaTitle}>What is QueCab AdbS?</div>
                <div style={ctaSub}>
                  QueCab AdbS is an Anti-Double Brokering System. We confirm who
                  is actually hauling your freight, and we warn you when something
                  doesn’t match at the dock.
                </div>
              </div>
            </div>

            <div style={footer}>
              Anti-Double Brokering System • Verified Carrier Authenticity • © QueCab Inc.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
