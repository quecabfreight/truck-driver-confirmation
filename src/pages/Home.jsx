// /src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { LS_EMAIL, getAuthEmail, isBrokerOrShipper } from "../utils/auth.js";

function looksLikeEmail(v) {
  const s = String(v || "").trim();
  return s.includes("@") && s.includes(".");
}

function scanStorageEmails(store) {
  const found = [];
  try {
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (!k) continue;
      const v = (store.getItem(k) || "").trim();
      if (looksLikeEmail(v)) found.push({ key: k, value: v });
    }
  } catch {}
  return found;
}

export default function Home() {
  const nav = useNavigate();

  const [email, setEmail] = useState(() => getAuthEmail());
  const [showDebug, setShowDebug] = useState(false);

  // Same-tab sync (storage event doesn't fire in the same tab)
  useEffect(() => {
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const current = getAuthEmail();
      setEmail((prev) => (prev === current ? prev : current));
    };

    tick();
    const id = setInterval(tick, 500);

    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);

    // Cross-tab sync
    const onStorage = () => tick();
    window.addEventListener("storage", onStorage);

    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Use the email we display as the truth for this page
  const authorized = useMemo(() => {
    const e = String(email || "").trim();
    return !!e && isBrokerOrShipper(e);
  }, [email]);

  // Debug payload (computed only when debug is shown)
  const debug = useMemo(() => {
    if (!showDebug) return null;

    const lsEmail = (() => {
      try {
        return (localStorage.getItem(LS_EMAIL) || "").trim();
      } catch {
        return "";
      }
    })();

    const detected = getAuthEmail();

    const lsFound = scanStorageEmails(localStorage);
    let ssFound = [];
    try {
      ssFound = scanStorageEmails(sessionStorage);
    } catch {}

    return {
      detected_email: detected || "(none)",
      ls_primary_qc_email: lsEmail || "(none)",
      authorized_on_home: authorized ? "YES" : "NO",
      localStorage_email_values_found: lsFound,
      sessionStorage_email_values_found: ssFound,
    };
  }, [showDebug, authorized]);

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

  const debugBtn = {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
    opacity: 0.75,
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

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
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

            <button style={debugBtn} onClick={() => setShowDebug((v) => !v)} title="Auth Debug">
              Auth Debug
            </button>
          </div>
        </div>

        {showDebug && debug ? (
          <div
            style={{
              marginTop: 10,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(0,0,0,0.25)",
              borderRadius: 12,
              padding: 12,
              fontSize: 12,
              lineHeight: 1.35,
              opacity: 0.9,
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Auth Debug (Home)</div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{JSON.stringify(debug, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
