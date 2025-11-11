import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * QueCab AdbS — Marketing Website
 * Distinct look from app:
 *  - Full-bleed gradient bands
 *  - Split hero (copy vs. visual)
 *  - Stats strip
 *  - Timeline "How it works"
 *  - Use-cases cards
 *  - Pricing with highlighted tier
 *  - FAQ (expand/collapse)
 *  - Sticky bottom CTA bar
 *
 * All inline styles; no globals changed.
 */

const C = {
  page: { fontSize: "60px", lineHeight: 1.25, color: "var(--fg, #fff)" },

  // BANDS
  band: (grad) => ({
    padding: "42px 0 36px",
    background: grad,
  }),
  wrap: { maxWidth: "1400px", margin: "0 auto", padding: "0 32px" },

  // NAV / MINI BRAND
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: "18px", marginBottom: "18px",
  },
  brand: { display: "flex", alignItems: "center", gap: "16px" },
  logo: { width: "120px", height: "auto" },
  brandName: { fontWeight: 900, fontSize: "62px", letterSpacing: ".5px" },
  topLinks: { display: "flex", gap: "18px", flexWrap: "wrap" },
  navBtn: {
    textDecoration: "none",
    color: "inherit",
    border: "1px solid rgba(255,255,255,.18)",
    padding: "12px 20px",
    borderRadius: "14px",
    fontSize: "44px",
    background: "rgba(0,0,0,.25)",
  },

  // HERO (split)
  hero: { display: "grid", gap: "28px", gridTemplateColumns: "1.2fr 1fr" },
  heroLeft: {},
  kicker: { fontWeight: 900, opacity: .9, marginBottom: "6px", fontSize: "48px" },
  h1: { fontSize: "96px", lineHeight: 1.04, fontWeight: 900, margin: "0 0 10px" },
  sub: { opacity: .96, marginBottom: "18px" },
  ctas: { display: "flex", gap: "18px", flexWrap: "wrap" },
  cta: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minHeight: "92px", padding: "0 36px", fontSize: "60px", fontWeight: 900,
    borderRadius: "18px", border: "1px solid rgba(255,255,255,.2)",
    textDecoration: "none", color: "inherit", background: "rgba(0,0,0,.35)",
    boxShadow: "0 14px 30px rgba(0,0,0,.35)"
  },
  ghost: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minHeight: "92px", padding: "0 36px", fontSize: "60px", fontWeight: 900,
    borderRadius: "18px", border: "1px solid rgba(255,255,255,.35)",
    textDecoration: "none", color: "inherit", background: "transparent"
  },
  heroRight: {
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,.12)",
    background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
    padding: "24px 22px",
    display: "grid", placeItems: "center",
    boxShadow: "0 18px 40px rgba(0,0,0,.35)"
  },
  heroLogo: { display:"block", width:"420px", maxWidth:"100%", margin:"8px auto" },
  heroBadge: {
    marginTop: "10px", fontWeight: 900, fontSize: "48px",
    background: "rgba(0,0,0,.45)", border: "1px solid rgba(255,255,255,.15)",
    padding: "10px 18px", borderRadius: "14px"
  },

  // STATS
  statsRow: { display: "grid", gap: "18px", gridTemplateColumns: "repeat(3,1fr)" },
  stat: {
    textAlign: "center", borderRadius: "18px",
    border: "1px solid rgba(255,255,255,.18)", background: "rgba(0,0,0,.25)",
    padding: "18px 16px"
  },
  statNum: { fontWeight: 900, fontSize: "88px" },

  // SECTION HEAD
  h2: { fontSize: "80px", fontWeight: 900, lineHeight: 1.06, margin: "0 0 14px" },
  p: { margin: "0 0 10px", opacity: .95 },

  // TIMELINE
  tl: { display: "grid", gap: "18px" },
  step: {
    display: "grid", gridTemplateColumns: "120px 1fr", gap: "16px",
    borderRadius: "18px", border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(0,0,0,.28)", padding: "18px 22px"
  },
  stepNum: {
    width: "120px", height: "120px", borderRadius: "18px",
    display: "grid", placeItems: "center", fontWeight: 900,
    background: "linear-gradient(140deg, #00ffa2 0%, #00c2ff 100%)",
    color: "#00110a", boxShadow: "0 12px 28px rgba(0,0,0,.35)"
  },

  // USE CASES
  grid3: { display: "grid", gap: "18px", gridTemplateColumns: "repeat(3,1fr)" },
  card: {
    borderRadius: "18px", border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(0,0,0,.22)", padding: "18px 22px", boxShadow: "0 10px 24px rgba(0,0,0,.25)"
  },

  // PRICING
  priceGrid: { display: "grid", gap: "18px", gridTemplateColumns: "repeat(3,1fr)" },
  tier: (highlight=false) => ({
    borderRadius: "22px",
    border: highlight ? "2px solid #00ffa2" : "1px solid rgba(255,255,255,.16)",
    background: highlight
      ? "linear-gradient(180deg, rgba(0,255,162,.18), rgba(0,255,162,.04))"
      : "rgba(0,0,0,.24)",
    padding: "22px 24px",
    boxShadow: highlight ? "0 18px 42px rgba(0,255,162,.25)" : "0 12px 28px rgba(0,0,0,.25)"
  }),
  tierHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" },
  price: { fontSize: "70px", fontWeight: 900 },
  list: { margin: "6px 0 10px" },

  // FAQ
  faq: {
    borderRadius: "18px", border: "1px solid rgba(255,255,255,.16)",
    background: "rgba(0,0,0,.22)", padding: "18px 22px"
  },
  q: { fontWeight: 900, cursor: "pointer" },
  a: { marginTop: "10px", opacity: .95 },

  // STICKY CTA
  sticky: {
    position: "sticky", bottom: 0, zIndex: 50,
    background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.75) 30%, rgba(0,0,0,.85))",
    padding: "18px 0 22px", borderTop: "1px solid rgba(255,255,255,.12)", marginTop: "28px"
  },
  stickyRow: { display: "flex", gap: "18px", justifyContent: "center", flexWrap: "wrap" },
};

