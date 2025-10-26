import "./verify.css";

export default function Hello() {
  return (
    <div
      className="verify-wrap"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at 20% 20%, rgba(30,32,40,.4) 0%, rgba(11,11,12,0) 70%), var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* HEADER */}
      <header
        className="verify-header"
        style={{
          justifyContent: "center",
          borderBottom: "1px solid var(--ring)",
          background: "linear-gradient(180deg,#101114 0%,rgba(0,0,0,0) 80%)",
        }}
      >
        <div
          className="brand"
          style={{
            fontSize: "20px",
            textAlign: "center",
            fontWeight: 800,
            letterSpacing: ".3px",
            color: "var(--text)",
          }}
        >
          QueCab <span className="sub">AdbS</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        className="verify-main"
        style={{
          flex: "1 1 auto",
          display: "grid",
          placeItems: "center",
          width: "100%",
          paddingTop: "24px",
          paddingBottom: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            background:
              // dark card with subtle navy/steel bloom
              "radial-gradient(circle at 10% 0%, rgba(120,150,255,.10) 0%, rgba(0,0,0,0) 60%), var(--card)",
            border: "1px solid var(--ring)",
            borderRadius: "20px",
            boxShadow:
              "0 30px 80px rgba(0,0,0,.85), 0 0 160px rgba(90,107,255,.18)",
            padding: "28px 24px 24px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* inner frame / secure-module sheen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "20px",
              pointerEvents: "none",
              boxShadow:
                "0 0 120px rgba(90,107,255,.12) inset, 0 0 32px rgba(255,255,255,.06) inset",
            }}
          />

          {/* BADGE + halo */}
          <div
            style={{
              display: "grid",
              placeItems: "center",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            {/* glow plate BEHIND the badge */}
            <div
              style={{
                position: "absolute",
                width: "200px",
                height: "200px",
                borderRadius: "24px",
                background:
                  // cold steel / light blue metallic gradient
                  "radial-gradient(circle at 50% 40%, rgba(180,200,255,.28) 0%, rgba(60,70,110,0) 70%)",
                filter:
                  "blur(30px) drop-shadow(0 30px 60px rgba(0,0,0,.9))",
                boxShadow:
                  "0 40px 90px rgba(0,0,0,.9), 0 0 120px rgba(120,160,255,.4)",
              }}
            />

            {/* actual badge */}
            <div
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "20px",
                background:
                  // subtle panel reflection on the face of the badge container
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,.16) 0%, rgba(0,0,0,0) 70%)",
                border: "1px solid rgba(255,255,255,.18)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,.9), 0 0 90px rgba(120,160,255,.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px",
                position: "relative",
              }}
            >
              <img
                src="/qc-logo.png"
                alt="QueCab AdbS Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter:
                    // deep drop shadow to give the metal badge presence
                    "drop-shadow(0 12px 16px rgba(0,0,0,.9)) drop-shadow(0 0 12px rgba(255,255,255,.22))",
                }}
              />
            </div>
          </div>

          {/* PRODUCT NAME + TAGLINE */}
          <div style={{ marginBottom: "20px", lineHeight: 1.3 }}>
            <div
              style={{
                color: "var(--text)",
                fontWeight: 700,
                fontSize: "20px",
                letterSpacing: ".2px",
              }}
            >
              QueCab AdbS
            </div>
            <div
              style={{
                color: "var(--muted)",
                fontWeight: 500,
                fontSize: "13px",
                marginTop: "6px",
              }}
            >
              Secure Your Load
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "grid", gap: "14px", marginBottom: "24px" }}>
            {/* REQUEST ACCESS */}
            <a
              href="/join"
              style={{
                display: "block",
                width: "100%",
                background:
                  "linear-gradient(180deg,#0f1117 0%,#0a0b0d 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
                textAlign: "center",
                borderRadius: "12px",
                border: "1px solid #2e3240",
                padding: "14px 16px 12px",
                letterSpacing: ".3px",
                boxShadow:
                  "0 15px 40px rgba(0,0,0,.8), 0 0 30px rgba(120,160,255,.28)",
              }}
            >
              Request Access
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 400,
                  color: "#9aa0a6",
                  lineHeight: 1.3,
                  marginTop: "4px",
                }}
              >
                Brokers / Shippers — apply for authorization
              </div>
            </a>

            {/* LOGIN */}
            <a
              href="/login"
              style={{
                display: "block",
                width: "100%",
                background:
                  "linear-gradient(180deg,rgba(16,17,23,.3) 0%,rgba(10,11,13,0) 100%)",
                color: "#c5d5ff",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
                textAlign: "center",
                borderRadius: "12px",
                border: "1px solid #3a3d46",
                padding: "14px 16px 12px",
                letterSpacing: ".3px",
                boxShadow:
                  "0 15px 40px rgba(0,0,0,.8), 0 0 30px rgba(120,160,255,.22)",
              }}
            >
              Already Authorized? Log In
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 400,
                  color: "#9aa0a6",
                  lineHeight: 1.3,
                  marginTop: "4px",
                }}
              >
                Use your QueCab AdbS code to unlock verification tools
              </div>
            </a>
          </div>

          {/* INFO BLOCK */}
          <div
            style={{
              textAlign: "left",
              background:
                "linear-gradient(180deg,#1a1b20 0%,rgba(0,0,0,0) 140%)",
              borderRadius: "12px",
              border: "1px solid #2a2d35",
              padding: "14px 16px",
              fontSize: "12px",
              lineHeight: 1.4,
              color: "var(--muted)",
              fontWeight: 400,
              boxShadow:
                "0 20px 50px rgba(0,0,0,.8), 0 0 24px rgba(255,255,255,.04) inset",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                color: "var(--text)",
                fontSize: "12px",
                marginBottom: "6px",
              }}
            >
              What is QueCab AdbS?
            </div>
            <div style={{ fontSize: "12px" }}>
              QueCab AdbS is an Anti-Double Brokering System. We confirm who is
              actually hauling your freight, and we warn you when something
              doesn’t match at the dock.
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          width: "100%",
          textAlign: "center",
          fontSize: "11px",
          lineHeight: 1.4,
          color: "var(--muted)",
          padding: "20px 16px 32px",
          borderTop: "1px solid var(--ring)",
          background:
            "linear-gradient(180deg,#0d0e12 0%,rgba(0,0,0,0) 60%)",
          boxShadow:
            "0 -20px 60px rgba(0,0,0,.9), 0 0 80px rgba(90,107,255,.15)",
        }}
      >
        Anti-Double Brokering System • Verified Carrier Authenticity • © QueCab
        Inc.
      </footer>
    </div>
  );
}
