import React from "react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const nav = useNavigate();

  return (
    <div style={{ background: "#0f1722", color: "#e6edf5", minHeight: "100vh" }}>
      {/* Top Bar (simple, realistic, public) */}
      <div
        style={{
          borderBottom: "1px solid rgba(120,160,210,0.18)",
          background: "rgba(10,16,26,0.65)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* If you have /public/qc-logo.png, this will show; otherwise it just leaves space */}
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS"
              style={{ width: 56, height: 56, objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 900, letterSpacing: 0.3 }}>QueCab AdbS</div>
              <div style={{ opacity: 0.7, fontSize: 13 }}>Freight Risk Control Layer</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => nav("/")}
              style={btn("ghost")}
            >
              Home
            </button>
            <button
              onClick={() => nav("/how-it-works")}
              style={btn("ghost")}
            >
              How It Works
            </button>
            <button
              onClick={() => nav("/login")}
              style={btn("outline")}
            >
              Log In
            </button>
            <button
              onClick={() => nav("/join")}
              style={btn("primary")}
            >
              Request Access
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 70px" }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, margin: "0 0 12px", letterSpacing: -0.4 }}>
          About QueCab AdbS
        </h1>

        <p style={{ fontSize: 18, opacity: 0.82, marginTop: 0, lineHeight: 1.55 }}>
          QueCab AdbS is a freight risk control layer built to reduce exposure to double brokering
          and unauthorized pickups. It adds a verification decision point before freight moves.
        </p>

        <div style={card()}>
          <div style={cardTitle()}>What AdbS verifies</div>
          <ul style={ul()}>
            <li style={li()}>
              <b>Carrier</b> — the legal entity operating under an MC# / USDOT#
            </li>
            <li style={li()}>
              <b>truck driver</b> — the individual person operating the truck
            </li>
            <li style={li()}>
              <b>Truck-Driver</b> — the verified pair: truck + driver together (what gets cleared to load)
            </li>
          </ul>
        </div>

        <div style={card()}>
          <div style={cardTitle()}>Why it matters</div>
          <ul style={ul()}>
            <li style={li()}>Fraud can look legitimate until the freight is gone.</li>
            <li style={li()}>The dock is the last safe decision point.</li>
            <li style={li()}>AdbS creates a clear “load / don’t load” outcome with an audit trail.</li>
          </ul>
        </div>

        <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => nav("/join")} style={btn("primary")}>
            Request Access
          </button>
          <button onClick={() => nav("/login")} style={btn("outline")}>
            Log In
          </button>
        </div>

        <div style={{ marginTop: 26, opacity: 0.6, fontSize: 13 }}>
          © {new Date().getFullYear()} QueCab AdbS. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function btn(type) {
  const base = {
    padding: "12px 14px",
    fontSize: 15,
    fontWeight: 800,
    borderRadius: 10,
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

  if (type === "outline") {
    return {
      ...base,
      background: "transparent",
      border: "1px solid rgba(120,180,255,0.35)",
      color: "#e6edf5",
    };
  }

  // ghost
  return {
    ...base,
    background: "transparent",
    border: "1px solid rgba(120,160,210,0.18)",
    color: "rgba(230,237,245,0.88)",
  };
}

function card() {
  return {
    marginTop: 18,
    padding: 18,
    borderRadius: 14,
    border: "1px solid rgba(120,160,210,0.18)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
  };
}

function cardTitle() {
  return { fontWeight: 900, fontSize: 18, marginBottom: 10 };
}

function ul() {
  return { margin: 0, paddingLeft: 18, lineHeight: 1.65, opacity: 0.88 };
}

function li() {
  return { margin: "6px 0" };
}
