import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

function fmtPhone(raw) {
  const d = String(raw || "").replace(/\D/g, "").slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function digitsOnly(v) {
  return String(v || "").replace(/\D/g, "");
}

export default function Verify() {
  const { token } = useParams();

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [enteredUsdot, setEnteredUsdot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");
  const [driverAnswered, setDriverAnswered] = useState(""); // "YES" | "NO" | ""

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { verdict, message }

  // Load verify link details (expects an existing endpoint in your build)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setErr("");
      setResult(null);

      try {
        const r = await fetch(`/api/get_verify_link?token=${encodeURIComponent(token || "")}`, {
          method: "GET",
        });

        const text = await r.text();
        let data = null;
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }

        if (!r.ok || !data?.ok) {
          const msg = data?.error ? String(data.error) : `Unable to load link (HTTP ${r.status}).`;
          if (!cancelled) setErr(msg);
          if (!cancelled) setLoading(false);
          return;
        }

        if (!cancelled) {
          setLink(data.link || null);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(`Unable to load link. ${String(e?.message || e)}`);
          setLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const usdotMatch = useMemo(() => {
    const onRecord = digitsOnly(link?.usdot_on_record || "");
    const entered = digitsOnly(enteredUsdot);
    if (!onRecord || !entered) return "";
    return onRecord === entered ? "YES" : "NO";
  }, [link, enteredUsdot]);

  const plateMatch = useMemo(() => {
    // Compare case-insensitive, but we DISPLAY uppercase because dock people like it that way.
    const onRecord = String(link?.plate_on_record || "").trim().toUpperCase();
    const entered = String(enteredPlate || "").trim().toUpperCase();
    if (!onRecord || !entered) return "";
    return onRecord === entered ? "YES" : "NO";
  }, [link, enteredPlate]);

  const canSubmit = useMemo(() => {
    return (
      !loading &&
      !err &&
      token &&
      digitsOnly(enteredUsdot).length > 0 &&
      String(enteredPlate || "").trim().length > 0 &&
      (driverAnswered === "YES" || driverAnswered === "NO")
    );
  }, [loading, err, token, enteredUsdot, enteredPlate, driverAnswered]);

  async function submit() {
    setSubmitting(true);
    setResult(null);

    try {
      const r = await fetch("/api/verify_and_log_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          entered_usdot: digitsOnly(enteredUsdot),
          entered_plate: String(enteredPlate || "").trim(), // backend can compare case-insensitive
          driver_answered: driverAnswered === "YES",
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
        setResult({
          verdict: "error",
          message: data?.error ? String(data.error) : `Submit failed (HTTP ${r.status}).`,
        });
        setSubmitting(false);
        return;
      }

      setResult({
        verdict: String(data.result || "").toLowerCase() === "clear" ? "clear" : "caution",
        message:
          String(data.result || "").toLowerCase() === "clear"
            ? "Truck-Driver verification passed."
            : "Caution conditions detected. Do not load until resolved.",
      });
    } catch (e) {
      setResult({ verdict: "error", message: `Submit failed. ${String(e?.message || e)}` });
    } finally {
      setSubmitting(false);
    }
  }

  const driverPhone = fmtPhone(link?.driver_phone || "");

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <a href="/#/" style={styles.brandLink} aria-label="Go Home">
          <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable="false" />
        </a>

        <div style={styles.card}>
          <div style={styles.bigQ}>DOES THE USDOT# ON THE TRUCK MATCH?</div>
          <div style={styles.bigQ}>DID THE DRIVER ANSWER THEIR PHONE?</div>
          <div style={styles.note}>Both must be YES to clear the Truck-Driver for loading.</div>

          {loading ? <div style={styles.status}>Loading…</div> : null}
          {err ? <div style={styles.error}>{err}</div> : null}

          {!loading && !err ? (
            <>
              <div style={styles.grid}>
                <label style={styles.label}>
                  Enter USDOT#
                  <input
                    value={enteredUsdot}
                    onChange={(e) => setEnteredUsdot(e.target.value.toUpperCase())} // ✅ auto-uppercase
                    placeholder="ABC123456 (or 123456)"
                    style={styles.input}
                    inputMode="text"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </label>

                <label style={styles.label}>
                  Enter Plate
                  <input
                    value={enteredPlate}
                    onChange={(e) => setEnteredPlate(e.target.value.toUpperCase())} // ✅ auto-uppercase
                    placeholder="ABC1234"
                    style={styles.input}
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </label>
              </div>

              <div style={styles.matchRow}>
                <div style={styles.matchPill}>
                  <span style={styles.matchLabel}>USDOT Match:</span>{" "}
                  <span style={styles.matchValue}>{usdotMatch || "—"}</span>
                </div>
                <div style={styles.matchPill}>
                  <span style={styles.matchLabel}>Plate Match:</span>{" "}
                  <span style={styles.matchValue}>{plateMatch || "—"}</span>
                </div>
              </div>

              <div style={styles.driverBlock}>
                <div style={styles.driverTitle}>Driver Answered Phone?</div>

                <div style={styles.ynRow}>
                  <button
                    type="button"
                    onClick={() => setDriverAnswered("YES")}
                    style={{
                      ...styles.ynBtn,
                      ...(driverAnswered === "YES" ? styles.ynOnYes : {}),
                    }}
                  >
                    YES
                  </button>

                  <button
                    type="button"
                    onClick={() => setDriverAnswered("NO")}
                    style={{
                      ...styles.ynBtn,
                      ...(driverAnswered === "NO" ? styles.ynOnNo : {}),
                    }}
                  >
                    NO
                  </button>
                </div>

                <div style={styles.phoneRow}>
                  <div>
                    <div style={styles.phoneLabel}>Driver Phone</div>
                    <div style={styles.phoneValue}>{driverPhone || "—"}</div>
                  </div>

                  <a
                    href={driverPhone ? `tel:${driverPhone}` : undefined}
                    style={{
                      ...styles.callBtn,
                      opacity: driverPhone ? 1 : 0.55,
                      pointerEvents: driverPhone ? "auto" : "none",
                    }}
                  >
                    Call Now
                  </a>
                </div>

                <div style={styles.smallNote}>Visible for authorized dock/check-in personnel.</div>
              </div>

              <button
                onClick={submit}
                disabled={!canSubmit || submitting}
                style={{
                  ...styles.submitBtn,
                  opacity: !canSubmit || submitting ? 0.6 : 1,
                  cursor: !canSubmit || submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Submitting…" : "Submit Verification"}
              </button>

              {result ? (
                <div
                  style={{
                    ...styles.verdictBox,
                    ...(result.verdict === "clear" ? styles.verdictClear : {}),
                    ...(result.verdict === "caution" ? styles.verdictCaution : {}),
                    ...(result.verdict === "error" ? styles.verdictError : {}),
                  }}
                >
                  <div style={styles.verdictTitle}>
                    {result.verdict === "clear"
                      ? "CLEAR TO LOAD"
                      : result.verdict === "caution"
                      ? "CAUTION ALERT — DO NOT LOAD"
                      : "ERROR"}
                  </div>
                  <div style={styles.verdictText}>{result.message}</div>
                </div>
              ) : null}
            </>
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
  shell: { width: "100%", maxWidth: 860 },
  brandLink: { display: "inline-flex", alignItems: "center", marginBottom: 14 },
  logo: { width: 220, height: "auto" },

  card: {
    background: "rgba(12, 18, 30, 0.82)",
    border: "1px solid rgba(110, 160, 210, 0.22)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },

  bigQ: { fontSize: 22, fontWeight: 900, letterSpacing: 0.2, marginBottom: 6 },
  note: { fontSize: 14, opacity: 0.85, marginBottom: 14 },

  status: { padding: "10px 12px", opacity: 0.9 },
  error: {
    marginBottom: 12,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(170, 30, 30, 0.18)",
    border: "1px solid rgba(255, 80, 80, 0.28)",
    color: "#ffd7d7",
    fontSize: 14,
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 },
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
    fontSize: 18,
  },

  matchRow: { marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" },
  matchPill: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(10, 14, 22, 0.35)",
    display: "inline-flex",
    gap: 8,
    alignItems: "baseline",
  },
  matchLabel: { fontSize: 14, opacity: 0.8, fontWeight: 900 },
  matchValue: { fontSize: 16, fontWeight: 900 },

  driverBlock: {
    marginTop: 14,
    borderRadius: 14,
    border: "1px solid rgba(120, 190, 255, 0.22)",
    background: "rgba(20, 35, 60, 0.55)",
    padding: 14,
  },
  driverTitle: { fontSize: 16, fontWeight: 900, marginBottom: 10 },

  ynRow: { display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" },
  ynBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(10, 14, 22, 0.35)",
    color: "#e9eef7",
    fontSize: 16,
    fontWeight: 900,
    minWidth: 120,
    cursor: "pointer",
  },
  ynOnYes: { background: "rgba(20, 130, 80, 0.85)" },
  ynOnNo: { background: "rgba(170, 30, 30, 0.75)" },

  phoneRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  phoneLabel: { fontSize: 12, opacity: 0.8, fontWeight: 900 },
  phoneValue: { fontSize: 18, fontWeight: 900, letterSpacing: 0.6 },

  callBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(36, 110, 210, 0.85)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 900,
    textDecoration: "none",
  },

  smallNote: { marginTop: 10, fontSize: 12, opacity: 0.82 },

  submitBtn: {
    marginTop: 14,
    width: "100%",
    padding: "14px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.28)",
    background: "linear-gradient(180deg, rgba(40, 90, 150, 0.95), rgba(18, 45, 80, 0.95))",
    color: "#e9eef7",
    fontWeight: 900,
    fontSize: 18,
  },

  verdictBox: {
    marginTop: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(10, 14, 22, 0.35)",
    padding: 14,
  },
  verdictTitle: { fontSize: 20, fontWeight: 900, marginBottom: 6 },
  verdictText: { fontSize: 14, opacity: 0.9 },

  verdictClear: {
    border: "1px solid rgba(80, 255, 160, 0.22)",
    background: "rgba(20, 130, 80, 0.18)",
  },
  verdictCaution: {
    border: "1px solid rgba(255, 80, 80, 0.28)",
    background: "rgba(170, 30, 30, 0.18)",
  },
  verdictError: {
    border: "1px solid rgba(255, 210, 80, 0.28)",
    background: "rgba(180, 120, 20, 0.18)",
  },
};
