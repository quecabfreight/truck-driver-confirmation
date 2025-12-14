import React, { useEffect, useState } from "react";
import Join from "./pages/Join.jsx";

function getRoute() {
  const h = window.location.hash || "#/";
  // normalize
  if (h.startsWith("#")) return h;
  return "#/";
}

export default function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Minimal nav so you can move around while we debug
  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.brand}>
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={styles.logo}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div style={styles.brandText}>QueCab AdbS</div>
        </div>

        <div style={styles.nav}>
          <a style={styles.navLink} href="#/">
            Home
          </a>
          <a style={styles.navLink} href="#/join">
            Request Access
          </a>
        </div>
      </div>

      <div style={styles.body}>
        {route === "#/join" ? (
          <Join />
        ) : (
          <div style={styles.card}>
            <h1 style={styles.h1}>Home</h1>
            <p style={styles.p}>
              If this page shows but <b>Request Access</b> is white, the problem is inside <code>Join.jsx</code>.
              If <i>this</i> is white too, the problem is earlier (index.html / main.jsx).
            </p>

            <a href="#/join" style={styles.bigButton}>
              Go to Request Access
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 700px at 50% 30%, rgba(22, 60, 110, 0.35), rgba(4, 10, 20, 1) 55%, rgba(0,0,0,1) 100%)",
    color: "#e9eef7",
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 26px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.25)",
    position: "sticky",
    top: 0,
    zIndex: 5,
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 44, height: 44, objectFit: "contain" },
  brandText: { fontWeight: 800, fontSize: 18 },
  nav: { display: "flex", gap: 18, alignItems: "center" },
  navLink: { color: "rgba(233, 238, 247, 0.92)", textDecoration: "none", fontWeight: 700 },
  body: { display: "flex", justifyContent: "center", padding: 24 },
  card: {
    width: "min(900px, 100%)",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.25)",
    padding: 22,
  },
  h1: { margin: 0, fontSize: 28 },
  p: { color: "rgba(233,238,247,0.78)", lineHeight: 1.5 },
  bigButton: {
    display: "inline-block",
    marginTop: 14,
    padding: "12px 18px",
    borderRadius: 999,
    background: "rgba(45, 230, 130, 1)",
    color: "#06120b",
    fontWeight: 900,
    textDecoration: "none",
  },
};
