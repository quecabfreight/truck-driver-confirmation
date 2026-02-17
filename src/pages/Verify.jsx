import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BUILD_TAG = "VERIFY-UPPERCASE-RESTORE-01";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}
function toUpperClean(s) {
  return String(s || "").toUpperCase();
}
function normalizePlate(s) {
  return toUpperClean(s).replace(/\s+/g, "");
}
function fmtPhoneUS(s) {
  const d = onlyDigits(s);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}
function isoToLocal(iso) {
  if (!iso) return "";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return String(iso);
  return dt.toLocaleString();
}

export default function Verify() {
  const { token } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState(null);
  const [loadErr, setLoadErr] = useState("");

  const [enteredUsdot, setEnteredUsdot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");
  const [driverAnswered, setDriverAnswered] = useState(""); // "YES" | "NO" | ""

  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [verdict, setVerdict] = useState(""); // "CLEAR" | "CAUTION" | ""

  const [showDebug, setShowDebug] = useState(false);

  const flashTimerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setLoadErr("");
      setLink(null);
      setVerdict("");
      setSubmitErr("");

      try {
        const res = await fetch("/api/verify_get_link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || `Load failed (${res.status})`);
        }

        if (!cancelled) setLink(data.link || null);
      } catch (e) {
        if (!cancelled) setLoadErr(e?.message || "Failed to load verify link.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (token) run();
    else {
      setLoading(false);
      setLoadErr("Missing token.");
    }

    return () => {
      cancelled = true;
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
        flashTimerRef.current = null;
      }
    };
  }, [token]);

  const onRecordUsdotDigits = useMemo(() => onlyDigits(link?.usdot_on_record || ""), [link?.usdot_on_record]);
  const onRecordPlateNorm = useMemo(() => normalizePlate(link?.plate_on_record || ""), [link?.plate_on_record]);

  const enteredUsdotDigits = useMemo(() => onlyDigits(enteredUsdot), [enteredUsdot]);
  const enteredPlateNorm = useMemo(() => normalizePlate(enteredPlate), [enteredPlate]);

  const usdotMatch = useMemo(() => {
    if (!onRecordUsdotDigits || !enteredUsdotDigits) return "";
    return onRecordUsdotDigits === enteredUsdotDigits ? "YES" : "NO";
  }, [onRecordUsdotDigits, enteredUsdotDigits]);

  const plateMatch = useMemo(() => {
    if (!onRecordPlateNorm || !enteredPlateNorm) return "";
    return onRecordPlateNorm === enteredPlateNorm ? "YES" : "NO";
  }, [onRecordPlateNorm, enteredPlateNorm]);

  const canSubmit = useMemo(() => {
    return Boolean(enteredUsdotDigits && enteredPlateNorm && (driverAnswered === "YES" || driverAnswered === "NO"));
  }, [enteredUsdotDigits, enteredPlateNorm, driverAnswered]);

  // ✅ REQUIRED: auto-uppercase WHILE TYPING
  const onChangeUsdot = useCallback((e) => {
    const raw = e.target.value ?? "";
    setEnteredUsdot(String(raw).toUpperCase());
  }, []);

  const onChangePlate = useCallback((e) => {
    const raw = e.target.value ?? "";
    setEnteredPlate(String(raw).toUpperCase());
  }, []);

  const playCautionSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();

      o.type = "sine";
      o.frequency.value = 660;
      g.gain.value = 0.06;

      o.connect(g);
      g.connect(ctx.destination);

      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close().catch(() => {});
      }, 160);
    } catch {
      // no-op
    }
  }, []);

  const triggerCautionFlash = useCallback(() => {
    const el = document.documentElement;
    el.classList.add("qc-caution-flash");
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => {
      el.classList.remove("qc-caution-flash");
      flashTimerRef.current = null;
    }, 1200);
  }, []);

  const submitVerification = useCallback(async () => {
    if (!link) return;
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitErr("");
    setVerdict("");

    const result =
      usdotMatch === "YES" && plateMatch === "YES" && driverAnswered === "YES" ? "CLEAR" : "CAUTION";

    try {
      const res = await fetch("/api/verify_submit_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          entered_usdot: enteredUsdotDigits,
          entered_plate: enteredPlateNorm,
          driver_answered: driverAnswered === "YES",
          result,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Submit failed (${res.status})`);
      }

      setVerdict(result);

      if (result === "CAUTION") {
        triggerCautionFlash();
        playCautionSound();
      }
    } catch (e) {
      setSubmitErr(e?.message || "Submit failed.");
    } finally {
      setSubmitting(false);
    }
  }, [
    link,
    canSubmit,
    token,
    enteredUsdotDigits,
    enteredPlateNorm,
    driverAnswered,
    usdotMatch,
    plateMatch,
    triggerCautionFlash,
    playCautionSound,
  ]);

  useEffect(() => {
    const id = "qc-verify-flash-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .qc-wrap { max-width: 920px; margin: 0 auto; padding: 22px 16px 40px; color: #e9eef6; }
      .qc-card { background: rgba(10, 18, 32, 0.85); border: 1px solid rgba(120,160,210,0.25); border-radius: 16px; padding: 18px; box-shadow: 0 10px 24px rgba(0,0,0,0.35); }
      .qc-title { font-size: 28px; font-weight: 800; letter-spacing: 0.5px; margin: 0 0 10px; }
      .qc-sub { margin: 0 0 14px; color: rgba(233,238,246,0.78); font-size: 16px; }
      .qc-tag { display:inline-block; margin: 0 0 12px; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(120,160,210,0.35); background: rgba(0,0,0,0.22); font-weight: 900; font-size: 14px; letter-spacing: 0.8px; }
      .qc-bigq { font-size: 22px; font-weight: 800; margin: 14px 0 6px; text-transform: uppercase; }
      .qc-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
      .qc-field { flex: 1; min-width: 240px; }
      .qc-label { font-size: 14px; color: rgba(233,238,246,0.8); margin: 10px 0 6px; }
      .qc-input { width: 100%; padding: 14px 14px; font-size: 20px; border-radius: 12px; border: 1px solid rgba(120,160,210,0.28); background: rgba(0,0,0,0.28); color: #e9eef6; outline: none; text-transform: uppercase; }
      .qc-input:focus { border-color: rgba(140,190,255,0.55); box-shadow: 0 0 0 3px rgba(80,140,220,0.18); }
      .qc-pill { display: inline-flex; align-items: center; justify-content: center; min-width: 90px; padding: 10px 12px; border-radius: 999px; font-weight: 800; letter-spacing: 0.5px; border: 1px solid rgba(120,160,210,0.28); }
      .qc-pill.yes { background: rgba(40, 140, 90, 0.18); border-color: rgba(60, 190, 120, 0.35); }
      .qc-pill.no { background: rgba(160, 50, 50, 0.18); border-color: rgba(230, 90, 90, 0.35); }
      .qc-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
      .qc-btn { padding: 14px 16px; font-size: 18px; border-radius: 12px; border: 1px solid rgba(120,160,210,0.28); background: rgba(20, 40, 70, 0.45); color: #e9eef6; cursor: pointer; font-weight: 800; }
      .qc-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      .qc-btn.primary { background: rgba(30, 90, 160, 0.55); border-color: rgba(120,180,255,0.35); }
      .qc-verdict { margin-top: 14px; padding: 14px; border-radius: 14px; border: 1px solid rgba(120,160,210,0.28); }
      .qc-verdict.clear { background: rgba(40, 140, 90, 0.18); border-color: rgba(60, 190, 120, 0.35); }
      .qc-verdict.caution { background: rgba(180, 40, 40, 0.20); border-color: rgba(255, 90, 90, 0.45); }
      .qc-mini { font-size: 13px; color: rgba(233,238,246,0.72); margin-top: 8px; }
      .qc-hr { height: 1px; background: rgba(120,160,210,0.18); margin: 14px 0; border: 0; }
      .qc-toggle { background: transparent; border: 1px solid rgba(120,160,210,0.28); color: rgba(233,238,246,0.85); padding: 8px 10px; border-radius: 10px; cursor: pointer; font-weight: 700; }
      .qc-debug { margin-top: 10px; background: rgba(0,0,0,0.25); border: 1px solid rgba(120,160,210,0.20); padding: 10px; border-radius: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; color: rgba(233,238,246,0.85); white-space: pre-wrap; word-break: break-word; }
      .qc-caution-flash { animation: qcFlash 0.18s linear 0s 6; }
      @keyframes qcFlash { 0% { filter:none; } 50% { filter:saturate(1.2) brightness(1.15); } 100% { filter:none; } }
    `;
    document.head.appendChild(style);
  }, []);

  if (loading) {
    return (
      <div className="qc-wrap">
        <div className="qc-card">
          <div className="qc-title">Loading…</div>
          <p className="qc-sub">Fetching verification link.</p>
        </div>
      </div>
    );
  }

  if (loadErr) {
    return (
      <div className="qc-wrap">
        <div className="qc-card">
          <div className="qc-title">Unable to load</div>
          <p className="qc-sub">{loadErr}</p>
          <div className="qc-actions">
            <button className="qc-btn" onClick={() => nav("/")}>Back Home</button>
          </div>
        </div>
      </div>
    );
  }

  const driverPhonePretty = fmtPhoneUS(link?.driver_phone || "");

  return (
    <div className="qc-wrap">
      <div className="qc-card">
        <div className="qc-tag">BUILD TAG: {BUILD_TAG}</div>

        <div className="qc-title">AdbS Dock Verification</div>
        <p className="qc-sub">
          Both checks must be <b>YES</b> to clear the <b>Truck-Driver</b> for loading.
        </p>

        <div className="qc-bigq">DOES THE USDOT# ON THE TRUCK MATCH?</div>
        <div className="qc-row">
          <div className="qc-field">
            <div className="qc-label">Enter USDOT#</div>
            <input
              className="qc-input"
              value={enteredUsdot}
              onChange={onChangeUsdot}
              inputMode="numeric"
              placeholder="1234567"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className={`qc-pill ${usdotMatch === "YES" ? "yes" : usdotMatch === "NO" ? "no" : ""}`}>
            {usdotMatch || "—"}
          </div>
        </div>

        <div className="qc-bigq">ENTER PLATE</div>
        <div className="qc-row">
          <div className="qc-field">
            <div className="qc-label">Enter Plate</div>
            <input
              className="qc-input"
              value={enteredPlate}
              onChange={onChangePlate}
              placeholder="ABC1234"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className={`qc-pill ${plateMatch === "YES" ? "yes" : plateMatch === "NO" ? "no" : ""}`}>
            {plateMatch || "—"}
          </div>
        </div>

        <hr className="qc-hr" />

        <div className="qc-bigq">DID THE DRIVER ANSWER THEIR PHONE?</div>
        <div className="qc-row" style={{ gap: 10 }}>
          <button
            className="qc-btn"
            onClick={() => setDriverAnswered("YES")}
            style={{
              background: driverAnswered === "YES" ? "rgba(40, 140, 90, 0.25)" : undefined,
              borderColor: driverAnswered === "YES" ? "rgba(60, 190, 120, 0.45)" : undefined,
            }}
          >
            YES
          </button>
          <button
            className="qc-btn"
            onClick={() => setDriverAnswered("NO")}
            style={{
              background: driverAnswered === "NO" ? "rgba(180, 40, 40, 0.22)" : undefined,
              borderColor: driverAnswered === "NO" ? "rgba(255, 90, 90, 0.45)" : undefined,
            }}
          >
            NO
          </button>
        </div>

        <div className="qc-row" style={{ marginTop: 10, justifyContent: "space-between" }}>
          <div>
            <div className="qc-label">Driver Phone</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{driverPhonePretty || "—"}</div>
            <div className="qc-mini">Visible for authorized dock/check-in personnel.</div>
          </div>
        </div>

        <div className="qc-actions">
          <button
            className="qc-btn primary"
            onClick={submitVerification}
            disabled={!canSubmit || submitting}
          >
            {submitting ? "Submitting…" : "Submit Verification"}
          </button>

          <button
            className="qc-toggle"
            onClick={() => setShowDebug((v) => !v)}
            type="button"
          >
            {showDebug ? "Hide Debug" : "Show Debug"}
          </button>
        </div>

        {submitErr ? (
          <div className="qc-verdict caution" style={{ marginTop: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Submit failed</div>
            <div style={{ marginTop: 6 }}>{submitErr}</div>
          </div>
        ) : null}

        {verdict === "CLEAR" ? (
          <div className="qc-verdict clear">
            <div style={{ fontSize: 22, fontWeight: 900 }}>CLEAR TO LOAD</div>
            <div style={{ marginTop: 6, fontSize: 16 }}>
              Truck-Driver verification passed.
            </div>
          </div>
        ) : null}

        {verdict === "CAUTION" ? (
          <div className="qc-verdict caution">
            <div style={{ fontSize: 22, fontWeight: 900 }}>CAUTION ALERT — DO NOT LOAD</div>
            <div style={{ marginTop: 6, fontSize: 16 }}>
              One or more checks did not pass.
            </div>
          </div>
        ) : null}

        {showDebug ? (
          <div className="qc-debug">
{JSON.stringify(
  {
    token,
    build_tag: BUILD_TAG,
    on_record: {
      usdot_on_record: link?.usdot_on_record,
      plate_on_record: link?.plate_on_record,
      starts_at: link?.starts_at ? isoToLocal(link.starts_at) : null,
      expires_at: link?.expires_at ? isoToLocal(link.expires_at) : null,
      status: link?.status || null,
    },
    entered: {
      entered_usdot_raw: enteredUsdot,
      entered_usdot_digits: enteredUsdotDigits,
      entered_plate_raw: enteredPlate,
      entered_plate_norm: enteredPlateNorm,
      driver_answered: driverAnswered,
    },
    computed: { usdotMatch, plateMatch, canSubmit, verdict },
  },
  null,
  2
)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
