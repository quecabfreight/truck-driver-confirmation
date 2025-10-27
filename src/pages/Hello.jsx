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
          "radial-gradient(circle at 20% 20%, rgba(40,45,55,.4) 0%, rgba(11,11,12,0) 70%), var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* SYSTEM HEADER BAR */}
      <header
        className="verify-header"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid var(--ring)",
          background:
            "linear-gradient(180deg,#0f1014 0%,#0a0b0d 60%,rgba(0,0,0,0) 100%)",
          boxShadow:
            "0 30px 60px rgba(0,0,0,.9), 0 0 40px rgba(255,255,255,.06) inset",
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            lineHeight: 1.3,
            padding: "6px 10px 8px",
            borderRadius: "10px",
            background:
              "linear-gradient(180deg,rgba(20,22,28,.6) 0%,rgba(0,0,0,0) 100%)",
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow:
              "0 8px 24px rgba(0,0,0,.8), 0 0 24px rgba(255,255,255,.08)",
            minWidth: "220px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: ".4px",
              color: "var(--text)",
              textTransform: "uppercase",
            }}
          >
            Anti-Double Brokering System
          </div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 500,
              color: "var(--muted)",
              letterSpacing: ".4px",
              textTransform: "uppercase",
              marginTop: "2px",
            }}
          >
            Authorized Access Only
          </div>
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
            maxWidth: "480px",
            background:
              "radial-gradient(circle at 10% 0%, rgba(200,210,255,.06) 0%, rgba(0,0,0,0) 60%), var(--card)",
            border: "1px solid var(--ring)",
            borderRadius: "20px",
            boxShadow:
              "0 30px 80px rgba(0,0,0,.9), 0 0 200px rgba(180,200,255,.18)",
            padding: "28px 24px 24px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* inner rim glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "20px",
              pointerEvents: "none",
              boxShadow:
                "0 0 160px rgba(200,210,255,.07) inset, 0 0 32px rgba(255,255,255,.05) inset",
            }}
          />

          {/* BADGE AREA */}
          <div
            style={{
              position: "relative",
              display: "grid",
              placeItems: "center",
              marginBottom: "24px",
            }}
          >
            {/* halo behind badge - scaled up for 220px badge */}
            <div
              style={{
                position: "absolute",
                width: "260px",
                height: "260px",
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 50% 40%, rgba(220,230,255,.28) 0%, rgba(40,50,80,0) 70%)",
                filter:
                  "blur(34px) drop-shadow(0 44px 90px rgba(0,0,0,.9))",
                boxShadow:
                  "0 54px 120px rgba(0,0,0,.9), 0 0 160px rgba(200,220,255,.4)",
              }}
            />

            {/* larger free-floating badge */}
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS Badge"
              style={{
                width: "220px",
                height: "220px",
                objectFit: "contain",
                filter:
                  "drop-shadow(0 16px 20px rgba(0,0,0,.9)) drop-shadow(0 0 16px rgba(255,255,255,.22))",
                position: "relative",
                zIndex: 2,
              }}
            />
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
                  "0 15px 40px rgba(0,0,0,.8), 0 0 30px rgba(180,200,255,.28)",
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
                  "0 15px 40px rgba(0,0,0,.8), 0 0 30px rgba(180,200,255,.22)",
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

          {/* INFO / PITCH */}
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
              QueCab AdbS confirms who is actually hauling your freight, and
              warns you when something doesn’t match at the dock.
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
            "0 -20px 60px rgba(0,0,0,.9), 0 0 80px rgba(180,200,255,.15)",
        }}
      >
        Anti-Double Brokering System • Verified Carrier Authenticity • © QueCab
        Inc.
      </footer>
    </div>
  );
}
