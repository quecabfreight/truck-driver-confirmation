import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function norm(s) {
  return (s || "").trim().toUpperCase();
}

function fmtDateTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "";
  }
}

export default function Verify() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [linkRow, setLinkRow] = useState(null);
  const [err, setErr] = useState("");

  const [enteredUsdot, setEnteredUsdot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");
  const [driverAnswered, setDriverAnswered] = useState(null); // true | false | null

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(""); // "clear" | "caution" | ""

  // Load verify_links row by token
  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      setLinkRow(null);
      setResult("");

      try {
        const t = (token || "").trim();
        if (!t) {
          setErr("Invalid verification link.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("verify_links")
          .select("token, usdot_on_record, plate_on_record, driver_phone, status, starts_at, expires_at, created_at")
          .eq("token", t)
          .limit(1);

        if (error) throw error;

        const row = Array.isArray(data) && data.length ? data[0] : null;
        if (!row) {
          setErr("Verification link not found.");
          setLoading(false);
          return;
        }

        if (!alive) return;
        setLinkRow(row);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setErr("Could not load verification link.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [token]);

  const computed = useMemo(() => {
    if (!linkRow) return null;

    const recordUsdot = norm(linkRow.usdot_on_record);
    const recordPlate = norm(linkRow.plate_on_record);

    const enteredU = norm(enteredUsdot);
    const enteredP = norm(enteredPlate);

    const usdotMatch = !!recordUsdot && !!enteredU && recordUsdot === enteredU;
    const plateMatch = !!recordPlate && !!enteredP && recordPlate === enteredP;

    const startsAtMs = linkRow.starts_at ? new Date(linkRow.starts_at).getTime() : null;
    const expiresAtMs = linkRow.expires_at ? new Date(linkRow.expires_at).getTime() : null;
    const nowMs = Date.now();

    const notStarted = startsAtMs !== null && nowMs < startsAtMs;
    const isExpired = expiresAtMs !== null && nowMs > expiresAtMs;

    const status = (linkRow.status || "").toLowerCase();
    const statusBlocks = status && status !== "active";

    return {
      recordUsdot,
      recordPlate,
      enteredU,
      enteredP,
      usdotMatch,
      plateMatch,
      notStarted,
      isExpired,
      status,
      statusBlocks,
      startsAtText: fmtDateTime(linkRow.starts_at),
      expiresAtText: fmtDateTime(linkRow.expires_at),
    };
  }, [linkRow, enteredUsdot, enteredPlate]);

  async function submitVerification() {
    setErr("");
    setResult("");

    if (!linkRow || !computed) return;

    // Hard blocks
    if (computed.statusBlocks) {
      setResult("caution");
      return;
    }
    if (computed.notStarted) {
      setResult("caution");
      return;
    }
    if (computed.isExpired) {
      // Mark expired (best effort)
      try {
        await supabase.from("verify_links").update({ status: "expired" }).eq("token", linkRow.token);
      } catch {}
      setResult("caution");
      return;
    }

    if (!computed.enteredU || !computed.enteredP) {
      setErr("Enter BOTH USDOT# and Plate.");
      return;
    }

    if (driverAnswered !== true && driverAnswered !== false) {
      setErr("Select whether the driver answered their phone.");
      return;
    }

    const finalResult =
      computed.usdotMatch && computed.plateMatch && driverAnswered === true ? "clear" : "caution";

    setSubmitting(true);
    try {
      // Log to verify_checks
      const payload = {
        token: linkRow.token,
        entered_usdot: computed.enteredU,
        entered_plate: computed.enteredP,
        driver_answered: driverAnswered, // nullable allowed, but we require choice in UI
        result: finalResult,
        // checked_at will default to now() in DB
      };

      const { error: insErr } = await supabase.from("verify_checks").insert([payload]);
      if (insErr) throw insErr;

      // Mark used (best effort)
      try {
        await supabase.from("verify_links").update({ status: "used" }).eq("token", linkRow.token);
      } catch {}

      setResult(finalResult);
    } catch (e) {
      console.error(e);
      setErr("Could not save verification result.");
    } finally {
      setSubmitting(false);
    }
  }

  const verdict =
    result === "clear"
      ? { title: "CLEAR TO LOAD", tone: "clear" }
      : result === "caution"
      ? { title: "CAUTION ALERT — DO NOT LOAD", tone: "caution" }
      : null;

  const phone = (linkRow?.driver_phone || "").trim();

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topRow}>
          <a href="/#/" style={styles.brandLink} aria-label="Go Home">
            <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable="false" />
          </a>
        </div>

        <div style={styles.card}>
          <div style={styles.bigTitle}>DOES THE USDOT# ON THE TRUCK MATCH?</div>
          <div style={styles.bigTitle}>DID THE DRIVER ANSWER THEIR PHONE?</div>
          <div style={styles.subText}>
            Both must be <b>YES</b> to clear the Truck-Driver for loading.
          </div>

          {loading ? <div style={styles.notice}>Loading…</div> : null}
          {err ? <div style={styles.error}>{err}</div> : null}

          {!loading && linkRow && computed ? (
            <>
              {/* Status / timing banners */}
              {computed.statusBlocks ? (
                <div style={styles.error}>
                  Link status is <b>{computed.status}</b>. Treat as CAUTION.
                </div>
              ) : null}

              {computed.notStarted ? (
                <div style={styles.error}>
                  Link not active yet. Starts: <b>{computed.startsAtText || "N/A"}</b>
                </div>
              ) : null}

              {computed.isExpired ? (
                <div style={styles.error}>
                  Link expired: <b>{computed.expiresAtText || "N/A"}</b>
                </div>
              ) : null}

              <div style={styles.grid2}>
                <label style={styles.label}>
                  Enter USDOT#
                  <input
                    value={enteredUsdot}
                    onChange={(e) => setEnteredUsdot(e.target.value)}
                    placeholder="USDOT1234567"
                    style={styles.inputBig}
                  />
                </label>

                <label style={styles.label}>
                  Enter Plate
                  <input
                    value={enteredPlate}
                    onChange={(e) => setEnteredPlate(e.target.value)}
                    placeholder="ABC1234"
                    style={styles.inputBig}
                  />
                </label>
              </div>

              <div style={styles.matchRow}>
                <div style={styles.matchChip(computed.usdotMatch ? "good" : "bad")}>
                  USDOT Match: {computed.usdotMatch ? "YES" : "NO"}
                </div>
                <div style={styles.matchChip(computed.plateMatch ? "good" : "bad")}>
                  Plate Match: {computed.plateMatch ? "YES" : "NO"}
                </div>
              </div>

              <div style={styles.hr} />

              <div style={styles.sectionTitle}>Driver Answered Phone?</div>
              <div style={styles.radioRowWrap}>
                <label style={styles.radioRow}>
                  <input
                    type="radio"
                    name="driverAnswered"
                    checked={driverAnswered === true}
                    onChange={() => setDriverAnswered(true)}
                  />
                  <span style={styles.radioText}>YES</span>
                </label>

                <label style={styles.radioRow}>
                  <input
                    type="radio"
                    name="driverAnswered"
                    checked={driverAnswered === false}
                    onChange={() => setDriverAnswered(false)}
                  />
                  <span style={styles.radioText}>NO</span>
                </label>
              </div>

              {phone ? (
                <div style={styles.callBox}>
                  <div style={styles.callTitle}>Driver Phone</div>
                  <div style={styles.callPhone}>{phone}</div>
                  <div style={styles.callActions}>
                    <a href={`tel:${phone}`} style={styles.buttonGhostLink}>
                      Call Now
                    </a>
                  </div>
                  <div style={styles.callNote}>Visible for authorized dock/check-in personnel.</div>
                </div>
              ) : (
                <div style={styles.notice}>Driver phone not provided for this link.</div>
              )}

              <div style={styles.hr} />

              <button
                onClick={submitVerification}
                disabled={submitting || computed.notStarted || computed.isExpired || computed.statusBlocks}
                style={{
                  ...styles.buttonPrimary,
                  opacity: submitting ? 0.75 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Submitting…" : "Submit Verification"}
              </button>

              {verdict ? (
                <div style={styles.verdictBox(verdict.tone)}>
                  <div style={styles.verdictTitle(verdict.tone)}>{verdict.title}</div>
                  <div style={styles.verdictSub}>
                    {verdict.tone === "clear"
                      ? "Truck-Driver verification passed."
                      : "Truck-Driver verification failed. Escalate before loading."}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <div style={styles.footer}>© {new Date().getFullYear()} QueCab AdbS</div>
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
  shell: { width: "100%", maxWidth: 980 },
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

  bigTitle: { fontSize: 22, fontWeight: 950, letterSpacing: 0.3, marginBottom: 6 },
  subText: { fontSize: 14, color: "rgba(233, 238, 247, 0.78)", marginBottom: 14 },

  sectionTitle: { fontSize: 16, fontWeight: 900, marginBottom: 8 },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  label: { fontSize: 14, color: "rgba(233, 238, 247, 0.9)" },
  inputBig: {
    width: "100%",
    marginTop: 6,
    padding: "14px 12px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.25)",
    background: "rgba(8, 12, 20, 0.75)",
    color: "#e9eef7",
    outline: "none",
    fontSize: 18,
    fontWeight: 900,
  },

  matchRow: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" },
  matchChip: (tone) => ({
    padding: "10px 12px",
    borderRadius: 12,
    background: tone === "good" ? "rgba(40, 120, 70, 0.18)" : "rgba(170, 30, 30, 0.18)",
    border:
      tone === "good"
        ? "1px solid rgba(80, 220, 140, 0.28)"
        : "1px solid rgba(255, 80, 80, 0.28)",
    color: "#e9eef7",
    fontWeight: 950,
    fontSize: 14,
  }),

  radioRowWrap: { display: "flex", gap: 18, alignItems: "center" },
  radioRow: { display: "flex", gap: 10, alignItems: "center" },
  radioText: { fontSize: 16, fontWeight: 900 },

  callBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    background: "rgba(40, 90, 150, 0.12)",
    border: "1px solid rgba(110, 160, 210, 0.20)",
  },
  callTitle: { fontSize: 13, fontWeight: 900, marginBottom: 6 },
  callPhone: { fontSize: 20, fontWeight: 950, letterSpacing: 0.3 },
  callActions: { marginTop: 10 },
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
  callNote: { marginTop: 10, fontSize: 12, color: "rgba(233, 238, 247, 0.70)" },

  hr: { height: 1, background: "rgba(110, 160, 210, 0.18)", margin: "14px 0" },

  buttonPrimary: {
    width: "100%",
    padding: "14px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.28)",
    background:
      "linear-gradient(180deg, rgba(40, 90, 150, 0.95), rgba(18, 45, 80, 0.95))",
    color: "#e9eef7",
    fontWeight: 950,
    fontSize: 18,
  },

  verdictBox: (tone) => ({
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    background: tone === "clear" ? "rgba(40, 120, 70, 0.18)" : "rgba(170, 30, 30, 0.18)",
    border:
      tone === "clear"
        ? "1px solid rgba(80, 220, 140, 0.28)"
        : "1px solid rgba(255, 80, 80, 0.28)",
  }),
  verdictTitle: (tone) => ({
    fontSize: 22,
    fontWeight: 990,
    letterSpacing: 0.4,
    color: tone === "clear" ? "#d9ffe8" : "#ffd7d7",
  }),
  verdictSub: { marginTop: 6, fontSize: 13, color: "rgba(233, 238, 247, 0.85)" },

  notice: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(40, 90, 150, 0.14)",
    border: "1px solid rgba(110, 160, 210, 0.18)",
    color: "rgba(233, 238, 247, 0.9)",
    fontSize: 14,
    marginBottom: 10,
  },
  error: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(170, 30, 30, 0.18)",
    border: "1px solid rgba(255, 80, 80, 0.28)",
    color: "#ffd7d7",
    fontSize: 14,
    marginBottom: 10,
  },

  footer: {
    marginTop: 14,
    fontSize: 12,
    color: "rgba(233, 238, 247, 0.55)",
    textAlign: "center",
  },
};
