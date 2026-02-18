import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";

const BUILD_TAG = "CONTROL-CENTER-SAFE-01";

function readAuth() {
  try {
    const raw = localStorage.getItem("adbs_auth");
    const j = raw ? JSON.parse(raw) : null;
    return j?.ok ? j : null;
  } catch {
    return null;
  }
}

export default function ControlCenter() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(readAuth());
  }, []);

  const email = useMemo(() => auth?.email || "", [auth]);

  if (!auth) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.bg} aria-hidden="true" />

        <div style={styles.innerCenter}>
          <div style={styles.card}>
            <div style={styles.title}>Control Center</div>
            <div style={styles.sub}>You’re not logged in on this device.</div>

            <button
              style={styles.btnPrimary}
              onClick={() => (window.location.href = `${window.location.origin}/#/login`)}
            >
              Go to Log In
            </button>

            <div style={styles.build}>Build: {BUILD_TAG}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.bg} aria-hidden="true" />

      <div style={styles.inner}>
        <div style={styles.topRow}>
          <div>
            <div style={styles.title}>Control Center</div>
            <div style={styles.sub}>
              Authorized access: <span style={styles.mono}>{email}</span>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              style={styles.btnOutline}
              onClick={() => {
                localStorage.removeItem("adbs_auth");
                window.location.href = `${window.location.origin}/#/`;
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>Issue Verify Link</div>
          <div style={styles.rule} />

          <div style={styles.body}>
            <div style={styles.bodyText}>
              Your issuer screens already exist in the project. Use the buttons below to open them.
              Next step is embedding the correct one back into this panel once we confirm the working issuer file.
            </div>

            <div style={styles.btnRow}>
              <button
                style={styles.btnPrimary}
                onClick={() => (window.location.href = `${window.location.origin}/#/smartlink`)}
              >
                Open SmartLink Issuer
              </button>

              <button
                style={styles.btnOutline}
                onClick={() => (window.location.href = `${window.location.origin}/#/driverlink`)}
              >
                Open DriverLink Issuer
              </button>
            </div>

            <div style={styles.smallNote}>
              If either route 404s, we’ll add the route in <span style={styles.mono}>src/App.jsx</span> next.
            </div>
          </div>

          <div style={styles.rule} />
          <div style={styles.build}>Build: {BUILD_TAG}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f1722", color: "#e6edf5", position: "relative" },

  bg: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.9,
    background: [
      "radial-gradient(1200px 600px at 18% 10%, rgba(90,150,240,0.18), rgba(0,0,0,0))",
      "radial-gradient(1000px 520px at 85% 15%, rgba(255,255,255,0.06), rgba(0,0,0,0))",
      "linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.30))",
      steelNoise(),
    ].join(", "),
  },

  inner: { position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "46px 20px 70px" },

  innerCenter: {
    position: "relative",
    zIndex: 1,
    minHeight: "calc(100vh - 90px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },

  topRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 14,
  },

  title: { fontSize: 38, fontWeight: 950, letterSpacing: -0.4, lineHeight: 1.1 },
  sub: { marginTop: 6, opacity: 0.78, fontSize: 14, lineHeight: 1.45 },

  mono: {
    fontWeight: 950,
    letterSpacing: 0.2,
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  actions: { display: "flex", gap: 10, flexWrap: "wrap" },

  card: {
    width: "100%",
    maxWidth: 640,
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 22,
  },

  panel: {
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 18,
  },

  panelTitle: { fontSize: 16, fontWeight: 950, letterSpacing: 0.1 },

  rule: { height: 1, background: "rgba(140,190,255,0.12)", margin: "14px 0" },

  body: { padding: "6px 2px 2px" },
  bodyText: { fontSize: 14, opacity: 0.82, lineHeight: 1.65, maxWidth: 980 },

  btnRow: { marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" },

  smallNote: { marginTop: 12, fontSize: 13, opacity: 0.62 },

  btnPrimary: {
    padding: "14px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 950,
    letterSpacing: 0.2,
    color: "#fff",
    background: "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))",
    border: "1px solid rgba(140,190,255,0.42)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
  },

  btnOutline: {
    padding: "14px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 950,
    letterSpacing: 0.2,
    color: "#e6edf5",
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(140,190,255,0.28)",
  },

  build: { marginTop: 10, fontSize: 12, opacity: 0.55 },
};

function steelNoise() {
  const svg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="
        0 0 0 0 0.35
        0 0 0 0 0.50
        0 0 0 0 0.70
        0 0 0 0.12 0"/>
    </filter>
    <rect width="220" height="220" filter="url(#n)" opacity="0.45"/>
  </svg>`);
  return `url("data:image/svg+xml,${svg}")`;
}
