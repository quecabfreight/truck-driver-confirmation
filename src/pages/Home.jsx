import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { clearSession, getSession } from "../lib/session";

function makeToken(length = 22) {
  // URL-safe, no confusing characters
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length];
  return out;
}

function toISOFromDateTimeLocal(value) {
  // "YYYY-MM-DDTHH:MM" (local) -> ISO string
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function ControlCenter() {
  const navigate = useNavigate();
  const session = getSession();

  const [usdot, setUsdot] = useState("");
  const [plate, setPlate] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const [expiryMode, setExpiryMode] = useState("auto"); // auto | manual | none
  const [manualExpiresAt, setManualExpiresAt] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [issuedUrl, setIssuedUrl] = useState("");

  const normalized = useMemo(() => {
    const n = (s) => (s || "").trim().toUpperCase();
    return {
      usdot: n(usdot),
      plate: n(plate),
      phone: (driverPhone || "").trim(),
    };
  }, [usdot, plate, driverPhone]);

  function logout() {
    clearSession();
    navigate("/", { replace: true });
  }

  async function issueLink() {
    setErr("");
    setIssuedUrl("");

    if (!normalized.usdot) return setErr("USDOT# is required.");
    if (!normalized.plate) return setErr("Plate is required.");

    setLoading(true);
    try {
      const token = makeToken(22);

      let expires_at = null;

      if (expiryMode === "auto") {
        // Auto = 24 hours
        expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      } else if (expiryMode === "manual") {
        expires_at = toISOFromDateTimeLocal(manualExpiresAt);
        if (!expires_at) {
          setErr("Manual expiry selected — choose an expiration date/time.");
          setLoading(false);
          return;
        }
      } else {
        expires_at = null; // no expiry
      }

      const payload = {
        token,
        usdot_on_record: normalized.usdot,
        plate_on_record: normalized.plate,
        driver_phone: normalized.phone || null,
        status: "active",
        expires_at,
      };

      const { error } = await supabase.from("verify_links").insert([payload]);
      if (error) throw error;

      const url = `${window.location.origin}/#/verify/${token}`;
      setIssuedUrl(url);
    } catch (e) {
      console.error(e);
      setErr("Could not issue link. (Check table names + Supabase connection.)");
    } finally {
      setLoading(false);
    }
  }

  async function copyIssuedUrl() {
    if (!issuedUrl) return;
    try {
      await navigator.clipboard.writeText(issuedUrl);
    } catch {
      // clipboard can be blocked; ignore
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>Control Center</div>
      <div style={styles.cardSub}>
        Logged in as <b>{session?.email || "unknown"}</b>
      </div>

      <div style={styles.hr} />

      <div style={styles.sectionTitle}>Issue AdbS Truck-Driver Verify Link</div>
      <div style={styles.sectionSub}>
        Enter what you have on record. Dock staff will enter what they see on the truck.
      </div>

      <div style={styles.grid2}>
        <label style={styles.label}>
          USDOT#
          <input
            value={usdot}
            onChange={(e) => setUsdot(e.target.value)}
            placeholder="USDOT1234567"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Plate
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="ABC1234"
            style={styles.input}
          />
        </label>
      </div>

      <label style={styles.label}>
        Driver Phone (optional)
        <input
          value={driverPhone}
          onChange={(e) => setDriverPhone(e.target.value)}
          placeholder="123-456-7890"
          style={styles.input}
        />
      </label>

      <div style={styles.hrSoft} />

      <div style={styles.sectionTitle}>Expiration</div>

      <div style={styles.radioGroup}>
        <label style={styles.radioRow}>
          <input
            type="radio"
            name="expiryMode"
            checked={expiryMode === "auto"}
            onChange={() => setExpiryMode("auto")}
          />
          <span style={styles.radioText}>
            Auto (recommended) — expires in <b>24 hours</b>
          </span>
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
          <label style={styles.label}>
            Expires At (manual)
            <input
              type="datetime-local"
              value={manualExpiresAt}
              onChange={(e) => setManualExpiresAt(e.target.value)}
              style={styles.input}
            />
          </label>
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

      {err ? <div style={styles.error}>{err}</div> : null}

      <div style={styles.actionsRow}>
        <button
          onClick={issueLink}
          disabled={loading}
          style={{
            ...styles.buttonPrimary,
            opacity: loading ? 0.75 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Issuing..." : "Issue Verify Link"}
        </button>

        <button onClick={logout} style={styles.buttonDanger}>
          Log Out
        </button>
      </div>

      {issuedUrl ? (
        <div style={styles.issuedBox}>
          <div style={styles.issuedTitle}>Issued Link</div>

          <a href={issuedUrl} style={styles.issuedLink}>
            {issuedUrl}
          </a>

          <div style={styles.issuedActions}>
            <button onClick={copyIssuedUrl} style={styles.buttonGhost}>
              Copy
            </button>
            <a href={issuedUrl} style={styles.buttonGhostLink}>
              Open
            </a>
          </div>

          <div style={styles.issuedNote}>
            Dock staff should open this link at check-in.
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PublicHome() {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>QueCab AdbS</div>
      <div style={styles.cardSub}>
        Anti-Double-Brokering verification built for real docks.
      </div>

      <div style={styles.rows}>
        <Link to="/join" style={styles.rowButton}>
          Request Access
        </Link>

        <Link to="/login" style={styles.rowButton}>
          Already Authorized? Log In
        </Link>

        <Link to="/about" style={styles.rowButton}>
          About
        </Link>
      </div>

      <div style={styles.footer}>
        © {new Date().getFullYear()} QueCab AdbS
      </div>
    </div>
  );
}

export default function Home() {
  const session = getSession();

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topRow}>
          <a href="/#/" style={styles.brandLink} aria-label="Go Home">
            <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable="false" />
          </a>
        </div>

        {session?.approved ? <ControlCenter /> : <PublicHome />}
      </div>
    </div>
  );
}

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
  shell: { width: "100%", maxWidth: 900 },
  topRow: { display: "flex", justifyContent: "flex-start", marginBottom: 14 },
  brandLink: { display: "inline-flex", alignItems: "center" },
  logo: { width: 220, height: "auto" },

  card: {
    background: "rgba(12, 18, 30, 0.82)",
    border: "1px solid rgba(110, 160, 210, 0.22)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },
  cardTitle: { fontSize: 22, fontWeight: 900, marginBottom: 6 },
  cardSub: { fontSize: 14, color: "rgba(233, 238, 247, 0.75)" },

  sectionTitle: { marginTop: 4, fontSize: 16, fontWeight: 900 },
  sectionSub: { fontSize: 13, color: "rgba(233, 238, 247, 0.70)", marginBottom: 10 },

  rows: { display: "flex", flexDirection: "column", gap: 12, marginTop: 16 },
  rowButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "14px 14px",
    borderRadius: 14,
    background: "rgba(14, 22, 38, 0.65)",
    border: "1px solid rgba(110, 160, 210, 0.18)",
    color: "rgba(233, 238, 247, 0.95)",
    textDecoration: "none",
    fontSize: 18,
    fontWeight: 900,
  },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  label: { fontSize: 14, color: "rgba(233, 238, 247, 0.9)" },
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

  radioGroup: { display: "flex", flexDirection: "column", gap: 10, marginTop: 10 },
  radioRow: { display: "flex", alignItems: "center", gap: 10 },
  radioText: { fontSize: 14, color: "rgba(233, 238, 247, 0.85)" },

  hr: { height: 1, background: "rgba(110, 160, 210, 0.18)", margin: "14px 0" },
  hrSoft: { height: 1, background: "rgba(110, 160, 210, 0.12)", margin: "12px 0" },

  error: {
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(170, 30, 30, 0.18)",
    border: "1px solid rgba(255, 80, 80, 0.28)",
    color: "#ffd7d7",
    fontSize: 14,
  },

  actionsRow: { display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" },
  buttonPrimary: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.28)",
    background:
      "linear-gradient(180deg, rgba(40, 90, 150, 0.95), rgba(18, 45, 80, 0.95))",
    color: "#e9eef7",
    fontWeight: 900,
    fontSize: 15,
  },
  buttonDanger: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255, 80, 80, 0.28)",
    background: "rgba(170, 30, 30, 0.18)",
    color: "#ffd7d7",
    fontWeight: 900,
    fontSize: 15,
    cursor: "pointer",
  },

  issuedBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    background: "rgba(40, 90, 150, 0.12)",
    border: "1px solid rgba(110, 160, 210, 0.20)",
  },
  issuedTitle: { fontSize: 14, fontWeight: 900, marginBottom: 8 },
  issuedLink: {
    display: "block",
    padding: 10,
    borderRadius: 12,
    background: "rgba(8, 12, 20, 0.65)",
    border: "1px solid rgba(110, 160, 210, 0.18)",
    color: "rgba(233, 238, 247, 0.95)",
    textDecoration: "none",
    wordBreak: "break-all",
  },
  issuedActions: { display: "flex", gap: 10, marginTop: 10 },
  buttonGhost: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(14, 22, 38, 0.65)",
    border: "1px solid rgba(110, 160, 210, 0.18)",
    color: "rgba(233, 238, 247, 0.95)",
    fontWeight: 900,
    cursor: "pointer",
  },
  buttonGhostLink: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(14, 22, 38, 0.65)",
    border: "1px solid rgba(110, 160, 210, 0.18)",
    color: "rgba(233, 238, 247, 0.95)",
    fontWeight: 900,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  issuedNote: { marginTop: 10, fontSize: 12, color: "rgba(233, 238, 247, 0.70)" },

  footer: {
    marginTop: 16,
    fontSize: 12,
    color: "rgba(233, 238, 247, 0.55)",
    textAlign: "center",
  },
};
