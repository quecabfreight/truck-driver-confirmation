import "./verify.css";

export default function Hello() {
  return (
    <div
      className="verify-wrap"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* HEADER (optional placeholder for now, same style as verify header for brand consistency) */}
      <header className="verify-header" style={{ justifyContent: "center" }}>
        <div className="brand" style={{ fontSize: "20px", textAlign: "center" }}>
          QueCab <span className="sub">AdbS</span>
        </div>
      </header>

      {/* MAIN CONTENT CARD */}
      <main
        className="verify-main"
        style={{
          flex: "1 1 auto",
          display: "grid",
          placeItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "var(--card)",
            border: "1px solid var(--ring)",
            borderRadius: "18px",
            boxShadow: "0 24px 60px rgba(0,0,0,.6)",
            padding: "24px 24px 20px",
            textAlign: "center",
          }}
        >
          {/* Logo / Identity */}
          <div
            style={{
              display: "grid",
              placeItems: "center",
              marginBottom: "16px",
            }}
          >
            {/* This is where your metallic shield/chain/truck logo will go.
               For now, we render a strong placeholder badge block. Later we can
               swap this div with an <img src="...logo..." /> once we drop your final PNG. */}
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "18px",
                background:
                  "radial-gradient(circle at 30% 30%, #4b4d57 0%, #1a1b20 60%)",
                border: "1px solid #5a5d6b",
                boxShadow:
                  "0 12px 32px rgba(0,0,0,.8), 0 0 20px rgba(255,255,255,.08) inset",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily:
                  "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "0.4px",
                  lineHeight: 1.2,
                }}
              >
                QueCab
              </div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "#9aa0a6",
                  lineHeight: 1.2,
                }}
              >
                AdbS
              </div>
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "8px",
                  fontWeight: 500,
                  padding: "2px 6px",
                  borderRadius: "999px",
                  border: "1px solid #5a6bff55",
                  color: "#c5d5ff",
                  background:
                    "linear-gradient(to bottom right, rgba(90,107,255,.18), rgba(0,0,0,0) 60%)",
                }}
              >
                SECURE
              </div>
            </div>
          </div>

          {/* Product Name + Tagline */}
          <div style={{ marginBottom: "20px", lineHeight: 1.3 }}>
            <div
              style={{
                color: "var(--text)",
                fontWeight: 700,
                fontSize: "18px",
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
                marginTop: "4px",
              }}
            >
              Secure Your Load
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
            {/* Request Access / Join */}
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
                padding: "12px 16px",
                letterSpacing: ".3px",
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

            {/* Login */}
            <a
              href="/login"
              style={{
                display: "block",
                width: "100%",
                background: "transparent",
                color: "#c5d5ff",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
                textAlign: "center",
                borderRadius: "12px",
                border: "1px solid #3a3d46",
                padding: "12px 16px",
                letterSpacing: ".3px",
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

          {/* Info / Context */}
          <div
            style={{
              textAlign: "left",
              background: "#1a1b20",
              borderRadius: "12px",
              border: "1px solid #2a2d35",
              padding: "12px 14px",
              fontSize: "12px",
              lineHeight: 1.4,
              color: "var(--muted)",
              fontWeight: 400,
            }}
          >
            <div style={{ fontWeight: 600, color: "var(--text)", fontSize: "12px", marginBottom: "4px" }}>
              What is QueCab AdbS?
            </div>
            <div>
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
        }}
      >
        Anti-Double Brokering System • Verified Carrier Authenticity • © QueCab
        Inc.
      </footer>
    </div>
  );
}