function Faq({ q, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={C.faq}>
      <div style={C.q} onClick={() => setOpen(!open)}>
        {open ? "▾ " : "▸ "} {q}
      </div>
      {open && <div style={C.a}>{children}</div>}
    </div>
  );
}

export default function PublicSite() {
  // page-level background & theming
  const rootStyle = {
    ...C.page,
    background: "linear-gradient(180deg, #0a0b0e 0%, #0b0c11 40%, #0a1111 100%)",
  };

  return (
    <div style={rootStyle}>
      {/* ===== HERO BAND ===== */}
      <section style={C.band("radial-gradient(1200px 600px at 70% -50%, rgba(0,255,162,.25), rgba(0,0,0,0) 60%)")}>
        <div style={C.wrap}>

          <div style={C.topbar}>
            <div style={C.brand}>
              <img src="/qc-logo.png" style={C.logo} alt="QueCab AdbS logo" />
              <div style={C.brandName}>QueCab AdbS™</div>
            </div>
            <div style={C.topLinks}>
              <Link to="/about"  style={C.navBtn}>How it works</Link>
              <Link to="/login"  style={C.navBtn}>Log in</Link>
              <Link to="/join"   style={{...C.navBtn, fontWeight:900}}>Request access</Link>
            </div>
          </div>

          <div style={C.hero}>
            <div style={C.heroLeft}>
              <div style={C.kicker}>Truck-Driver Confirmation for real docks</div>
              <h1 style={C.h1}>Verify the truck. Load the right freight.</h1>
              <p style={C.sub}>
                Stop double-brokering and dock confusion. In one link, confirm <b>USDOT#</b>, <b>carrier</b>, and <b>driver identity</b>.
                Big-text screens. No training. Clear green/red outcome.
              </p>
              <div style={C.ctas}>
                <Link to="/join"   style={C.cta}>Request Demo / Join</Link>
                <Link to="/checkin"style={C.ghost}>Generate Verify Link</Link>
                <Link to="/about"  style={C.ghost}>See details</Link>
              </div>
            </div>

            <div style={C.heroRight}>
              <img src="/qc-logo.png" alt="QueCab emblem" style={C.heroLogo}/>
              <div style={C.heroBadge}>CLEAR TO LOAD ✅ / DO NOT LOAD 🚫</div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section style={C.band("linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.00))")}>
        <div style={{...C.wrap, ...C.statsRow}}>
          <div style={C.stat}>
            <div style={C.statNum}>1 Link</div>
            <div>Driver + Dock share the same flow</div>
          </div>
          <div style={C.stat}>
            <div style={C.statNum}>3 Checks</div>
            <div>USDOT# · Plate · Live call</div>
          </div>
          <div style={C.stat}>
            <div style={C.statNum}>0 Nonsense</div>
            <div>Big text. No gimmicks.</div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={C.band("linear-gradient(180deg, rgba(0,255,162,.05), rgba(0,0,0,0))")}>
        <div style={C.wrap}>
          <h2 style={C.h2}>How it works</h2>
          <div style={C.tl}>
            <div style={C.step}>
              <div style={C.stepNum}>1</div>
              <div><b>Create a Verify Link</b> for the shipment. Share it by text.</div>
            </div>
            <div style={C.step}>
              <div style={C.stepNum}>2</div>
              <div><b>Driver confirms identity</b> (USDOT# & License Plate). Ready for the dock.</div>
            </div>
            <div style={C.step}>
              <div style={C.stepNum}>3</div>
              <div><b>Dock types what they see</b>, <b>calls the driver</b>, then submits.<br/>
                  All “Yes” → <b>CLEAR TO LOAD</b>. Any “No” → <b>DO NOT LOAD</b> (subtle alert).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section style={C.band("linear-gradient(180deg, rgba(0,0,0,0), rgba(0,255,162,.05))")}>
        <div style={C.wrap}>
          <h2 style={C.h2}>Built for</h2>
          <div style={C.grid3}>
            <div style={C.card}>
              <b>Brokers</b>
              <div style={C.p}>Stop double-brokering. Give docks a simple pass/fail signal.</div>
            </div>
            <div style={C.card}>
              <b>Shippers</b>
              <div style={C.p}>Make dock checks repeatable: the right truck, the right load, every time.</div>
            </div>
            <div style={C.card}>
              <b>Carrier partners</b>
              <div style={C.p}>Straightforward identity confirmation—no login for drivers.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section style={C.band("linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.00))")}>
        <div style={C.wrap}>
          <h2 style={C.h2}>Pricing</h2>
          <div style={C.priceGrid}>
            <div style={C.tier(false)}>
              <div style={C.tierHead}><div><b>Starter</b></div><div style={C.price}>$— /mo</div></div>
              <ul style={C.list}>
                <li>Single dock</li>
                <li>Core verification</li>
              </ul>
              <Link to="/join" style={C.cta}>Start</Link>
            </div>
            <div style={C.tier(true)}>
              <div style={C.tierHead}><div><b>Pro</b></div><div style={C.price}>$— /mo</div></div>
              <ul style={C.list}>
                <li>Multiple docks</li>
                <li>Alerts + simple reporting</li>
              </ul>
              <Link to="/join" style={C.cta}>Upgrade</Link>
            </div>
            <div style={C.tier(false)}>
              <div style={C.tierHead}><div><b>Enterprise</b></div><div style={C.price}>Custom</div></div>
              <ul style={C.list}>
                <li>SSO + integrations</li>
                <li>Contract support</li>
              </ul>
              <Link to="/join" style={C.cta}>Talk to us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section style={C.band("linear-gradient(180deg, rgba(0,255,162,.05), rgba(0,0,0,0))")}>
        <div style={C.wrap}>
          <h2 style={C.h2}>Frequently asked</h2>
          <div style={{display:"grid", gap:"18px"}}>
            <Faq q="Do drivers need an app?">
              No. They tap a link sent by text. Done.
            </Faq>
            <Faq q="What if the dock can’t reach the driver?">
              Mark “No” on the call question and the system flags DO NOT LOAD.
            </Faq>
            <Faq q="Does this replace our TMS?">
              No. It runs alongside your ops. Pro/Enterprise can integrate later.
            </Faq>
          </div>
        </div>
      </section>

      {/* ===== STICKY CTA ===== */}
      <div style={C.sticky}>
        <div style={{...C.wrap, ...C.stickyRow}}>
          <Link to="/join"    style={C.cta}>Request Demo / Join</Link>
          <Link to="/checkin" style={C.ghost}>Generate Verify Link</Link>
        </div>
      </div>
    </div>
  );
}
