import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * QueCab AdbS — Public Marketing Site
 * - Distinct visual system (not the app UI)
 * - Sticky nav + big hero
 * - Proof strip (stats)
 * - Value props + feature grid
 * - How-it-works timeline
 * - Pricing (Starter/Pro/Enterprise)
 * - Testimonials
 * - FAQ (accordion)
 * - Footer with contact routes
 *
 * All styles are scoped inline. Safe to paste.
 */

const ui = {
  page: {
    fontSize: "18px",
    lineHeight: 1.6,
    color: "var(--fg, #EAF2F2)",
    background:
      "radial-gradient(1200px 600px at 80% -20%, rgba(0,255,162,.12), rgba(0,0,0,0) 60%), radial-gradient(900px 500px at 10% -10%, rgba(0,194,255,.10), rgba(0,0,0,0) 60%), #0b0d11",
  },

  // ===== NAV =====
  navWrap: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "saturate(140%) blur(10px)",
    background: "linear-gradient(180deg, rgba(11,13,17,.85), rgba(11,13,17,.65))",
    borderBottom: "1px solid rgba(255,255,255,.08)",
  },
  nav: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: { display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" },
  logo: { width: 44, height: 44 },
  brandText: { fontWeight: 900, letterSpacing: ".3px" },
  navLinks: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  navBtn: {
    textDecoration: "none",
    color: "inherit",
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.04)",
  },
  navPrimary: {
    textDecoration: "none",
    color: "#06120d",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 800,
    background: "linear-gradient(180deg, #00ffa2, #00d48a)",
    boxShadow: "0 10px 24px rgba(0,255,162,.25)",
    border: "1px solid #00ffa2",
  },

  // ===== LAYOUT HELPERS =====
  section: (padTop = 56, padBottom = 56) => ({
    padding: `${padTop}px 0 ${padBottom}px`,
  }),
  wrap: { maxWidth: 1240, margin: "0 auto", padding: "0 20px" },
  h1: { fontSize: 54, lineHeight: 1.08, margin: "0 0 10px", fontWeight: 900 },
  h2: { fontSize: 36, lineHeight: 1.15, margin: "0 0 12px", fontWeight: 900 },
  h3: { fontSize: 22, lineHeight: 1.25, margin: "0 0 6px", fontWeight: 800 },
  p: { margin: "0 0 10px", color: "rgba(234,242,242,.92)" },

  // ===== HERO =====
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: 28,
    alignItems: "center",
  },
  heroCard: {
    border: "1px solid rgba(255,255,255,.10)",
    background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
    borderRadius: 18,
    padding: 24,
    textAlign: "center",
    boxShadow: "0 18px 40px rgba(0,0,0,.35)",
  },
  heroLogo: { width: 260, maxWidth: "80%", marginBottom: 10 },
  heroBadge: {
    display: "inline-block",
    marginTop: 8,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(255,255,255,.06)",
  },
  ctaRow: { display: "flex", gap: 14, flexWrap: "wrap", marginTop: 16 },
  cta: {
    textDecoration: "none",
    color: "#06120d",
    padding: "14px 18px",
    borderRadius: 12,
    fontWeight: 900,
    background: "linear-gradient(180deg, #00ffa2, #00d48a)",
    border: "1px solid #00ffa2",
    boxShadow: "0 12px 30px rgba(0,255,162,.25)",
  },
  ghost: {
    textDecoration: "none",
    color: "inherit",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.22)",
    background: "transparent",
  },

  // ===== PROOF STRIP =====
  stats: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(3, minmax(0,1fr))",
  },
  stat: {
    textAlign: "center",
    border: "1px solid rgba(255,255,255,.10)",
    borderRadius: 14,
    background: "rgba(255,255,255,.04)",
    padding: "16px 12px",
  },
  statNum: { fontSize: 38, fontWeight: 900 },

  // ===== VALUE / FEATURES =====
  grid3: { display: "grid", gap: 16, gridTemplateColumns: "repeat(3, minmax(0,1fr))" },
  card: {
    border: "1px solid rgba(255,255,255,.10)",
    borderRadius: 14,
    background: "rgba(255,255,255,.04)",
    padding: 16,
  },

  // ===== TIMELINE =====
  tl: { display: "grid", gap: 16 },
  step: {
    display: "grid",
    gridTemplateColumns: "72px 1fr",
    gap: 16,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.04)",
    borderRadius: 14,
    padding: 16,
  },
  stepNum: {
    width: 72,
    height: 72,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    color: "#00130b",
    background: "linear-gradient(160deg, #00ffa2 0%, #00c2ff 100%)",
    boxShadow: "0 8px 20px rgba(0,0,0,.35)",
  },

  // ===== PRICING =====
  priceGrid: { display: "grid", gap: 16, gridTemplateColumns: "repeat(3, minmax(0,1fr))" },
  tier: (hi) => ({
    borderRadius: 16,
    border: hi ? "2px solid #00ffa2" : "1px solid rgba(255,255,255,.12)",
    background: hi
      ? "linear-gradient(180deg, rgba(0,255,162,.16), rgba(0,255,162,.05))"
      : "rgba(255,255,255,.04)",
    padding: 18,
    boxShadow: hi ? "0 14px 34px rgba(0,255,162,.22)" : "none",
  }),
  price: { fontSize: 32, fontWeight: 900 },

  // ===== TESTIMONIALS =====
  quotes: { display: "grid", gap: 16, gridTemplateColumns: "repeat(2, minmax(0,1fr))" },
  quote: {
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.04)",
    borderRadius: 14,
    padding: 16,
    fontStyle: "italic",
  },

  // ===== FAQ =====
  faq: {
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 14,
    background: "rgba(255,255,255,.05)",
    padding: 14,
  },
  q: { fontWeight: 900, cursor: "pointer" },
  a: { marginTop: 8, color: "rgba(234,242,242,.92)" },

  // ===== FOOTER =====
  footer: {
    borderTop: "1px solid rgba(255,255,255,.10)",
    background: "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.00))",
    padding: "22px 0 26px",
    marginTop: 28,
  },
  footRow: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },

  // ===== RESPONSIVE =====
  mq: `
    @media (max-width: 980px) {
      .heroGrid { grid-template-columns: 1fr; }
      .stats { grid-template-columns: 1fr; }
      .grid3 { grid-template-columns: 1fr; }
      .priceGrid { grid-template-columns: 1fr; }
      .quotes { grid-template-columns: 1fr; }
    }
  `,
};

