import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * QueCab AdbS — Login
 * Goals:
 * - Realistic, professional dark/steel look
 * - Business Email + Access Code + Remember Device
 * - On success: redirect to /control-center
 * - Avoid breaking existing backend: try multiple known API endpoints (first one that works wins)
 *
 * Storage:
 * - If "Remember device" is checked -> localStorage
 * - else -> sessionStorage
 */

const STORAGE_KEY = "adbs_auth_v1";

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function setStoredAuth(remember, payload) {
  const store = remember ? localStorage : sessionStorage;
  store.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function getStoredAuth() {
  const a = safeJsonParse(localStorage.getItem(STORAGE_KEY));
  const b = safeJsonParse(sessionStorage.getItem(STORAGE_KEY));
  return a || b || null;
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });

  // Some endpoints may return empty body or non-JSON on error
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  return { ok: res.ok, status: res.status, data };
}

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");

  // If already logged in, go to control center
  useEffect(() => {
    const existing = getStoredAuth();
    if (existing?.ok && existing?.email) {
      nav("/control-center", { replace: true });
    }
  }, [nav]);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && code.trim().length > 1 && !busy;
  }, [email, code, busy]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setNote("");

    const emailTrim = email.trim();
    const codeTrim = code.trim();

    if (!emailTrim || !codeTrim) {
      setErr("Enter your Business Email and Access Code.");
      return;
    }

    setBusy(true);

    // Try a few likely endpoints (first to return ok:true wins)
    // This avoids breaking your existing working backend if the endpoint name differs.
    const candidates = [
      "/api/login",
      "/api/auth_login",
      "/api/access_login",
      "/api/login_check",
      "/api/beta_login",
    ];

    try {
      let last = null;

      for (const url of candidates) {
        const r = await postJson(url, { email: emailTrim, access_code: codeTrim });
        last = r;

        // If endpoint doesn't exist, Vercel returns 404; try next
        if (r.status === 404) continue;

        // If endpoint exists and says ok, accept it
        if (r.ok && (r.data?.ok === true || r.data?.authorized === true)) {
          const payload = {
            ok: true,
            email: emailTrim,
            // store minimal info; do NOT store secrets like service keys
            ts: Date.now(),
            source: url,
            role: r.data?.role || null,
          };
          setStoredAuth(remember, payload);
          nav("/control-center", { replace: true });
          return;
        }

        // If endpoint exists but rejects, stop early with its message (don’t spam endpoints)
        if (r.status === 401 || r.status === 403) {
          setErr(r.data?.error || "Access denied. Check your email and access code.");
          setBusy(false);
          return;
        }

        // If endpoint exists but errors, show message and stop
        if (r.status >= 400 && r.status !== 404) {
          setErr(r.data?.error || `Login failed (${r.status}).`);
          setBusy(false);
          return;
        }
      }

      // No endpoint matched (all 404)
      setErr(
        "Login endpoint not found. The site is missing a login API route. We can fix this by adding a single /api/login endpoint that validates Business Email + Access Code."
      );
      if (last?.data?.raw) setNote(String(last.data.raw).slice(0, 2000));
    } catch (ex) {
      setErr(ex?.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: "#0f1722", color: "#e6edf5", minHeight: "100vh" }}>
      {/* Top Bar (public look) */}
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
            <button onClick={() => nav("/")} style={btn("ghost")}>Home</button>
            <button onClick={() => nav("/how-it-works")} style={btn("ghost")}>How It Works</button>
            <button onClick={() => nav("/join")} style={btn("outline")}>Request Access</button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 70px" }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, margin: "0 0 8px", letterSpacing: -0.4 }}>
          Log In
        </h1>
        <p style={{ margin: "0 0 22px", opacity: 0.78, fontSize: 17, lineHeight: 1.5 }}>
          Authorized brokers and shippers only. Enter your Business Email and Access Code.
        </p>

        <div style={card()}>
          <form onSubmit={handleSubmit}>
            <div style={label()}>Business Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              autoComplete="email"
              spellCheck={false}
              style={input()}
            />

            <div style={{ height: 12 }} />

            <div style={label()}>Access Code</div>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code"
              autoComplete="one-time-code"
              spellCheck={false}
              style={input()}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ transform: "scale(1.2)" }}
              />
              <div style={{ opacity: 0.85, fontSize: 15 }}>
                Remember this device
              </div>
            </div>

            {err ? (
              <div style={alertBox()}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Login failed</div>
                <div style={{ opacity: 0.9 }}>{err}</div>
                {note ? <div style={{ marginTop: 10, opacity: 0.7, fontSize: 12 }}>{note}</div> : null}
              </div>
            ) : null}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
              <button type="submit" disabled={!canSubmit} style={btn("primary", !canSubmit)}>
                {busy ? "Signing in…" : "Sign In"}
              </button>

              <button type="button" onClick={() => nav("/join")} style={btn("outline")}>
                Request Access
              </button>
            </div>

            <div style={{ marginTop: 14, opacity: 0.6, fontSize: 13, lineHeight: 1.4 }}>
              After login you will be taken directly to the Control Center.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function btn(type, disabled = false) {
  const base = {
    padding: "14px 16px",
    fontSize: 16,
    fontWeight: 900,
    borderRadius: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    letterSpacing: 0.2,
    opacity: disabled ? 0.6 : 1,
    userSelect: "none",
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
  return {
    ...base,
    background: "transparent",
    border: "1px solid rgba(120,160,210,0.18)",
    color: "rgba(230,237,245,0.88)",
  };
}

function card() {
  return {
    padding: 20,
    borderRadius: 16,
    border: "1px solid rgba(120,160,210,0.18)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 12px 26px rgba(0,0,0,0.28)",
  };
}

function label() {
  return { fontWeight: 900, fontSize: 14, opacity: 0.85, marginBottom: 8 };
}

function input() {
  return {
    width: "100%",
    padding: "14px 14px",
    fontSize: 18,
    borderRadius: 12,
    border: "1px solid rgba(120,160,210,0.28)",
    background: "rgba(0,0,0,0.28)",
    color: "#e6edf5",
    outline: "none",
  };
}

function alertBox() {
  return {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,90,90,0.35)",
    background: "rgba(160,40,40,0.18)",
  };
}
