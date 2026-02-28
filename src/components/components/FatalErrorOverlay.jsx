// /src/components/FatalErrorOverlay.jsx
import React from "react";

export function installGlobalCrashOverlay() {
  if (typeof window === "undefined") return;
  if (window.__QC_CRASH_OVERLAY_INSTALLED__) return;
  window.__QC_CRASH_OVERLAY_INSTALLED__ = true;

  function show(msg) {
    try {
      window.__QC_FATAL_ERROR__ = String(msg || "Unknown error");
      window.dispatchEvent(new Event("qc-fatal"));
    } catch {}
  }

  window.addEventListener("error", (e) => {
    show(e?.message || e?.error?.message || "A script error occurred.");
  });

  window.addEventListener("unhandledrejection", (e) => {
    const r = e?.reason;
    show(r?.message || String(r || "Unhandled promise rejection."));
  });
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }

  static getDerivedStateFromError(error) {
    return { err: error };
  }

  componentDidCatch(error) {
    try {
      window.__QC_FATAL_ERROR__ =
        error?.message || String(error || "React render error.");
      window.dispatchEvent(new Event("qc-fatal"));
    } catch {}
  }

  render() {
    if (this.state.err) {
      const msg =
        this.state.err?.message || String(this.state.err || "Render error.");
      return <FatalErrorScreen message={msg} />;
    }
    return this.props.children;
  }
}

export function FatalErrorScreen({ message }) {
  const box = {
    minHeight: "100vh",
    background: "#0f1722",
    color: "#e6edf5",
    padding: "18px 16px",
    fontFamily:
      "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
  };

  const card = {
    maxWidth: 980,
    margin: "0 auto",
    border: "1px solid rgba(255,90,90,0.35)",
    background: "rgba(0,0,0,0.25)",
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
  };

  const mono = {
    fontFamily:
      "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace",
    fontSize: 13,
    whiteSpace: "pre-wrap",
    opacity: 0.9,
    marginTop: 10,
    lineHeight: 1.35,
  };

  return (
    <div style={box}>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={{ width: 34, height: 34, objectFit: "contain" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div>
            <div style={{ fontSize: 18, fontWeight: 950 }}>
              QueCab AdbS — Page Crash
            </div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>
              Good news: it’s not “blank” anymore. Bad news: it’s mad.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, fontSize: 14, opacity: 0.85 }}>
          <b>Crash message:</b>
          <div style={mono}>{message}</div>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, opacity: 0.75 }}>
          Once you send me that crash message, I’ll give you the exact overwrite
          that fixes it.
        </div>
      </div>
    </div>
  );
}

export function CrashOverlayListener() {
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    function pull() {
      setMsg(String(window.__QC_FATAL_ERROR__ || ""));
    }
    pull();
    window.addEventListener("qc-fatal", pull);
    return () => window.removeEventListener("qc-fatal", pull);
  }, []);

  if (!msg) return null;
  return <FatalErrorScreen message={msg} />;
}
