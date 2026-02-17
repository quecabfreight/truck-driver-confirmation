import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PublicHeader() {
  const nav = useNavigate();
  const loc = useLocation();

  const active = (path) => loc.pathname === path;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(120,160,210,0.18)",
        background: "rgba(10,16,26,0.72)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          onClick={() => nav("/")}
        >
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={{ width: 58, height: 58, objectFit: "contain" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontWeight: 950, letterSpacing: 0.3, fontSize: 16 }}>
              QueCab AdbS
            </div>
            <div style={{ opacity: 0.68, fontSize: 13 }}>
              Freight Risk Control Layer
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <NavBtn text="Home" onClick={() => nav("/")} active={active("/")} />
          <NavBtn text="How It Works" onClick={() => nav("/how-it-works")} active={active("/how-it-works")} />
          <NavBtn text="About" onClick={() => nav("/about")} active={active("/about")} />
          <button onClick={() => nav("/login")} style={btn("outline")}>
            Log In
          </button>
          <button onClick={() => nav("/join")} style={btn("primary")}>
            Request Access
          </button>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 12px",
        fontSize: 15,
        fontWeight: 850,
        borderRadius: 12,
        cursor: "pointer",
        letterSpacing: 0.2,
        background: active ? "rgba(120,180,255,0.10)" : "transparent",
        border: "1px solid rgba(120,160,210,0.18)",
        color: "rgba(230,237,245,0.90)",
      }}
    >
      {text}
    </button>
  );
}

function btn(type) {
  const base = {
    padding: "12px 14px",
    fontSize: 15,
    fontWeight: 900,
    borderRadius: 12,
    cursor: "pointer",
    letterSpacing: 0.2,
  };

  if (type === "primary") {
    return {
      ...base,
      background: "rgba(30, 90, 160, 0.75)",
      border: "1px solid rgba(120,180,255,0.45)",
      color: "#ffffff",
    };
  }

  return {
    ...base,
    background: "transparent",
    border: "1px solid rgba(120,180,255,0.35)",
    color: "#e6edf5",
  };
}