function FAQ({ q, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={ui.faq}>
      <div style={ui.q} onClick={() => setOpen(!open)}>{open ? "▾ " : "▸ "}{q}</div>
      {open && <div style={ui.a}>{children}</div>}
    </div>
  );
}

export default function PublicSite() {
  useEffect(() => { document.title = "QueCab AdbS — Secure Your Load"; }, []);

  return (
    <div style={ui.page}>
      {/* tiny style tag for responsive grid utility classes only */}
      <style>{`
        .heroGrid { display:grid; grid-template-columns:1.2fr 1fr; gap:28px; align-items:center; }
        .stats { display:grid; gap:16px; grid-template-columns:repeat(3,minmax(0,1fr)); }
        .grid3 { display:grid; gap:16px; grid-template-columns:repeat(3,minmax(0,1fr)); }
        .priceGrid { display:grid; gap:16px; grid-template-columns:repeat(3,minmax(0,1fr)); }
        .quotes { display:grid; gap:16px; grid-template-columns:repeat(2,minmax(0,1fr)); }
        ${ui.mq}
      `}</style>

      {/* ===== NAV ===== */}
      <div style={ui.navWrap}>
        <nav style={ui.nav}>
          <Link to="/site" style={ui.brand}>
            <img src="/qc-logo.png" alt="QueCab AdbS" style={ui.logo} />
            <span style={ui.brandText}>QueCab AdbS™</span>
          </Link>
          <div style={ui.navLinks}>
            <a href="#how" style={ui.navBtn}>How it works</a>
            <a href="#pricing" style={ui.navBtn}>Pricing</a>
            <a href="#faq" style={ui.navBtn}>FAQ</a>
            <Link to="/login" style={ui.navBtn}>Log in</Link>
            <Link to="/join" style={ui.navPrimary}>Request Access</Link>
          </div>
        </nav>
      </div>

      {/* ===== HERO ===== */}
      <section style={ui.section(48, 28)}>
        <div style={ui.wrap} className="heroGrid">
          <div>
            <div style={ui.h1}>Verify the truck. Load the right freight.</div>
            <p style={ui.p}>
              One link confirms <b>USDOT#</b>, <b>carrier</b>, and <b>driver identity</b>.
              Built for docks of any size: big text, clean screens, and a clear result —
              <b> CLEAR TO LOAD</b> or <b>DO NOT LOAD</b>.
            </p>
            <div style={ui.ctaRow}>
              <Link to="/join" style={ui.cta}>Request Demo / Join</Link>
              <Link to="/checkin" style={ui.ghost}>Generate Verify Link</Link>
              <Link to="/about" style={ui.ghost}>See Details</Link>
            </div>
          </div>
          <div style={ui.heroCard}>
            <img src="/qc-logo.png" alt="QueCab emblem" style={ui.heroLogo} />
            <div style={ui.heroBadge}>QueCab AdbS™ — Secure Your Load</div>
          </div>
        </div>
      </section>

      {/* ===== PROOF STRIP ===== */}
      <section style={ui.section(6, 26)}>
        <div style={{ ...ui.wrap, ...ui.stats }}>
          <div style={ui.stat}>
            <div style={ui.statNum}>1 Link</div>
            <div>Driver + Dock share the same simple flow</div>
          </div>
          <div style={ui.stat}>
            <div style={ui.statNum}>3 Checks</div>
            <div>USDOT# · Plate · Live driver call</div>
          </div>
          <div style={ui.stat}>
            <div style={ui.statNum}>0 Nonsense</div>
            <div>Big text. No training. No guesswork.</div>
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPS ===== */}
      <section style={ui.section()}>
        <div style={ui.wrap}>
          <div style={ui.h2}>Why brokers & shippers pick QueCab</div>
          <div className="grid3">
            <div style={ui.card}>
              <div style={ui.h3}>Dock-ready UI</div>
              <p style={ui.p}>Readable at a glance. Designed for busy docks, not office desktops.</p>
            </div>
            <div style={ui.card}>
              <div style={ui.h3}>Proof of call</div>
              <p style={ui.p}>Dock marks if the driver answered — no more “we tried” gray areas.</p>
            </div>
            <div style={ui.card}>
              <div style={ui.h3}>Outcome signal</div>
              <p style={ui.p}>Clear green vs. red result: <b>CLEAR TO LOAD</b> or <b>DO NOT LOAD</b>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" style={ui.section()}>
        <div style={ui.wrap}>
          <div style={ui.h2}>How it works</div>
          <div style={ui.tl}>
            <div style={ui.step}>
              <div style={ui.stepNum}>1</div>
              <div><b>Create a Verify Link</b> for each shipment. Share it by text.</div>
            </div>
            <div style={ui.step}>
              <div style={ui.stepNum}>2</div>
              <div><b>Driver confirms identity</b> (USDOT# & License Plate). No app or login required.</div>
            </div>
            <div style={ui.step}>
              <div style={ui.stepNum}>3</div>
              <div><b>Dock types what they see</b>, <b>calls the driver</b>, submits. All “Yes” → CLEAR TO LOAD; any “No” → DO NOT LOAD.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={ui.section()}>
        <div style={ui.wrap}>
          <div style={ui.h2}>Pricing</div>
          <div className="priceGrid">
            <div style={ui.tier(false)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={ui.h3}>Starter</div>
                <div style={ui.price}>$— /mo</div>
              </div>
              <ul>
                <li>Single dock</li>
                <li>Core verification flow</li>
              </ul>
              <div style={{ marginTop: 10 }}>
                <Link to="/join" style={ui.cta}>Start</Link>
              </div>
            </div>
            <div style={ui.tier(true)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={ui.h3}>Pro</div>
                <div style={ui.price}>$— /mo</div>
              </div>
              <ul>
                <li>Multiple docks</li>
                <li>Alerts + simple reporting</li>
              </ul>
              <div style={{ marginTop: 10 }}>
                <Link to="/join" style={ui.cta}>Upgrade</Link>
              </div>
            </div>
            <div style={ui.tier(false)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={ui.h3}>Enterprise</div>
                <div style={ui.price}>Custom</div>
              </div>
              <ul>
                <li>SSO + integrations</li>
                <li>Contract support</li>
              </ul>
              <div style={{ marginTop: 10 }}>
                <Link to="/join" style={ui.cta}>Talk to us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={ui.section()}>
        <div style={ui.wrap}>
          <div style={ui.h2}>What operations folks say</div>
          <div className="quotes">
            <div style={ui.quote}>
              “Dock team got it in 2 minutes. No training, just worked. The red ‘Do Not Load’ saved us a headache the first week.”
              <div style={{ marginTop: 8, fontStyle: "normal", opacity: .8 }}>— Ops Manager, Regional Shipper</div>
            </div>
            <div style={ui.quote}>
              “It cut the back-and-forth. We send one link, the dock verifies, done. Cleaner proof for our carrier partners too.”
              <div style={{ marginTop: 8, fontStyle: "normal", opacity: .8 }}>— Senior Broker, Freight Desk</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" style={ui.section()}>
        <div style={ui.wrap}>
          <div style={ui.h2}>FAQ</div>
          <div style={{ display: "grid", gap: 12 }}>
            <FAQ q="Do drivers need an app?">No. They tap a link sent by text. Done.</FAQ>
            <FAQ q="What if the dock can’t reach the driver?">Mark “No” to the call question. The system flags DO NOT LOAD.</FAQ>
            <FAQ q="Does this replace our TMS?">No. It runs alongside your ops. Pro/Enterprise can integrate later.</FAQ>
            <FAQ q="Who can request access?">Brokers & shippers only. Drivers don’t need accounts.</FAQ>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={ui.footer}>
        <div style={ui.footRow}>
          <div>
            <div style={ui.h3}>QueCab AdbS™</div>
            <div style={{ opacity: .8 }}>Secure your load — verify before you load.</div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/join" style={ui.navPrimary}>Request Access</Link>
            <Link to="/checkin" style={ui.navBtn}>Generate Verify Link</Link>
            <Link to="/about" style={ui.navBtn}>How it works</Link>
            <Link to="/login" style={ui.navBtn}>Log in</Link>
          </div>
        </div>
        <div style={{ ...ui.wrap, marginTop: 16, opacity: .7 }}>
          © {new Date().getFullYear()} QueCab AdbS — All rights reserved.
        </div>
      </footer>
    </div>
  );
}
