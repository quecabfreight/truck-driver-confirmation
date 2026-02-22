// /src/pages/Verify.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function toUpperClean(s) {
  return String(s || "").toUpperCase();
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function fmtPhone(s) {
  const d = onlyDigits(s).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (!d) return "";
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

export default function Verify() {
  const nav = useNavigate();
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState(null);
  const [fatal, setFatal] = useState(""); // load errors like 404 / revoked
  const [err, setErr] = useState("");

  const [enteredUsdot, setEnteredUsdot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");
  const [driverAnswered, setDriverAnswered] = useState(null); // true/false

  const [submitting, setSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null); // "clear" | "caution"
  const [reasons, setReasons] = useState([]);
  const [attemptsUsed, setAttemptsUsed] = useState(null); // number, optional
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setFatal("");
      setErr("");
      setLink(null);
      setVerdict(null);
      setReasons([]);
      setAttemptsUsed(null);
      setLocked(false);

      try {
        const res = await fetch(`/api/load_verify_link?token=${encodeURIComponent(token || "")}`, {
          headers: { "Cache-Control": "no-store" },
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || !data || !data.ok) {
          const msg = (data && (data.error || data.message)) || `Load failed (${res.status}).`;
          if (alive) setFatal(msg);
          if (alive) setLoading(false);
          return;
        }

        const l = data.link || null;

        // If link is not active, stop here (DO NOT LOAD)
        if (l && String(l.status || "").toLowerCase() !== "active") {
          if (alive) {
            setLink(l);
            setLocked(true);
            setFatal("CAUTION ALERT — DO NOT LOAD (This verification is not active.)");
            setLoading(false);
          }
          return;
        }

        if (alive) {
          setLink(l);
          setLoading(false);
        }
      } catch {
        if (alive) {
          setFatal("Network error loading verification.");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [token]);

  async function submit() {
    setErr("");
    setVerdict(null);
    setReasons([]);
    setAttemptsUsed(null);
    setLocked(false);

    const usdotDigits = onlyDigits(enteredUsdot);
    const plateUpper = toUpperClean(enteredPlate).trim();

    if (!usdotDigits) return setErr("Enter USDOT# (digits).");
    if (!plateUpper) return setErr("Enter Plate.");
    if (driverAnswered === null) return setErr("Select YES or NO for Driver Answered Phone.");

    setSubmitting(true);
    try {
      const payload = {
        token,
        entered_usdot: usdotDigits,
        entered_plate: plateUpper,
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
        // If server tells us it’s locked, show it loudly
        if (data && data.locked) {
          setLocked(true);
          setVerdict("caution");
          setReasons(data.reasons || ["Too many failed attempts."]);
          setAttemptsUsed(data.attempts_used ?? null);
        } else {
          setErr(msg);
        }
        setSubmitting(false);
        return;
      }

      setVerdict(data.verdict);
      setReasons(data.reasons || []);
      setAttemptsUsed(data.attempts_used ?? null);

      if (data.locked) setLocked(true);
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
  const big = { fontSize: 22, fontWeight: 950, letterSpacing: 0.8, marginTop: 14 };

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
          <div style={card}>Loading…</div>
        </div>
      </div>
    );
  }

  if (fatal) {
    return (
      <div style={page}>
        <div style={wrap}>
          <div style={card}>
            <div style={{ fontSize: 20, fontWeight: 950, marginBottom: 10 }}>Unable to load</div>
            <div style={{ opacity: 0.9, marginBottom: 14 }}>{fatal}</div>
            <button style={btn(false)} onClick={() => nav("/")}>
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const phone = fmtPhone(link?.driver_phone || "");
  const showVerdict = !!verdict;
  const isClear = verdict === "clear";

  return (
    <div style={page}>
      <div style={wrap}>
        <div style={card}>
          <div style={h1}>Dock Verification</div>

          {/* IMPORTANT: No match signals shown here (non-revealing). */}
          <div style={big}>ENTER THE USDOT# YOU SEE ON THE TRUCK</div>
          <div style={{ marginTop: 10 }}>
            <div style={label}>USDOT#</div>
            <input
              style={input}
              value={enteredUsdot}
              onChange={(e) => setEnteredUsdot(toUpperClean(e.target.value))}
              placeholder="123456"
              autoComplete="off"
              inputMode="text"
            />
          </div>

          <div style={big}>ENTER THE PLATE YOU SEE ON THE TRUCK</div>
          <div style={{ marginTop: 10 }}>
            <div style={label}>Plate</div>
            <input
              style={input}
              value={enteredPlate}
              onChange={(e) => setEnteredPlate(toUpperClean(e.target.value))}
              placeholder="ABC1234"
              autoComplete="off"
              inputMode="text"
            />
          </div>

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

          {/* Only visible helper: clickable phone number (as you require) */}
          <div style={{ marginTop: 14, opacity: 0.9, fontSize: 16 }}>
            Driver Phone:{" "}
            {phone ? (
              <a href={`tel:${onlyDigits(phone)}`} style={{ color: "#a7d1ff", fontWeight: 950 }}>
                {phone} (Call Now)
              </a>
            ) : (
              <b>(not available)</b>
            )}
          </div>

          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            <button style={btn(true)} onClick={submit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Verification"}
            </button>

            {err ? (
              <div
                style={{
                  border: "1px solid rgba(255,80,80,0.35)",
                  background: "rgba(255,80,80,0.08)",
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 14,
                }}
              >
                <b>Error:</b> {err}
              </div>
            ) : null}

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
                  {locked ? " (LOCKED)" : ""}
                </div>

                {typeof attemptsUsed === "number" ? (
                  <div style={{ marginTop: 8, opacity: 0.9 }}>
                    Failed attempts used: <b>{attemptsUsed}</b> / 3
                  </div>
                ) : null}

                {reasons?.length ? (
                  <div style={{ marginTop: 10, opacity: 0.9, lineHeight: 1.4 }}>
                    {reasons.map((r, i) => (
                      <div key={i}>• {r}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ marginTop: 14, opacity: 0.65, fontSize: 12 }}>
          QueCab AdbS — Non-revealing verification (no live match signals). Three failed attempts locks the link.
        </div>
      </div>
    </div>
  );
}
