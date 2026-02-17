import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * PublicSite.jsx was breaking builds due to invalid characters at file start ("!").
 * This overwrite makes it valid React again.
 * It is NOT used by default in routing unless App.jsx points to it.
 */

export default function PublicSite() {
  const nav = useNavigate();

  return (
    <div style={{ background: "#0f1722", color: "#e6edf5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 10 }}>
          QueCab AdbS — Public Site
        </h1>

        <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 800 }}>
          This page is reserved for future public-site layout work. The main public homepage is
          now located at <b>/#/</b>.
        </p>

        <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
          <button
            onClick={() => nav("/")}
            style={{
              padding: "14px 18px",
              fontSize: 16,
              fontWeight: 800,
              background: "#1f3b63",
              border: "1px solid #2e5a96",
              color: "white",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Go to Homepage
          </button>

          <button
            onClick={() => nav("/login")}
            style={{
              padding: "14px 18px",
              fontSize: 16,
              fontWeight: 800,
              background: "transparent",
              border: "1px solid #2e5a96",
              color: "white",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Log In
          </button>

          <button
            onClick={() => nav("/join")}
            style={{
              padding: "14px 18px",
              fontSize: 16,
              fontWeight: 800,
              background: "transparent",
              border: "1px solid #2e5a96",
              color: "white",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Request Access
          </button>
        </div>

        <div style={{ marginTop: 26, opacity: 0.7, fontSize: 14 }}>
          Build-safe placeholder to prevent future deploy failures.
        </div>
      </div>
    </div>
  );
}
