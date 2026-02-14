// src/pages/VerifyDriver.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}
function upper(v) {
  return String(v || "").toUpperCase();
}
function formatPhone(v) {
  const d = onlyDigits(v).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

export default function VerifyDriver() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [linkOk, setLinkOk] = useState(true); // optimistic (we still allow attempt logging)
  const [driverPhone, setDriverPhone] = useState("");
  const [status, setStatus] = useState(null);

  // Step 1 inputs (what they see on the truck)
  const [enteredUSDOT, setEnteredUSDOT] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");

  // Step 2 (call result)
  const [driverAnswered, setDriverAnswered] = useState(""); // "yes" | "no"

  const canSubmit = useMemo(() => {
    return (
      token &&
      onlyDigits(enteredUSDOT).length >= 4 &&
      String(enteredPlate || "").trim().length >= 2 &&
      (driverAnswered === "yes" || driverAnswered === "no")
    );
  }, [token, enteredUSDOT, enteredPlate, driverAnswered]);

  // Lightweight “peek” — we don’t reveal DOT/Plate, only show whether link looks alive + phone for calling.
  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setStatus(null);

        // We don’t have a separate “get link” endpoint (on purpose: less surface area).
        // So we just keep the UI usable; phone shows after first submission response,
        // BUT we want the phone available up-front to keep the dock flow simple.
        // Solution: store phone in the verify link issuance screen & show it there too.
        //
        // For now: display phone placeholder; final phone comes after first submit response if needed.
        setDriverPhone(""); // unknown until we wire optional read endpoint later
        setLinkOk(true);
      } catch (e) {
        if (!cancelled) {
          setLinkOk(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    try {
      const payload = {
        token,
        entered_usdot: enteredUSDOT,
        entered_plate: enteredPlate,
        driver_answered: driverAnswered === "yes",
      };

      const r = await fetch("/api/verify_and_log_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await r.json();

      if (!j.ok) {
        setStatus({ type: "error", message: j.error || "Verification failed." });
        return;
      }

      // If we later add a “read link” endpoint, this can populate phone.
      // For now, we keep a manual backup display area if you want to type it in later.
      // (Next phase we’ll fetch and show the phone immediately.)
      if (j.verdict === "CLEAR") {
        setStatus({
          type: "success",
          message: "CLEAR TO LOAD — USDOT + Plate matched and the driver answered.",
        });
      } else {
        setStatus({
          type: "caution",
          message:
            "CAUTION ALERT – DO NOT LOAD. At least one check failed. Hold this load and follow your internal escalation steps.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || "Network error. Try again.",
      });
    }
  }

  return (
    <div className="qc-shell qc-dock">
      <div className="qc-inner">
        <header className="qc-dock-head">
          <h1 className="qc-heading">Truck-Driver Verification</h1>
          <p className="qc-sub">
            Authorized dock/check-in personnel only. Enter what you see on the truck.
            AdbS compares it to the broker/shipper record — the driver never sees the record values.
          </p>
          <div className="qc-token">
            Verify Token: <span className="qc-mono">{token || "N/A"}</span>
          </div>
        </header>

        <div className="qc-dock-grid">
          {/* LEFT: Step flow */}
          <section className="qc-card qc-card-big">
            <div className="qc-step">
              <div className="qc-step-num">1</div>
              <div className="qc-step-body">
                <div className="qc-step-title">Enter what you see on the truck</div>

                <div className="qc-form-grid">
                  <div className="qc-field">
                    <label className="qc-label">USDOT# on Truck</label>
                    <input
                      className="qc-input qc-input-xl"
                      value={enteredUSDOT}
                      onChange={(e) => setEnteredUSDOT(onlyDigits(e.target.value))}
                      placeholder="Digits only"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="qc-field">
                    <label className="qc-label">Plate on Truck</label>
                    <input
                      className="qc-input qc-input-xl"
                      value={enteredPlate}
                      onChange={(e) => setEnteredPlate(upper(e.target.value))}
                      placeholder="Exact plate text"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="qc-divider" />

            <div className="qc-step">
              <div className="qc-step-num">2</div>
              <div className="qc-step-body">
                <div className="qc-step-title">Call the driver</div>

                <div className="qc-call-row">
                  <button
                    type="button"
                    className="qc-btn qc-btn-call"
                    onClick={() => {
                      // If phone is available, attempt call; otherwise do nothing.
                      if (!driverPhone) return;
                      window.location.href = `tel:${onlyDigits(driverPhone)}`;
                    }}
                    disabled={!driverPhone}
                    title={!driverPhone ? "Phone will be shown in next phase (read endpoint)." : "Call driver"}
                  >
                    Call Driver
                  </button>

                  <div className="qc-call-phone">
                    {driverPhone ? (
                      <a className="qc-phone-link" href={`tel:${onlyDigits(driverPhone)}`}>
                        {formatPhone(driverPhone)}
                      </a>
                    ) : (
                      <span className="qc-phone-muted">
                        Phone shown next phase (no record data is exposed)
                      </span>
                    )}
                  </div>

                  <div className="qc-call-yn">
                    <span className="qc-yn-label">Answered?</span>
                    <label className="qc-radio">
                      <input
                        type="radio"
                        name="answered"
                        value="yes"
                        checked={driverAnswered === "yes"}
                        onChange={() => setDriverAnswered("yes")}
                      />
                      <span>YES</span>
                    </label>
                    <label className="qc-radio">
                      <input
                        type="radio"
                        name="answered"
                        value="no"
                        checked={driverAnswered === "no"}
                        onChange={() => setDriverAnswered("no")}
                      />
                      <span>NO</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="qc-divider" />

            <div className="qc-step">
              <div className="qc-step-num">3</div>
              <div className="qc-step-body">
                <div className="qc-step-title">Submit verification</div>

                {status && (
                  <div
                    className={
                      status.type === "success"
                        ? "qc-status qc-status-success"
                        : status.type === "caution"
                        ? "qc-status qc-status-caution"
                        : "qc-status qc-status-error"
                    }
                  >
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="qc-actions">
                  <button className="qc-btn qc-btn-primary qc-btn-wide" disabled={!canSubmit}>
                    Submit Truck-Driver Check
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* RIGHT: Fast checklist */}
          <aside className="qc-card">
            <h2 className="qc-card-title">Dock Checklist</h2>
            <ol className="qc-list">
              <li>Enter USDOT + Plate as seen on the truck.</li>
              <li>Call the driver’s registered phone.</li>
              <li>If anything feels off → mark NO and submit.</li>
              <li>Only CLEAR means load is approved to proceed.</li>
            </ol>

            {loading && <div className="qc-note">Loading…</div>}
            {!linkOk && (
              <div className="qc-note qc-note-warn">
                This link may be invalid/expired. You can still submit — it will log a caution attempt.
              </div>
            )}
          </aside>
        </div>
      </div>

      <style>{`
        .qc-dock{ padding: 22px 14px 46px; }
        .qc-dock-head{ margin-bottom: 14px; }
        .qc-token{ margin-top: 8px; opacity: .9; }
        .qc-mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .qc-dock-grid{ display:grid; grid-template-columns: 1.35fr .65fr; gap: 14px; align-items: start; }
        .qc-card-big{ padding: 18px; }
        .qc-step{ display:flex; gap: 12px; }
        .qc-step-num{
          width: 44px; height: 44px; border-radius: 12px;
          display:flex; align-items:center; justify-content:center;
          font-weight: 900;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(0,0,0,.25);
        }
        .qc-step-title{ font-weight: 900; font-size: 18px; margin-bottom: 10px; }
        .qc-form-grid{ display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .qc-input-xl{ font-size: 18px; padding: 14px 14px; }
        .qc-call-row{
          display:grid;
          grid-template-columns: 200px 1fr auto;
          gap: 12px;
          align-items: center;
        }
        .qc-btn-call{
          background: linear-gradient(180deg, rgba(70,140,255,.55), rgba(18,28,56,.85));
          border: 1px solid rgba(255,255,255,.14);
          font-weight: 900;
          border-radius: 14px;
          padding: 12px 14px;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(0,0,0,.35);
          color: #fff;
        }
        .qc-btn-call:disabled{ opacity:.45; cursor:not-allowed; }
        .qc-phone-link{ color: #cfe0ff; text-decoration: none; font-weight: 900; }
        .qc-phone-link:hover{ text-decoration: underline; }
        .qc-phone-muted{ opacity:.75; }
        .qc-call-yn{ display:flex; align-items:center; gap: 10px; justify-content: flex-end; }
        .qc-yn-label{ font-weight: 900; opacity: .9; }
        .qc-radio{ display:flex; align-items:center; gap: 6px; font-weight: 900; }
        .qc-actions{ margin-top: 10px; display:flex; justify-content:flex-start; }
        .qc-btn-wide{ width: 100%; max-width: 520px; }
        .qc-status-caution{
          background: rgba(140,30,30,.22);
          border-color: rgba(255,90,90,.40);
          color: #ffd2d2;
        }
        .qc-note-warn{ margin-top: 10px; color: #ffd2d2; }
        @media (max-width: 920px){
          .qc-dock-grid{ grid-template-columns: 1fr; }
          .qc-form-grid{ grid-template-columns: 1fr; }
          .qc-call-row{ grid-template-columns: 1fr; }
          .qc-call-yn{ justify-content:flex-start; }
          .qc-btn-wide{ max-width: none; }
        }
      `}</style>
    </div>
  );
}
