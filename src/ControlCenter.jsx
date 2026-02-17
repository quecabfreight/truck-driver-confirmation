import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function readSession() {
  try {
    const a = localStorage.getItem("qc_session");
    if (a) return JSON.parse(a);
  } catch {}
  try {
    const b = sessionStorage.getItem("qc_session");
    if (b) return JSON.parse(b);
  } catch {}
  return null;
}

function fmtPhone(raw) {
  const d = String(raw || "").replace(/\D/g, "").slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

export default function ControlCenter() {
  const nav = useNavigate();
  const [session, setSession] = useState(readSession());

  const [usdot, setUsdot] = useState("");
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [verifyUrl, setVerifyUrl] = useState("");

  useEffect(() => {
    const s = readSession();
    setSession(s);
    if (!s?.email) nav("/login", { replace: true });
  }, [nav]);

  const businessEmail = (session?.email || "").trim().toLowerCase();
  const accessCode = (session?.code || "").trim().toUpperCase();

  const canIssue = useMemo(() => {
    return businessEmail && accessCode && usdot.replace(/\D/g, "").length > 0 && plate.trim() && phone.trim().length >= 12;
  }, [businessEmail, accessCode, usdot, plate, phone]);

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      setMsg("Copied.");
      setTimeout(() => setMsg(""), 1200);
    } catch {
      window.prompt("Copy:", String(text || ""));
    }
  }

  async function issue() {
    setMsg("");
    setVerifyUrl("");
    setLoading(true);

    try {
      const r = await fetch("/api/issue_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_email: businessEmail,
          access_code: accessCode,
          usdot_on_record: usdot,
          plate_on_record: plate,
          driver_phone: phone,
        }),
      });

      const text = await r.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!r.ok || !data?.ok) {
        setMsg(data?.error ? `Error: ${data.error}` : `Error (HTTP ${r.status}).`);
        setLoading(false);
        return;
      }

      setVerifyUrl(String(data.verify_url || ""));
      setMsg("Verify Link issued.");
    } catch (e) {
      setMsg(`Error: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("qc_session");
    sessionStorage.removeItem("qc_session");
    nav("/", { replace: true });
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <a href="/#/" style={styles.brandLink} aria-label="Go Home">
          <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable="false" />
        </a>

        <div style={styles.card}>
          <div style={styles.headRow}>
            <div>
              <div style={styles.title}>Control Center</div>
              <div style={styles.sub}>Issue an AdbS Truck-Driver Verify Link for dock check-in.</div>
            </div>
            <button onClick={logout} style={styles.logoutBtn}>Log out</button>
          </div>

          <div style={styles.meta}>
            <div style={styles.metaRow}><span style={styles.metaLabel}>Signed in:</span> <span style={styles.metaValue}>{businessEmail || "—"}</span></div>
            <div style={styles.metaRow}><span style={styles.metaLabel}>Access Code:</span> <span style={styles.metaValue}>{accessCode || "—"}</span></div>
          </div>

          <div style={styles.grid}>
            <label style={styles.label}>
              USDOT on record (digits only)
              <input
                value={usdot}
                onChange={(e) => setUsdot(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="1234567"
                style={styles.input}
                inputMode="numeric"
              />
            </label>

            <label style={styles.label}>
              Plate on record
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="ABC1234"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Driver phone
              <input
                value={phone}
                onChange={(e) => setPhone(fmtPhone(e.target.value))}
                placeholder="123-456-7890"
                style={styles.input}
                inputMode="tel"
              />
            </label>
          </div>

          {msg ? <div style={styles.status}>{msg}</div> : null}

          <button
            onClick={issue}
            disabled={!canIssue || loading}
            style={{
              ...styles.bigBtn,
              opacity: !canIssue || loading ? 0.6 : 1,
              cursor: !canIssue || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Issuing…" : "Issue Verify Link"}
          </button>

          {verifyUrl ? (
            <div style={styles.result}>
              <div style={styles.resultTitle}>Verify URL</div>
              <div style={styles.urlRow}>
                <a href={verifyUrl} style={styles.urlLink} target="_blank" rel="noreferrer">
                  {verifyUrl}
                </a>
                <button onClick={() => copy(verifyUrl)} style={styles.copyBtn}>Copy</button>
              </div>
              <div style={styles.hint}>
                This link is intended for authorized check-in personnel to use at the dock.
              </div>
            </div>
          ) : null}
        </div>
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
  brandLink: { display: "inline-flex", alignItems: "center", marginBottom: 14 },
  logo: { width: 220, height: "auto" },

  card: {
    background: "rgba(12, 18, 30, 0.82)",
    border: "1px solid rgba(110, 160, 210, 0.22)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },

  headRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  title: { fontSize: 22, fontWeight: 900, marginBottom: 6 },
  sub: { fontSize: 14, opacity: 0.85 },

  logoutBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(10, 14, 22, 0.45)",
    color: "#e9eef7",
    fontWeight: 900,
    cursor: "pointer",
  },

  meta: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(10, 14, 22, 0.25)",
  },
  metaRow: { display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap", marginBottom: 6 },
  metaLabel: { fontSize: 13, opacity: 0.75, fontWeight: 900 },
  metaValue: { fontSize: 14, fontWeight: 900 },

  grid: { marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 },
  label: { display: "block", fontSize: 14, opacity: 0.92 },
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

  status: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 14,
    opacity: 0.95,
  },

  bigBtn: {
    marginTop: 12,
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.28)",
    background: "linear-gradient(180deg, rgba(40, 90, 150, 0.95), rgba(18, 45, 80, 0.95))",
    color: "#e9eef7",
    fontWeight: 900,
    fontSize: 16,
  },

  result: {
    marginTop: 14,
    borderRadius: 14,
    border: "1px solid rgba(120, 190, 255, 0.22)",
    background: "rgba(20, 35, 60, 0.55)",
    padding: 14,
  },
  resultTitle: { fontSize: 14, fontWeight: 900, marginBottom: 10, opacity: 0.95 },
  urlRow: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  urlLink: {
    color: "#d8ebff",
    fontWeight: 900,
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(10, 14, 22, 0.35)",
    wordBreak: "break-all",
  },
  copyBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(36, 110, 210, 0.85)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  hint: { marginTop: 10, fontSize: 13, opacity: 0.82 },
};
