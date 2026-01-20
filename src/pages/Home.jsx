import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

/**
 * Home.jsx
 * - Public home when not logged in
 * - Control Center when logged in (qc_session)
 * - Issue Verify Link inserts into verify_links
 * - Shows REAL Supabase error if issue fails
 * - Phone auto-hyphenation restored (123-456-7890)
 */

export default function Home() {
  const navigate = useNavigate();

  // ---------- Session ----------
  const session = useMemo(() => {
    try {
      const raw =
        localStorage.getItem("qc_session") || sessionStorage.getItem("qc_session");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.email) return null;
      return parsed;
    } catch {
      return null;
    }
  }, []);

  const email = session?.email || "";

  function logout() {
    localStorage.removeItem("qc_session");
    sessionStorage.removeItem("qc_session");
    navigate("/", { replace: true });
    // Hard reload ensures UI state resets cleanly
    window.location.href = "/#/";
  }

  // ---------- Control Center Form ----------
  const [usdot, setUsdot] = useState("");
  const [plate, setPlate] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const [expiryMode, setExpiryMode] = useState("auto"); // auto | manual | none
  const [manualExpiry, setManualExpiry] = useState(""); // datetime-local string

  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState("");
  const [issuedUrl, setIssuedUrl] = useState("");
  const [issuedToken, setIssuedToken] = useState("");

  // Clear any stale error when user edits inputs
  useEffect(() => {
    setIssueError("");
    // (don’t clear issuedUrl here — user may want to copy it)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usdot, plate, driverPhone, expiryMode, manualExpiry]);

  // ---------- Helpers ----------
  function cleanAlphaNumUpper(v) {
    return (v || "").toString().replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }

  function formatPhoneHyphen(v) {
    const digits = (v || "").replace(/\D/g, "").slice(0, 10);
    const a = digits.slice(0, 3);
    const b = digits.slice(3, 6);
    const c = digits.slice(6, 10);
    if (digits.length <= 3) return a;
    if (digits.length <= 6) return `${a}-${b}`;
    return `${a}-${b}-${c}`;
  }

  function phoneDigitsOnly(v) {
    const d = (v || "").replace(/\D/g, "").slice(0, 10);
    return d.length ? d : "";
  }

  function base64Url(bytes) {
    // Convert bytes to base64url (no + / =)
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const b64 = btoa(binary);
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function generateToken() {
    // 16 random bytes -> 22-ish chars base64url
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return base64Url(bytes);
  }

  function parseManualDatetimeLocal(dtLocal) {
    // dtLocal like "2026-01-20T18:30" (no timezone)
    // Treat as local time; convert to ISO string by constructing Date(dtLocal)
    if (!dtLocal) return null;
    const d = new Date(dtLocal);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  function buildVerifyUrl(token) {
    return `${window.location.origin}/#/verify/${token}`;
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  // ---------- Issue Link ----------
  async function handleIssueLink() {
    setIssueError("");
    setIssuedUrl("");
    setIssuedToken("");

    const usdotClean = cleanAlphaNumUpper(usdot);
    const plateClean = cleanAlphaNumUpper(plate);
    const phoneClean = phoneDigitsOnly(driverPhone);

    if (!usdotClean) {
      setIssueError("USDOT# is required.");
      return;
    }
    if (!plateClean) {
      setIssueError("Plate is required.");
      return;
    }

    // Expiry calculation
    const nowIso = new Date().toISOString();
    let expiresIso = null;

    if (expiryMode === "auto") {
      const d = new Date();
      d.setHours(d.getHours() + 24);
      expiresIso = d.toISOString();
    } else if (expiryMode === "manual") {
      const parsed = parseManualDatetimeLocal(manualExpiry);
      if (!parsed) {
        setIssueError("Manual expiry requires a valid date/time.");
        return;
      }
      expiresIso = parsed;
    } else {
      // none
      expiresIso = null;
    }

    const token = generateToken();

    setIssuing(true);
    try {
      // Insert into verify_links (YOUR ACTUAL COLUMN NAMES)
      const payload = {
        token,
        usdot_on_record: usdotClean,
        plate_on_record: plateClean,
        driver_phone: phoneClean ? formatPhoneHyphen(phoneClean) : null,
        status: "active",
        starts_at: nowIso,
        expires_at: expiresIso,
      };

      const { data, error } = await supabase.from("verify_links").insert([payload]).select("*");

      if (error) {
        // Show REAL error message (no more guessing)
        const msgParts = [
          error.message || "Unknown Supabase error",
          error.details ? `Details: ${error.details}` : "",
          error.hint ? `Hint: ${error.hint}` : "",
        ].filter(Boolean);
        throw new Error(msgParts.join(" | "));
      }

      // Sanity: ensure row exists
      if (!data || !data.length) {
        throw new Error("Insert returned no data. (Insert may have failed silently.)");
      }

      const url = buildVerifyUrl(token);
      setIssuedToken(token);
      setIssuedUrl(url);
    } catch (err) {
      console.error(err);
      setIssueError(
        `Could not issue link. ${err?.message ? `(${err.message})` : "(Unknown error)"}`
      );
    } finally {
      setIssuing(false);
    }
  }

  // ---------- PUBLIC HOME ----------
  if (!session) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <a href="/#/" style={styles.brandLink} aria-label="Go Home">
            <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable="false" />
          </a>

          <div style={styles.card}>
            <div style={styles.cardTitle}>QueCab AdbS</div>
            <div style={styles.cardText}>
              Reduce double-brokering risk with fast Truck-Driver confirmation (truck + driver as a pair).
            </div>

            <div style={styles.rowList}>
              <button style={styles.primaryRowBtn} onClick={() => navigate("/join")}>
                Request Access
              </button>

              <button style={styles.rowBtn} onClick={() => navigate("/login")}>
                Already Authorized? Log In
              </button>

              <button style={styles.rowBtn} onClick={() => navigate("/about")}>
                About
              </button>
            </div>

            <div style={styles.footer}>© {new Date().getFullYear()} QueCab AdbS</div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- CONTROL CENTER ----------
  return (
    <div style={styles.page}>
      <div style={styles.shellWide}>
        <a href="/#/" style={styles.brandLink} aria-label="Go Home">
          <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable="false" />
        </a>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Control Center</div>
          <div style={styles.subText}>Logged in as {email}</div>

          <div style={styles.sectionTitle}>Issue AdbS Truck-Driver Verify Link</div>
          <div style={styles.sectionHint}>
            Enter what you have on record. Dock staff will enter what they see on the truck.
          </div>

          <div style={styles.formGrid}>
            <label style={styles.label}>
              USDOT#
              <input
                value={usdot}
                onChange={(e) => setUsdot(e.target.value)}
                placeholder="Enter USDOT#"
                style={styles.input}
                autoComplete="off"
              />
            </label>

            <label style={styles.label}>
              Plate
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="Enter Plate"
                style={styles.input}
                autoComplete="off"
              />
            </label>

            <label style={styles.label}>
              Driver Phone (optional)
              <input
                value={driverPhone}
                onChange={(e) => setDriverPhone(formatPhoneHyphen(e.target.value))}
                placeholder="123-456-7890"
                style={styles.input}
                inputMode="numeric"
                autoComplete="tel"
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={styles.labelPlain}>Expiration</div>

            <div style={styles.radioBlock}>
              <label style={styles.radioRow}>
                <input
                  type="radio"
                  name="expiryMode"
                  checked={expiryMode === "auto"}
                  onChange={() => setExpiryMode("auto")}
                />
                <span style={styles.radioText}>Auto (recommended) — expires in 24 hours</span>
              </label>

              <label style={styles.radioRow}>
                <input
                  type="radio"
                  name="expiryMode"
                  checked={expiryMode === "manual"}
                  onChange={() => setExpiryMode("manual")}
                />
                <span style={styles.radioText}>Manual — pick date/time</span>
              </label>

              {expiryMode === "manual" ? (
                <div style={styles.manualWrap}>
                  <input
                    type="datetime-local"
                    value={manualExpiry}
                    onChange={(e) => setManualExpiry(e.target.value)}
                    style={styles.input}
                  />
                </div>
              ) : null}

              <label style={styles.radioRow}>
                <input
                  type="radio"
                  name="expiryMode"
                  checked={expiryMode === "none"}
                  onChange={() => setExpiryMode("none")}
                />
                <span style={styles.radioText}>No expiry</span>
              </label>
            </div>
          </div>

          {issueError ? <div style={styles.error}>{issueError}</div> : null}

          {issuedUrl ? (
            <div style={styles.successBox}>
              <div style={styles.successTitle}>Verify Link Issued</div>

              <a href={issuedUrl} style={styles.linkBtn} target="_blank" rel="noreferrer">
                Open Verify Link
              </a>

              <div style={styles.smallMono}>Token: {issuedToken}</div>

              <div style={styles.copyRow}>
                <div style={styles.copyUrl}>{issuedUrl}</div>
                <button
                  style={styles.copyBtn}
                  onClick={async () => {
                    const ok = await copyToClipboard(issuedUrl);
                    if (!ok) alert("Copy failed. Please copy manually.");
                  }}
                >
                  Copy
                </button>
              </div>

              <div style={styles.noteText}>
                Dock staff will use this link to confirm USDOT# + Plate match and record the check result.
              </div>
            </div>
          ) : null}

          <div style={styles.btnRow}>
            <button
              style={{ ...styles.primaryBtn, opacity: issuing ? 0.75 : 1 }}
              onClick={handleIssueLink}
              disabled={issuing}
            >
              {issuing ? "Issuing..." : "Issue Verify Link"}
            </button>

            <button style={styles.ghostBtn} onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Styles ----------
const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 10%, rgba(58, 110, 160, 0.20), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(30, 80, 140, 0.18), transparent 55%), #06090f",
    color: "#e9eef7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  shell: { width: "100%", maxWidth: 760 },
  shellWide: { width: "100%", maxWidth: 980 },
  brandLink: { display: "inline-flex", alignItems: "center", marginBottom: 14 },
  logo: { width: 220, height: "auto" },

  card: {
    background: "rgba(12, 18, 30, 0.82)",
    border: "1px solid rgba(110, 160, 210, 0.22)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },
  cardTitle: { fontSize: 22, fontWeight: 900, marginBottom: 6 },
  cardText: { fontSize: 15, lineHeight: 1.5, color: "rgba(233, 238, 247, 0.85)" },
  subText: { fontSize: 13, color: "rgba(233, 238, 247, 0.65)", marginBottom: 14 },

  rowList: { display: "grid", gap: 10, marginTop: 14 },
  primaryRowBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.28)",
    background: "linear-gradient(180deg, rgba(40, 90, 150, 0.95), rgba(18, 45, 80, 0.95))",
    color: "#e9eef7",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
  rowBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.22)",
    background: "rgba(8, 12, 20, 0.75)",
    color: "#e9eef7",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
  },

  footer: {
    marginTop: 16,
    fontSize: 12,
    color: "rgba(233, 238, 247, 0.55)",
    textAlign: "center",
  },

  sectionTitle: { fontSize: 16, fontWeight: 900, marginTop: 6 },
  sectionHint: { fontSize: 13, color: "rgba(233, 238, 247, 0.70)", marginTop: 4, marginBottom: 10 },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
  },

  label: { display: "block", fontSize: 13, color: "rgba(233, 238, 247, 0.9)" },
  labelPlain: { fontSize: 13, color: "rgba(233, 238, 247, 0.9)", marginBottom: 8 },

  input: {
    width: "100%",
    marginTop: 6,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.25)",
    background: "rgba(8, 12, 20, 0.75)",
    color: "#e9eef7",
    outline: "none",
    fontSize: 16,
  },

  radioBlock: { display: "grid", gap: 8 },
  radioRow: { display: "flex", alignItems: "center", gap: 10 },
  radioText: { fontSize: 14, color: "rgba(233, 238, 247, 0.82)" },
  manualWrap: { marginLeft: 26, maxWidth: 360 },

  btnRow: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" },
  primaryBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.28)",
    background: "linear-gradient(180deg, rgba(40, 90, 150, 0.95), rgba(18, 45, 80, 0.95))",
    color: "#e9eef7",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
    minWidth: 220,
  },
  ghostBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.22)",
    background: "rgba(8, 12, 20, 0.75)",
    color: "#e9eef7",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
    minWidth: 140,
  },

  error: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(170, 30, 30, 0.18)",
    border: "1px solid rgba(255, 80, 80, 0.28)",
    color: "#ffd7d7",
    fontSize: 14,
  },

  successBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.22)",
    background: "rgba(8, 12, 20, 0.55)",
  },
  successTitle: { fontSize: 14, fontWeight: 900, marginBottom: 8 },
  linkBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.28)",
    background: "linear-gradient(180deg, rgba(40, 90, 150, 0.95), rgba(18, 45, 80, 0.95))",
    color: "#e9eef7",
    fontWeight: 900,
    textDecoration: "none",
    marginBottom: 10,
  },
  copyRow: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  copyUrl: {
    fontSize: 12,
    color: "rgba(233, 238, 247, 0.78)",
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.20)",
    background: "rgba(8, 12, 20, 0.60)",
    maxWidth: 720,
    overflowWrap: "anywhere",
  },
  copyBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.22)",
    background: "rgba(8, 12, 20, 0.75)",
    color: "#e9eef7",
    fontWeight: 900,
    cursor: "pointer",
  },
  smallMono: { fontSize: 12, color: "rgba(233, 238, 247, 0.60)", marginBottom: 8 },
  noteText: { fontSize: 12, color: "rgba(233, 238, 247, 0.62)", marginTop: 10 },

  // Responsive
  "@media(max-width: 860px)": {},
};

// Simple responsive tweak without media queries in inline styles:
(function applyInlineResponsiveHack() {
  // no-op: kept intentionally minimal to avoid layout regressions
})();
