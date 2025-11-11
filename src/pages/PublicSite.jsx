import React from "react";
import { Link } from "react-router-dom";

/**
 * Public marketing page for QueCab AdbS™
 * - Big hero (logo + tagline + primary CTA)
 * - “Who it’s for” pain bullets
 * - Visual How-It-Works (3 steps)
 * - Features grid
 * - Pricing tiers (Starter / Pro / Enterprise)
 * - Credibility / trust strip (badges placeholders)
 * - FAQ
 * - Footer with contact routes
 *
 * All styles are inline (scoped) so nothing else is affected.
 */

const S = {
  page: { fontSize: "60px", lineHeight: 1.25 },
  wrap: { maxWidth: "1400px", margin: "0 auto", padding: "0 32px" },

  // HERO
  hero: { padding: "16px 0 24px" },
  logo: { display: "block", width: "360px", maxWidth: "92vw", margin: "28px auto 8px" },
  h1: { fontSize: "92px", lineHeight: 1.05, fontWeight: 900, textAlign: "center", margin: "6px 0 10px" },
  sub: { textAlign: "center", maxWidth: "1200px", margin: "0 auto 18px", opacity: 0.96 },

  ctasRow: { display: "flex", gap: "18px", justifyContent: "center", flexWrap: "wrap", marginTop: "10px" },
  btn: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minHeight: "90px", padding: "0 34px", fontSize: "60px", fontWeight: 900,
    borderRadius: "18px", border: "1px solid rgba(255,255,255,0.12)", textDecoration: "none", color: "inherit",
    background: "rgba(17,17,19,0.65)", boxShadow: "0 12px 28px rgba(0,0,0,.35)"
  },
  btnGhost: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minHeight: "90px", padding: "0 34px", fontSize: "60px", fontWeight: 900,
    borderRadius: "18px", border: "1px solid rgba(255,255,255,0.22)", textDecoration: "none", color: "inherit",
    background: "transparent"
  },

  section: { margin: "28px 0 12px" },
  h2: { fontSize: "78px", lineHeight: 1.06, fontWeight: 900, margin: "0 0 14px" },
  p: { margin: "0 0 10px", opacity: 0.95 },

  // “Who it’s for / Pain bullets”
  pains: { display: "grid", gap: "18px", gridTemplateColumns: "1fr", marginTop: "8px" },
  painCard: {
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "18px",
    padding: "18px 22px", background: "rgba(17,17,19,0.45)"
  },
  li: { margin: "0 0 8px" },

  // HIW
  hiwGrid: { display: "grid", gap: "18px", gridTemplateColumns: "1fr", marginTop: "8px" },
  step: {
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "18px",
    padding: "18px 22px", background: "rgba(17,17,19,0.45)"
  },
  stepNum: { fontWeight: 900, marginRight: "14px" },

  // Features grid
  featGrid: { display: "grid", gap: "18px", gridTemplateColumns: "1fr", marginTop: "8px" },
  feat: {
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "18px",
    padding: "18px 22px", background: "rgba(17,17,19,0.35)"
  },

  // Pricing
  priceGrid: { display: "grid", gap: "18px", gridTemplateColumns: "1fr", marginTop: "8px" },
  tier: {
    border: "1px solid rgba(255,255,255,0.16)", borderRadius: "18px",
    padding: "20px 24px", background: "rgba(17,17,19,0.55)"
  },
  tierHead: { display: "flex", justifyContent: "space-between", gap: "18px", marginBottom: "8px" },
  price: { fontWeight: 900 },

  // Badges strip
  badges: {
    marginTop: "8px",
    display: "grid", gap: "18px",
    gridTemplateColumns: "repeat(3, minmax(0,1fr))"
  },
  badge: {
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "18px",
    padding: "16px 20px", textAlign: "center", background: "rgba(17,17,19,0.35)", fontWeight: 800
  },

  // FAQ
  faqGrid: { display: "grid", gap: "18px", gridTemplateColumns: "1fr", marginTop: "8px" },
  faq: {
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "18px",
    padding: "18px 22px", background: "rgba(17,17,19,0.35)"
  },

  // Footer
  foot: { textAlign: "center", margin: "36px 0 28px", fontWeight: 800, opacity: .9 }
};

