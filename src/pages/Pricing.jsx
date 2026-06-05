import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import { LS_EMAIL } from "../utils/auth.js";
import "../styles.css";

const PLANS = [
  {
    key: "founding_beta",
    name: "Founding Beta",
    price: "$49",
    limit: "100 verifications / month",
    note: "Early broker pricing",
    featured: true
  },
  {
    key: "starter",
    name: "Starter",
    price: "$149",
    limit: "100 verifications / month",
    note: "For small broker operations"
  },
  {
    key: "growth",
    name: "Growth",
    price: "$249",
    limit: "250 verifications / month",
    note: "For growing monthly volume"
  },
  {
    key: "pro",
    name: "Pro",
    price: "$399",
    limit: "500 verifications / month",
    note: "For serious load activity"
  },
  {
    key: "scale",
    name: "Scale",
    price: "$599",
    limit: "1,000 verifications / month",
    note: "For high-volume brokers"
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "Contact Us",
    limit: "Custom verification volume",
    note: "For large broker operations",
    enterprise: true
  }
];

export default function Pricing() {
  const [email, setEmail] = useState("");
  const [busyPlan, setBusyPlan] = useState("");
  const [error, setError] = useState("");
  const [isLoggedInBroker, setIsLoggedInBroker] = useState(false);

  const cleanEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    try {
      const savedEmail =
        (localStorage.getItem(LS_EMAIL) || "").trim() ||
        (sessionStorage.getItem(LS_EMAIL) || "").trim();

      if (savedEmail) {
        setEmail(savedEmail);
        setIsLoggedInBroker(true);
      }
    } catch {
      setIsLoggedInBroker(false);
    }
  }, []);

  function goTo(path) {
    window.location.href = path;
  }

  async function startCheckout(plan) {
    setError("");

    if (!isLoggedInBroker) {
      goTo("/#/join");
      return;
    }

    if (plan === "enterprise") {
      goTo("/#/join");
      return;
    }

    if (!cleanEmail) {
      setError("An approved broker email is required before subscription.");
      return;
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Enter a valid approved broker email.");
      return;
    }

    try {
      setBusyPlan(plan);

      const res = await fetch("/api/create_checkout_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          business_email: cleanEmail,
          email: cleanEmail,
          plan
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Checkout could not be started.");
      }

      const checkoutUrl = data?.url || data?.checkout_url;

      if (!checkoutUrl) {
        throw new Error("Checkout link was not returned.");
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err.message || "Something went wrong starting checkout.");
    } finally {
      setBusyPlan("");
    }
  }

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>QueCab AdbS Pricing</div>

          <div style={styles.subtitle}>
            Broker-facing Truck-Driver verification to help stop double
            brokering before the truck gets loaded.
          </div>

          {!isLoggedInBroker ? (
            <div style={styles.approvalBox}>
              <div style={styles.approvalTitle}>Broker Approval Required</div>
              <div style={styles.approvalText}>
                Request access before activating a subscription.
              </div>
            </div>
          ) : (
            <div style={styles.emailBox}>
              <label style={styles.label} htmlFor="brokerEmail">
                Approved Broker Email
              </label>

              <input
                id="brokerEmail"
                name="brokerEmail"
                style={styles.input}
                type="email"
                value={email}
                placeholder="broker@company.com"
                autoComplete="email"
                inputMode="email"
                onChange={(e) => setEmail(e.target.value)}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />

              <div style={styles.helper}>
                Enter the approved broker email connected to this QueCab AdbS account.
              </div>

              {error ? <div style={styles.error}>{error}</div> : null}
            </div>
          )}
        </div>

        <div style={styles.planGrid}>
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              style={{
                ...styles.planCard,
                ...(plan.featured ? styles.featuredCard : {})
              }}
            >
              {plan.featured ? <div style={styles.badge}>Founding Offer</div> : null}

              <div style={styles.planName}>{plan.name}</div>

              <div style={styles.price}>
                {plan.price}
                {!plan.enterprise ? <span style={styles.month}> / month</span> : null}
              </div>

              <div style={styles.limit}>{plan.limit}</div>
              <div style={styles.note}>{plan.note}</div>

              <button
                type="button"
                style={{
                  ...styles.button,
                  ...(plan.enterprise ? styles.enterpriseButton : {}),
                  ...(busyPlan ? styles.buttonDisabled : {})
                }}
                onClick={() => startCheckout(plan.key)}
                disabled={!!busyPlan}
              >
                {busyPlan === plan.key
                  ? "Opening..."
                  : !isLoggedInBroker
                  ? "Request Access"
                  : plan.enterprise
                  ? "Request Access"
                  : "Subscribe"}
              </button>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <div>Secure your load. Verify the Truck-Driver before loading.</div>
          <div>
            © 2026 Omnimobile Inc. All Rights Reserved. • QueCab AdbS™ —
            Patent Pending.
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#0c121c",
    color: "#e6edf5"
  },

  heroLogoWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: 90,
    marginBottom: 10
  },

  heroLogo: {
    width: 220,
    maxWidth: "90%"
  },

  container: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 20px 40px"
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
    marginBottom: 18
  },

  title: {
    fontSize: 34,
    fontWeight: 900,
    marginBottom: 10,
    textAlign: "center"
  },

  subtitle: {
    fontSize: 16,
    opacity: 0.82,
    lineHeight: 1.5,
    textAlign: "center",
    marginBottom: 22
  },

  approvalBox: {
    maxWidth: 620,
    margin: "0 auto",
    padding: 16,
    borderRadius: 14,
    border: "1px solid rgba(120,180,255,0.30)",
    background: "rgba(40,110,190,0.12)",
    textAlign: "center"
  },

  approvalTitle: {
    fontSize: 20,
    fontWeight: 950,
    marginBottom: 6
  },

  approvalText: {
    fontSize: 14,
    lineHeight: 1.5,
    opacity: 0.82
  },

  emailBox: {
    maxWidth: 620,
    margin: "0 auto"
  },

  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 900
  },

  input: {
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.24)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none"
  },

  helper: {
    marginTop: 9,
    fontSize: 13,
    opacity: 0.72,
    lineHeight: 1.4
  },

  error: {
    marginTop: 12,
    color: "#ff9c9c",
    fontWeight: 700,
    fontSize: 14
  },

  planGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
    gap: 14
  },

  planCard: {
    position: "relative",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 12px 28px rgba(0,0,0,0.28)"
  },

  featuredCard: {
    border: "1px solid rgba(120,180,255,0.55)"
  },

  badge: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: "5px 9px",
    borderRadius: 999,
    border: "1px solid rgba(120,180,255,0.45)",
    background: "rgba(40,110,190,0.22)",
    color: "#cfe7ff",
    fontSize: 12,
    fontWeight: 900
  },

  planName: {
    fontSize: 24,
    fontWeight: 900,
    marginBottom: 12,
    paddingRight: 120
  },

  price: {
    fontSize: 34,
    fontWeight: 900,
    marginBottom: 10
  },

  month: {
    fontSize: 15,
    opacity: 0.75,
    fontWeight: 700
  },

  limit: {
    fontSize: 15,
    fontWeight: 800,
    marginBottom: 8,
    opacity: 0.92
  },

  note: {
    minHeight: 42,
    fontSize: 14,
    opacity: 0.72,
    lineHeight: 1.5
  },

  button: {
    width: "100%",
    marginTop: 16,
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(120,180,255,0.55)",
    background: "rgba(40,110,190,0.35)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
    opacity: 1
  },

  enterpriseButton: {
    border: "1px solid rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.08)"
  },

  buttonDisabled: {
    opacity: 0.68,
    cursor: "not-allowed"
  },

  footer: {
    marginTop: 26,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 1.6,
    opacity: 0.72
  }
};
