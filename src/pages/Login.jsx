import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { setAuthSession } from "../utils/auth";

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const canSubmit = useMemo(() => {
    return email.trim() && code.trim();
  }, [email, code]);

  async function handleLogin(e) {
    e.preventDefault();
    setStatus(null);

    if (!canSubmit) {
      setStatus({ type: "error", message: "Enter your Business Email and Access Code." });
      return;
    }

    const emailLower = email.trim().toLowerCase();
    const codeTrim = code.trim();

    try {
      setLoading(true);

      // Pull the latest matching record for this email (simple + reliable for v1)
      const { data, error } = await supabase
        .from("beta_requests")
        .select("id, business_email, role, status, access_code")
        .eq("business_email", emailLower)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      const row = data && data[0];

      if (!row) {
        setStatus({
          type: "error",
          message: "No access request found for that email. Use Request Access first.",
        });
        return;
      }

      const rowStatus = (row.status || "").toLowerCase();
      const rowCode = (row.access_code || "").trim();

      if (rowStatus !== "approved") {
        setStatus({
          type: "error",
          message:
            "Access not approved yet. Your request is still pending review.",
        });
        return;
      }

      if (!rowCode) {
        setStatus({
          type: "error",
          message:
            "Approved but no access code is set yet. Contact admin to receive your code.",
        });
        return;
      }

      if (rowCode !== codeTrim) {
        setStatus({
          type: "error",
          message: "Invalid access code. Check it and try again.",
        });
        return;
      }

      // SUCCESS
      setAuthSession({ email: emailLower, role: row.role || "Broker" }, remember);

      setStatus({
        type: "success",
        message: "Access confirmed. Redirecting to AdbS Control Center…",
      });

      // Tiny delay so success message is visible
      setTimeout(() => {
        nav("/control-center");
      }, 350);
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err?.message ||
          "Login failed. Check Supabase configuration and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qc-shell" style={{ padding: "30px 16px 46px" }}>
      <div className="qc-inner" style={{ maxWidth: 980, margin: "0 auto" }}>
        <div
          style={{
            background: "rgba(8,10,16,.55)",
            border: "1px solid rgba(255,255,255,.10)",
            borderRadius: 18,
            padding: 22,
            boxShadow: "0 18px 40px rgba(0,0,0,.35)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h1 className="qc-heading" style={{ margin: "0 0 6px" }}>
            Log In
          </h1>

          <p className="qc-sub" style={{ margin: "0 0 18px", opacity: 0.9 }}>
            Authorized brokers and shippers only.
          </p>

          <form onSubmit={handleLogin}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px 16px",
              }}
            >
              <div>
                <label style={{ fontWeight: 800 }}>
                  Business Email <span style={{ color: "#ff5b5b" }}>*</span>
                </label>
                <input
                  className="qc-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  inputMode="email"
                  autoComplete="email"
                />
              </div>

              <div>
                <label style={{ fontWeight: 800 }}>
                  Access Code <span style={{ color: "#ff5b5b" }}>*</span>
                </label>
                <input
                  className="qc-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your code"
                  autoComplete="one-time-code"
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    fontWeight: 800,
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    style={{ transform: "scale(1.15)" }}
                  />
                  Remember this device
                </label>
              </div>
            </div>

            {status && (
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.14)",
                  fontWeight: 800,
                  background:
                    status.type === "success"
                      ? "rgba(20,120,80,.18)"
                      : "rgba(140,30,30,.18)",
                }}
              >
                {status.message}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button
                type="submit"
                className="qc-navbtn"
                disabled={!canSubmit || loading}
              >
                {loading ? "Checking..." : "Log In"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px){
          form > div[style*="grid-template-columns"]{
            grid-template-columns: 1fr !important;
          }
          .qc-navbtn{ width:100%; }
          div[style*="justify-content: flex-end"]{ justify-content: stretch !important; }
        }
      `}</style>
    </div>
  );
}