export default function PublicSite() {
  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* HERO */}
        <section style={{...S.hero, ...S.section}}>
          <img src="/qc-logo.png" alt="QueCab AdbS logo" style={S.logo} />
          <h1 style={S.h1}>QueCab AdbS™</h1>
          <p style={S.sub}>
            Truck-Driver Confirmation for docks of any size. Big text. Clean screens. No gimmicks.
            Instantly confirm <b>USDOT#</b>, <b>carrier</b>, and <b>driver identity</b> — stop double-brokering and load the right truck.
          </p>
          <div style={S.ctasRow}>
            <Link to="/join" style={S.btn}>Request Demo / Join</Link>
            <Link to="/checkin" style={S.btnGhost}>Generate Verify Link</Link>
            <Link to="/about" style={S.btnGhost}>How It Works (details)</Link>
          </div>
        </section>

        {/* WHO IT’S FOR / PAIN */}
        <section style={S.section}>
          <h2 style={S.h2}>For Brokers & Shippers who are done with headaches:</h2>
          <div style={S.pains}>
            <div style={S.painCard}>
              <ul>
                <li style={S.li}>You need dock staff to confirm the truck fast — without learning a new system.</li>
                <li style={S.li}>You want proof-they-called the driver, not just a checkbox.</li>
                <li style={S.li}>You want a simple “CLEAR TO LOAD” vs “DO NOT LOAD” signal — no debate.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={S.section}>
          <h2 style={S.h2}>How It Works</h2>
          <div style={S.hiwGrid}>
            <div style={S.step}>
              <div><span style={S.stepNum}>①</span><b>Create Verify Link</b></div>
              <div>Broker/Shipper makes one AdbS Truck-Driver Verification Link per shipment.</div>
            </div>
            <div style={S.step}>
              <div><span style={S.stepNum}>②</span><b>Driver Receives & Confirms</b></div>
              <div>They get it by text, tap the link, confirm USDOT# & plate — ready for the dock.</div>
            </div>
            <div style={S.step}>
              <div><span style={S.stepNum}>③</span><b>Dock Verifies</b></div>
              <div>Dock types what they see (USDOT# & Plate), <b>calls the driver</b>, then submits.</div>
              <div>All “Yes” → <b>CLEAR TO LOAD</b>. Any “No” → <b>DO NOT LOAD</b> (subtle alert).</div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={S.section}>
          <h2 style={S.h2}>What you get</h2>
          <div style={S.featGrid}>
            <div style={S.feat}><b>Big-Text UI</b> that works on the dock: readable at a glance, no training.</div>
            <div style={S.feat}><b>One-Link workflow</b>: create once, driver + dock both use it.</div>
            <div style={S.feat}><b>Call confirmation</b>: doc asks “Did the driver answer?” (Y/N).</div>
            <div style={S.feat}><b>Signal, not spreadsheets</b>: CLEAR / CAUTION with subtle red alert.</div>
            <div style={S.feat}><b>Access control</b>: brokers/shippers only; drivers see just what they need.</div>
            <div style={S.feat}><b>Light/Dark</b> looks, brand-ready with your logo.</div>
          </div>
        </section>

        {/* PRICING */}
        <section style={S.section}>
          <h2 style={S.h2}>Pricing</h2>
          <div style={S.priceGrid}>
            <div style={S.tier}>
              <div style={S.tierHead}>
                <div><b>Starter</b></div>
                <div style={S.price}>$— /mo</div>
              </div>
              <ul>
                <li style={S.li}>Single dock / low volume</li>
                <li style={S.li}>Core verification workflow</li>
              </ul>
              <div style={{marginTop:"10px"}}>
                <Link to="/join" style={S.btn}>Start</Link>
              </div>
            </div>
            <div style={S.tier}>
              <div style={S.tierHead}>
                <div><b>Pro</b></div>
                <div style={S.price}>$— /mo</div>
              </div>
              <ul>
                <li style={S.li}>Multiple docks / higher volume</li>
                <li style={S.li}>Alerts + simple reporting</li>
              </ul>
              <div style={{marginTop:"10px"}}>
                <Link to="/join" style={S.btn}>Upgrade</Link>
              </div>
            </div>
            <div style={S.tier}>
              <div style={S.tierHead}>
                <div><b>Enterprise</b></div>
                <div style={S.price}>Custom</div>
              </div>
              <ul>
                <li style={S.li}>Ops integrations + SSO</li>
                <li style={S.li}>Contract terms & support</li>
              </ul>
              <div style={{marginTop:"10px"}}>
                <Link to="/join" style={S.btn}>Talk to us</Link>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST / BADGES (placeholders you can replace with images later) */}
        <section style={S.section}>
          <h2 style={S.h2}>Built for real docks</h2>
          <div style={S.badges}>
            <div style={S.badge}>Easy for dock staff</div>
            <div style={S.badge}>Broker & shipper friendly</div>
            <div style={S.badge}>Driver-aware & simple</div>
          </div>
        </section>

        {/* FAQ */}
        <section style={S.section}>
          <h2 style={S.h2}>FAQ</h2>
          <div style={S.faqGrid}>
            <div style={S.faq}>
              <b>Do drivers need an app?</b>
              <div>No. They tap a link sent by text. Done.</div>
            </div>
            <div style={S.faq}>
              <b>What if the dock can’t reach the driver?</b>
              <div>Mark “No” to the call question → system flags DO NOT LOAD.</div>
            </div>
            <div style={S.faq}>
              <b>Does this replace our TMS?</b>
              <div>No. It runs alongside your ops. Pro/Enterprise can integrate later.</div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={S.foot}>
          <div>Press · Partners · Contact — <Link to="/join">reach out via Request Access</Link></div>
          <div style={{marginTop: "8px"}}>© {new Date().getFullYear()} QueCab AdbS — Secure Your Load</div>
        </footer>

      </div>
    </div>
  );
}
