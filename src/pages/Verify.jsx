// /src/pages/Verify.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpperClean(s) {
  return String(s || "").toUpperCase();
}

function fmtPhone(s) {
  const d = onlyDigits(s).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

export default function Verify() {
  const nav = useNavigate();
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState(null);
  const [err, setErr] = useState("");

  const [enteredUsdot, setEnteredUsdot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");
  const [driverAnswered, setDriverAnswered] = useState(null); // true/false

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // {result, reasons[]}

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      setLink(null);
      setResult(null);

      try {
        const res = await fetch(`/api/load_verify_link?token=${encodeURIComponent(token || "")}`, {
          headers: { "Cache-Control": "no-store" },
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || !data || !data.ok) {
          const msg = (data && (data.error || data.message)) || `Unable to load (${res.status}).`;
          if (alive) setErr(msg);
          if (alive) setLoading(false);
          return;
        }

        if (alive) {
          setLink(data.link || null);
          setLoading(false);
        }
      } catch {
        if (alive) {
          setErr("Network error loading verification.");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [token]);

  const computed = useMemo(() => {
    const entered_usdot_digits = onlyDigits(enteredUsdot);
    const entered_plate_upper = toUpperClean(enteredPlate).trim();

    const record_usdot_digits = onlyDigits(link?.usdot_on_record);
    const record_plate_upper = toUpperClean(link?.plate_on_record).trim();

    const usdotMatch =
      !!entered_usdot_digits && !!record_usdot_digits && entered_usdot_digits === record_usdot_digits;

    const plateMatch =
      !!entered_plate_upper && !!record_plate_upper && entered_plate_upper === record_plate_upper;

    return { entered_usdot_digits, entered_plate_upper, usdotMatch, plateMatch };
  }, [enteredUsdot, enteredPlate, link]);

  async function submit() {
    setErr("");
    setResult(null);

    if (!link || !token) {
      setErr("Missing verification data.");
      return;
    }

    if (!computed.entered_usdot_digits) {
      setErr("Enter USDOT# (digits).");
      return;
    }
    if (!computed.entered_plate_upper) {
      setErr("Enter Plate.");
      return;
    }
    if (driverAnswered === null) {
      setErr("Select YES or NO for Driver Answered Phone.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        token,
        load_id: link.load_id || null,
        entered_usdot: computed.entered_usdot_digits,
        entered_plate: computed.entered_plate_upper,
        driver_answered: !!driverAnswered,
      };

      const res = await fetch("/api/submit_verify_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.ok) {
        const msg = (data && (data.error || data.message)) || `Submit failed (${res.status}).`;
        setErr(msg);
        setSubmitting(false);
        return;
      }

      setResult({
        verdict: data.verdict,
        reasons: data.reasons || [],
      });
    } catch {
      setErr("Network error submitting verification.");
    } finally {
      setSubmitting(false);
    }
  }

  const page = {
    minHeight: "100vh",
    background: "#0f1722",
    color: "#e6edf5",
  };

  const wrap = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "18px 16px 48px",
  };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const h1 = { fontSize: 28, fontWeight: 950, margin: 0, letterSpacing: 0.3 };
  const big = { fontSize: 24, fontWeight: 950, letterSpacing: 0.8, marginTop: 12 };

  const label = { fontSize: 14, opacity: 0.92, marginBottom: 6 };

  const input = {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 18,
    outline: "none",
  };

  const btn = (primary) => ({
    width: "100%",
    padding: "14px 14px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(120,180,255,0.45)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary ? "rgba(40, 110, 190, 0.35)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
  });

  if (loading) {
    return (
      <div style={page}>
        <div style={wrap}>
          <div style={card}>Loading verification…</div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={page}>
        <div style={wrap}>
          <div style={card}>
            <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 10 }}>Unable to load</div>
            <div style={{ opacity: 0.9, marginBottom: 14 }}>{err}</div>
            <button style={btn(false)} onClick={() => nav("/")}>
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const showVerdict = !!result?.verdict;
  const isClear = result?.verdict === "clear";

  return (
    <div style={page}>
      <div style={wrap}>
        <div style={card}>
          <div style={h1}>Dock Verification</div>

          <div style={big}>DOES THE USDOT# ON THE TRUCK MATCH?</div>
          <div style={{ marginTop: 10 }}>
            <div style={label}>Enter USDOT#</div>
            <input
              style={input}
              value={enteredUsdot}
              onChange={(e) => setEnteredUsdot(toUpperClean(e.target.value))}
              placeholder="123456"
              autoComplete="off"
              inputMode="text"
            />
            <div style={{ marginTop: 8, opacity: 0.85 }}>
              USDOT Match: <b>{computed.usdotMatch ? "YES" : "NO"}</b>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={big}>DOES THE PLATE ON THE TRUCK MATCH?</div>
            <div style={{ marginTop: 10 }}>
              <div style={label}>Enter Plate</div>
              <input
                style={input}
                value={enteredPlate}
                onChange={(e) => setEnteredPlate(toUpperClean(e.target.value))}
                placeholder="ABC1234"
                autoComplete="off"
                inputMode="text"
              />
              <div style={{ marginTop: 8, opacity: 0.85 }}>
                Plate Match: <b>{computed.plateMatch ? "YES" : "NO"}</b>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={big}>DID THE DRIVER ANSWER THEIR PHONE?</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
              <button
                style={{
                  ...btn(driverAnswered === true),
                  border:
                    driverAnswered === true
                      ? "1px solid rgba(80,190,120,0.50)"
                      : "1px solid rgba(255,255,255,0.16)",
                }}
                onClick={() => setDriverAnswered(true)}
              >
                YES
              </button>
              <button
                style={{
                  ...btn(driverAnswered === false),
                  border:
                    driverAnswered === false
                      ? "1px solid rgba(255,90,90,0.50)"
                      : "1px solid rgba(255,255,255,0.16)",
                }}
                onClick={() => setDriverAnswered(false)}
              >
                NO
              </button>
            </div>

            <div style={{ marginTop: 12, opacity: 0.85 }}>
              Driver Phone (from record): <b>{fmtPhone(link?.driver_phone || "")}</b>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
            <button style={btn(true)} onClick={submit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Verification"}
            </button>

            {showVerdict ? (
              <div
                style={{
                  border: isClear
                    ? "1px solid rgba(80,190,120,0.45)"
                    : "1px solid rgba(255,90,90,0.45)",
                  background: isClear ? "rgba(80,190,120,0.10)" : "rgba(255,90,90,0.10)",
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 950, letterSpacing: 0.6 }}>
                  {isClear ? "CLEAR TO LOAD" : "CAUTION ALERT — DO NOT LOAD"}
                </div>
                {result.reasons?.length ? (
                  <div style={{ marginTop: 10, opacity: 0.9, lineHeight: 1.4 }}>
                    {result.reasons.map((r, i) => (
                      <div key={i}>• {r}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ marginTop: 14, opacity: 0.65, fontSize: 12 }}>
          QueCab AdbS — Truck-Driver verification (public verify link; issuer remains protected).
        </div>
      </div>
    </div>
  );
}
