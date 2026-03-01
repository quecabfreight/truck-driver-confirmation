// /src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./index.css";
import "./qc-global.css";
import "./styles.css";

class BootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  componentDidCatch(err) {
    // Keep it simple. No heavy logging loops.
    try {
      console.error("BootErrorBoundary:", err);
    } catch {}
  }
  render() {
    if (!this.state.err) return this.props.children;

    const msg =
      (this.state.err && (this.state.err.message || String(this.state.err))) ||
      "Unknown error";

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f1722",
          color: "#e6edf5",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          padding: "18px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            border: "1px solid rgba(255,90,90,0.35)",
            background: "rgba(0,0,0,0.25)",
            borderRadius: 14,
            padding: 16,
            boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 6 }}>
            QueCab AdbS — Runtime Error
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 12 }}>
            Copy this message and send it to support (you).
          </div>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 13,
              lineHeight: 1.35,
              opacity: 0.9,
            }}
          >
            {msg}
          </pre>
          <a
            href="/#/"
            style={{
              display: "inline-block",
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(140,190,255,0.20)",
              background: "rgba(0,0,0,0.18)",
              color: "#e6edf5",
              fontWeight: 900,
              letterSpacing: 0.2,
              textDecoration: "none",
            }}
          >
            Back Home
          </a>
        </div>
      </div>
    );
  }
}

const rootEl = document.getElementById("root");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BootErrorBoundary>
      <App />
    </BootErrorBoundary>
  </React.StrictMode>
);
