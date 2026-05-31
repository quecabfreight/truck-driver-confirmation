import React, { useState } from "react";
import Header from "../components/Header.jsx";
import { getAuthEmail } from "../utils/auth.js";

function safe(v) {
  return String(v || "").trim();
}

export default function Pricing() {
  const [email, setEmail] = useState(() => safe(getAuthEmail()));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function startCheckout() {
    setMsg("");
    setErr("");

    const cleanEmail = safe(email).toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErr("Enter your broker email before continuing.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create_checkout_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: cleanEmail,
          plan: "founding_beta"
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.checkout_url) {
        setLoading(false);
        setErr(data?.error || "Could not start checkout.");
        return;
      }

      window.location.href = data.checkout_url;
    } catch {
      setLoading(false);
      setErr("Network error starting checkout.");
    }
  }

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <main style={styles.wrap}>
        <section style={styles.card}>
          <div style={styles.badge}>FOUNDING BETA ACCESS</div>

          <h1 style={styles.title}>Start QueCab AdbS</h1>

          <p style={styles.subtitle}>
            Founding beta access gives approved brokers early access to
            QueCab AdbS during the pre-release period.
          </p>

          <div style={styles.priceBox}>
            <div style={styles.price}>$49</div>
            <div style={styles.per}>per month during beta</div>
          </div>

          <div style={styles.futureBox}>
            Future pricing begins at <b>$149/month</b> after beta.
          </div>

          <div style={styles.list}>
            <div>✓ Broker Control Center access</div>
            <div>✓ AdbS Truck-Driver verification links</div>
            <div>✓ CLEAR TO LOAD / CAUTION ALERT workflow</div>
            <div>✓ Live Activity lookup and audit trail</div>
            <div>✓ Founding beta pricing while beta access remains active</div>
          </div>

          <div style={styles.formBlock}>
            <label style={styles.label}>Broker Email</label>

            <input
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="broker@company.com"
              inputMode="email"
              autoComplete="email"
            />

            <button
              style={{
                ...styles.primaryBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "wait" : "pointer"
              }}
              onClick={startCheckout}
              disabled={loading}
            >
              {loading ? "Opening Checkout..." : "Subscribe — $49/month"}
            </button>
          </div>

          {err ? <div style={styles.error}>{err}</div> : null}
          {msg ? <div style={styles.message}>{msg}</div> : null}

          <p style={styles.smallPrint}>
            Subscription billing is handled securely by Stripe. During beta,
            account approval and operational access may still be reviewed
            manually before full production use.
          </p>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #070b11 0%, #0d1522 48%, #111d2c 100%)",
    color: "#e6edf5"
  },
  heroLogoWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: 86,
    marginBottom: 10
  },
  heroLogo: {
    width: 220,
    maxWidth: "90%"
  },
  wrap: {
    maxWidth: 780,
    margin: "0 auto",
    padding: "0 18px 52px"
  },
  card: {
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.032))",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 24px 60px rgba(0,0,0,0.42)",
    textAlign: "center"
  },
  badge: {
    display: "inline-block",
    padding: "9px 14px",
    borderRadius: 999,
    border: "1px solid rgba(120,180,255,0.45)",
    background: "rgba(120,180,255,0.10)",
    color: "#b8d8ff",
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: 0.9,
    marginBottom: 14
  },
  title: {
    margin: 0,
    fontSize: 36,
    fontWeight: 950,
    letterSpacing: 0.2
  },
  subtitle: {
    maxWidth: 620,
    margin: "14px auto 22px",
    fontSize: 16,
    lineHeight: 1.65,
    opacity: 0.88
  },
  priceBox: {
    margin: "20px auto 12px",
    padding: 22,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "linear-gradient(180deg, rgba(40,110,190,0.18), rgba(255,255,255,0.035))"
  },
  price: {
    fontSize: 54,
    fontWeight: 950,
    lineHeight: 1
  },
  per: {
    marginTop: 7,
    fontSize: 15,
    opacity: 0.78,
    fontWeight: 800
  },
  futureBox: {
    margin: "0 auto 20px",
    padding: "12px 14px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.20)",
    fontSize: 14,
    opacity: 0.92
  },
  list: {
    display: "grid",
    gap: 10,
    maxWidth: 560,
    margin: "0 auto 24px",
    textAlign: "left",
    fontSize: 15,
    lineHeight: 1.45
  },
  formBlock: {
    maxWidth: 460,
    margin: "0 auto",
    display: "grid",
    gap: 10
  },
  label: {
    textAlign: "left",
    fontSize: 13,
    fontWeight: 900,
    opacity: 0.82
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.045))",
    color: "#fff",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box"
  },
  primaryBtn: {
    width: "100%",
    padding: "15px 18px",
    borderRadius: 15,
    border: "1px solid rgba(120,180,255,0.55)",
    background:
      "linear-gradient(180deg, rgba(52,120,205,0.78), rgba(26,72,130,0.92))",
    color: "#fff",
    fontSize: 16,
    fontWeight: 950,
    boxShadow: "0 14px 32px rgba(0,0,0,0.32)"
  },
  error: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,80,80,0.35)",
    background: "rgba(255,80,80,0.08)",
    color: "#ffb0b0",
    fontWeight: 800
  },
  message: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(120,180,255,0.35)",
    background: "rgba(120,180,255,0.08)",
    color: "#cce1ff",
    fontWeight: 800
  },
  smallPrint: {
    maxWidth: 620,
    margin: "20px auto 0",
    fontSize: 12,
    lineHeight: 1.6,
    opacity: 0.62
  }
};
