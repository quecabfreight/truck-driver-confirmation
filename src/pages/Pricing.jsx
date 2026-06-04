import React, { useMemo, useState } from "react";
import "../styles.css";

const PLANS = [
  {
    key: "founding_beta",
    name: "Founding Beta",
    price: "$49",
    limit: "100 verifications / month",
    note: "Early broker pricing",
    featured: true,
  },
  {
    key: "starter",
    name: "Starter",
    price: "$149",
    limit: "100 verifications / month",
    note: "For small broker operations",
  },
  {
    key: "growth",
    name: "Growth",
    price: "$249",
    limit: "250 verifications / month",
    note: "For growing monthly volume",
  },
  {
    key: "pro",
    name: "Pro",
    price: "$399",
    limit: "500 verifications / month",
    note: "For serious load activity",
  },
  {
    key: "scale",
    name: "Scale",
    price: "$599",
    limit: "1,000 verifications / month",
    note: "For high-volume brokers",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "Contact Us",
    limit: "Custom verification volume",
    note: "For large broker operations",
    enterprise: true,
  },
];

export default function Pricing() {
  const [email, setEmail] = useState("");
  const [busyPlan, setBusyPlan] = useState("");
  const [error, setError] = useState("");

  const cleanEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  function goTo(path) {
    window.location.href = path;
  }

  async function startCheckout(plan) {
    setError("");

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_email: cleanEmail,
          email: cleanEmail,
          plan,
        }),
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
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navBrand} onClick={() => goTo("/#/control-center")}>
          <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.navLogo} />
          <span style={styles.navTitle}>QueCab AdbS</span>
        </div>

        <div style={styles.navLinks}>
          <button type="button" style={styles.navButton} onClick={() => goTo("/#/control-center")}>
            Control Center
          </button>
          <button type="button" style={styles.navButton} onClick={() => goTo("/#/live-activity")}>
            Live Activity
          </button>
          <button type="button" style={styles.navButtonActive} onClick={() => goTo("/pricing")}>
            Pricing
          </button>
          <button type="button" style={styles.navButton} onClick={() => goTo("/#/account")}>
            Account
          </button>
          <button type="button" style={styles.navButton} onClick={() => goTo("/#/")}>
            Home
          </button>
        </div>
      </nav>

      <header style={styles.header}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} />
        <div>
          <h1 style={styles.title}>QueCab AdbS Pricing</h1>
          <p style={styles.subtitle}>
            Broker-facing Truck-Driver verification to help stop double brokering before the truck gets loaded.
          </p>
        </div>
      </header>

      <section style={styles.emailBox}>
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

        <p style={styles.helper}>
          Enter the approved broker email connected to this QueCab AdbS account.
        </p>

        {error ? <div style={styles.error}>{error}</div> : null}
      </section>

      <section style={styles.grid}>
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            style={{
              ...styles.card,
              ...(plan.featured ? styles.featuredCard : {}),
            }}
          >
            {plan.featured ? <div style={styles.badge}>Founding Offer</div> : null}

            <h2 style={styles.planName}>{plan.name}</h2>

            <div style={styles.price}>
              {plan.price}
              {!plan.enterprise && <span style={styles.month}> / month</span>}
            </div>

            <p style={styles.limit}>{plan.limit}</p>
            <p style={styles.note}>{plan.note}</p>

            <button
              type="button"
              style={{
                ...styles.button,
                ...(plan.enterprise ? styles.enterpriseButton : {}),
                ...(busyPlan ? styles.buttonDisabled : {}),
              }}
              onClick={() => startCheckout(plan.key)}
              disabled={!!busyPlan}
            >
              {busyPlan === plan.key
                ? "Opening..."
                : plan.enterprise
                ? "Request Access"
                : "Subscribe"}
            </button>
          </div>
        ))}
      </section>

      <footer style={styles.footer}>
        <p>Secure your load. Verify the Truck-Driver before loading.</p>
        <p>© 2026 Omnimobile Inc. All Rights Reserved. • QueCab AdbS™ — Patent Pending.</p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px 18px 34px",
    color: "#f3f7fb",
    background:
      "radial-gradient(circle at top, rgba(35,82,120,0.35), transparent 34%), linear-gradient(135deg, #08111b 0%, #101c29 45%, #05080d 100%)",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  nav: {
    maxWidth: "1180px",
    margin: "0 auto 26px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    border: "1px solid rgba(180,210,240,0.2)",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.06)",
    boxShadow: "0 14px 34px rgba(0,0,0,0.28)",
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 1000,
    pointerEvents: "auto",
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    position: "relative",
    zIndex: 1001,
    pointerEvents: "auto",
  },
  navLogo: {
    width: "46px",
    height: "auto",
    pointerEvents: "none",
  },
  navTitle: {
    fontWeight: 950,
    letterSpacing: "-0.02em",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 1001,
    pointerEvents: "auto",
  },
  navButton: {
    padding: "9px 12px",
    borderRadius: "999px",
    border: "1px solid rgba(200,225,245,0.18)",
    background: "rgba(5,12,20,0.28)",
    color: "#dbe9f7",
    fontWeight: 800,
    cursor: "pointer",
    position: "relative",
    zIndex: 1002,
    pointerEvents: "auto",
  },
  navButtonActive: {
    padding: "9px 12px",
    borderRadius: "999px",
    border: "1px solid rgba(83,174,255,0.55)",
    background: "rgba(83,174,255,0.16)",
    color: "#ffffff",
    fontWeight: 950,
    cursor: "pointer",
    position: "relative",
    zIndex: 1002,
    pointerEvents: "auto",
  },
  header: {
    maxWidth: "1180px",
    margin: "0 auto 28px",
    display: "flex",
    alignItems: "center",
    gap: "22px",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 1,
    pointerEvents: "none",
  },
  logo: {
    width: "150px",
    height: "auto",
    filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.5))",
    pointerEvents: "none",
  },
  title: {
    margin: 0,
    fontSize: "clamp(2rem, 5vw, 3.6rem)",
    letterSpacing: "-0.04em",
    pointerEvents: "none",
  },
  subtitle: {
    margin: "10px 0 0",
    maxWidth: "760px",
    fontSize: "1.08rem",
    lineHeight: 1.55,
    color: "#c9d7e6",
    pointerEvents: "none",
  },
  emailBox: {
    maxWidth: "1180px",
    margin: "0 auto 26px",
    padding: "20px",
    border: "1px solid rgba(180,210,240,0.22)",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.055)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 10,
    pointerEvents: "auto",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#dce9f7",
    fontWeight: 900,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(200,225,245,0.35)",
    background: "rgba(5,12,20,0.72)",
    color: "#ffffff",
    fontSize: "1.05rem",
    outline: "none",
    pointerEvents: "auto",
    userSelect: "text",
    WebkitUserSelect: "text",
    position: "relative",
    zIndex: 20,
  },
  helper: {
    margin: "10px 0 0",
    color: "#9fb1c5",
  },
  error: {
    marginTop: "12px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "rgba(180,30,30,0.22)",
    border: "1px solid rgba(255,120,120,0.35)",
    color: "#ffd7d7",
    fontWeight: 900,
  },
  grid: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
    gap: "18px",
    position: "relative",
    zIndex: 10,
  },
  card: {
    position: "relative",
    zIndex: 10,
    padding: "24px",
    borderRadius: "22px",
    border: "1px solid rgba(180,210,240,0.18)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035))",
    boxShadow: "0 18px 42px rgba(0,0,0,0.28)",
  },
  featuredCard: {
    border: "1px solid rgba(83,174,255,0.55)",
    boxShadow: "0 22px 55px rgba(25,115,190,0.25)",
  },
  badge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(83,174,255,0.18)",
    border: "1px solid rgba(83,174,255,0.45)",
    color: "#bfe4ff",
    fontSize: "0.78rem",
    fontWeight: 950,
    pointerEvents: "none",
  },
  planName: {
    margin: "8px 0 16px",
    fontSize: "1.45rem",
  },
  price: {
    fontSize: "2.2rem",
    fontWeight: 950,
    letterSpacing: "-0.04em",
  },
  month: {
    fontSize: "0.95rem",
    color: "#aebdca",
    fontWeight: 800,
  },
  limit: {
    margin: "18px 0 6px",
    color: "#e5eef8",
    fontWeight: 850,
  },
  note: {
    minHeight: "44px",
    color: "#aebdca",
    lineHeight: 1.45,
  },
  button: {
    width: "100%",
    marginTop: "18px",
    padding: "14px 16px",
    border: 0,
    borderRadius: "14px",
    background: "linear-gradient(180deg, #2d8fe8, #1464a8)",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 12px 26px rgba(20,100,168,0.34)",
    position: "relative",
    zIndex: 30,
    pointerEvents: "auto",
  },
  buttonDisabled: {
    opacity: 0.68,
    cursor: "not-allowed",
  },
  enterpriseButton: {
    background: "linear-gradient(180deg, #7d8792, #4d5965)",
  },
  footer: {
    maxWidth: "1180px",
    margin: "34px auto 0",
    color: "#97aabe",
    textAlign: "center",
    fontSize: "0.95rem",
    position: "relative",
    zIndex: 10,
  },
};
