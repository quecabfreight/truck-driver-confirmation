// /src/pages/HowItWorks.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function HowItWorks() {
  const nav = useNavigate();

  const page = { minHeight: "100vh", background: "transparent" };
  const wrap = { maxWidth: 1100, margin: "0 auto", padding: "18px 16px 48px" };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const h1 = { fontSize: 26, fontWeight: 950, margin: 0, letterSpacing: 0.2 };
  const p = { marginTop: 10, opacity: 0.9, lineHeight: 1.55, fontSize: 16 };

  const row = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 14,
  };

  const mini = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(10, 16, 26, 0.60)",
    borderRadius: 16,
    padding: 16,
  };

  const t = { margin: 0, fontWeight: 950, letterSpacing: 0.2 };
  const d = { marginTop: 8, opacity: 0.88, lineHeight: 1.45 };

  const btn = (primary) => ({
    padding: "12px 14px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(120,180,255,0.45)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary ? "rgba(40, 110, 190, 0.35)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
    marginTop: 14,
  });

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        <div style={card}>
          <h1 style={h1}>How It Works</h1>

          <div style={p}>
            Issue a verification link → the driver presents it at check-in → dock personnel enter
            the USDOT# and plate they see on the truck, place the driver call, then submit. If it
            matches, the Truck-Driver is <b>CLEAR TO LOAD</b>. If anything is off, it’s a <b>CAUTION
            ALERT — DO NOT LOAD</b>.
          </div>

          <div style={row}>
            <div style={mini}>
              <h3 style={t}>1) Issue</h3>
              <div style={d}>
                Broker/shipper issues one AdbS verification per load (Load ID ties everything together).
              </div>
            </div>

            <div style={mini}>
              <h3 style={t}>2) Verify</h3>
              <div style={d}>
                Dock enters what they see on the truck (USDOT# + plate) and completes the driver call step.
              </div>
            </div>

            <div style={mini}>
              <h3 style={t}>3) Decide</h3>
              <div style={d}>
                System returns a clean, high-contrast verdict: <b>CLEAR TO LOAD</b> or <b>DO NOT LOAD</b>.
              </div>
            </div>
          </div>

          <button style={btn(true)} onClick={() => nav("/join")}>
            Request Access
          </button>
        </div>
      </div>
    </div>
  );
}
