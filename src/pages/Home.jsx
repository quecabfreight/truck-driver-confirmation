// /src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { getAuthEmail, isAuthorized } from "../utils/auth.js";

export default function Home() {
  const nav = useNavigate();

  const [email, setEmail] = useState(() => getAuthEmail());

  // Same-tab sync (storage event doesn't fire in the same tab)
  useEffect(() => {
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const current = getAuthEmail();
      setEmail((prev) => (prev === current ? prev : current));
    };

    tick();
    const id = setInterval(tick, 1000);

    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const authorized = useMemo(() => isAuthorized(), [email]);

  const page = { minHeight: "100vh", background: "transparent" };
  const wrap = { maxWidth: 1100, margin: "0 auto", padding: "18px 16px 48px" };

  const hero = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const h1 = { fontSize: 30, fontWeight: 900, letterSpacing: 0.2, margin: 0 };
  const p = { fontSize: 16, opacity: 0.9, lineHeight: 1.5, marginTop: 10 };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
    marginTop: 16,
  };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(10, 16, 26, 0.60)",
    borderRadius: 16,
    padding: 16,
  };

  const cardTitle = { fontSize: 16, fontWeight: 900, margin: 0 };
  const cardText = { fontSize: 14, opacity: 0.9, lineHeight: 1.45, marginTop: 8 };

  const btnRow = { display: "grid", gap: 10, marginTop: 12 };
  const btn = (primary) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(120,180,255,0.45)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary ? "rgba(40, 110, 190, 0.35)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 16,
    cursor: "pointer",
    textAlign: "center",
  });

  const footer = {
    marginTop: 18,
    opacity: 0.7,
    fontSize: 12,
    lineHeight: 1.4,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  };

  const linkBtn = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        <div style={hero}>
          <h1 style={h1}>QueCab AdbS</h1>
          <div style={p}>
            Anti-Double-Brokering System with Truck-Driver verification.
            <br />
            Built for brokers and shippers who need clean, reliable confirmation at the dock.
          </div>

          <div style={{ marginTop: 10, fontSize: 14, opacity: 0.85 }}>
            {authorized ? (
              <>
                Signed in as <b>{email}</b>.
              </>
            ) : (
              <>
                Request access for beta testing or log in if you already have an access code.
              </>
            )}
          </div>
        </div>

        <div style={grid}>
          <div style={card}>
            <h3 style={cardTitle}>Request Access</h3>
            <div style={cardText}>
              Beta access for brokers and shippers. Submit your business details and we’ll review.
            </div>
            <div style={btnRow}>
              <button style={btn(false)} onClick={() => nav("/join")}>
                Request Access
              </button>
            </div>
          </div>

          <div style={card}>
            <h3 style={cardTitle}>Already Authorized?</h3>
            <div style={cardText}>
              If you have your business email and access code, log in to reach the Control Center.
            </div>
            <div style={btnRow}>
              {authorized ? (
                <button style={btn(true)} onClick={() => nav("/dashboard")}>
                  Control Center
                </button>
              ) : (
                <button style={btn(true)} onClick={() => nav("/login")}>
                  Log In
                </button>
              )}
            </div>
          </div>

          <div style={card}>
            <h3 style={cardTitle}>How It Works</h3>
            <div style={cardText}>
              Learn how the QueCab AdbS verification flow works.
            </div>
            <div style={btnRow}>
              <button style={btn(false)} onClick={() => nav("/how-it-works")}>
                How It Works
              </button>
              <button style={btn(false)} onClick={() => nav("/about")}>
                About
              </button>
            </div>
          </div>
        </div>

        <div style={footer}>
          <div>
            {authorized ? (
              <>
                Status: <b>Authorized</b>.
              </>
            ) : (
              <>
                Status: <b>Public</b> — request access or log in to continue.
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              style={linkBtn}
              onClick={() => nav(authorized ? "/dashboard" : "/login")}
              title={authorized ? "Control Center" : "Log In"}
            >
              {authorized ? "Control Center" : "Log In"}
            </button>

            {!authorized ? (
              <button style={linkBtn} onClick={() => nav("/join")} title="Request Access">
                Request Access
              </button>
            ) : null}

            <button style={linkBtn} onClick={() => nav("/how-it-works")} title="How It Works">
              How It Works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
