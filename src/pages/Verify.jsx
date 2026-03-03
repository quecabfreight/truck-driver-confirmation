// /src/pages/Verify.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpper(s) {
  return String(s || "").toUpperCase();
}

function formatPhoneHyphen(s) {
  const d = onlyDigits(s).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export default function Verify() {
  const nav = useNavigate();
  const { token } = useParams();

  // --- Dock Authorization (PIN gate) ---
  const [dockPin, setDockPin] = useState("");
  const [pinStatus, setPinStatus] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [authorizedDock, setAuthorizedDock] = useState(false);

  // --- Phone (only revealed after authorization) ---
  const [driverPhone, setDriverPhone] = useState("");
  const [callCompleted, setCallCompleted] = useState(false);

  // --- Entries ---
  const [enteredDot, setEnteredDot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");
  const [driverAnswered, setDriverAnswered] = useState(""); // "YES" | "NO" | ""

  // --- Submit ---
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null); // { verdict: "clear"|"caution", raw }

  useEffect(() => {
    document.title = "Dock Verification — QueCab AdbS";
  }, []);

  const clean = useMemo(() => {
    return {
      token: String(token || "").trim(),
      dockPin: String(dockPin || "").trim(),
      dot: toUpper(enteredDot).trim(),
      plate: toUpper(enteredPlate).trim(),
      answered: driverAnswered,
      phone: formatPhoneHyphen(driverPhone),
    };
  }, [token, dockPin, enteredDot, enteredPlate, driverAnswered, driverPhone]);

  const canSubmit = useMemo(() => {
    if (!authorizedDock) return false;
    if (!clean.token) return false;
    if (!clean.dot) return false;
    if (!clean.plate) return false;
    if (!callCompleted) return false;
    if (clean.answered !== "YES" && clean.answered !== "NO") return false;
    return true;
  }, [authorizedDock, clean, callCompleted]);

  async function authorizeDock() {
    setPinError("");
    setPinStatus("");
    setPinLoading(true);
    setAuthorizedDock(false);
    setDriverPhone("");
    setCallCompleted(false);

    try {
      const res = await fetch("/api/reveal_driver_phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: clean.token, dock_pin: clean.dockPin }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.message ||
          `Dock authorization failed (${res.status}).`;
        setPinError(msg);
        setPinLoading(false);
        return;
      }

      const phone =
        data?.driver_phone ||
        data?.phone ||
        (data?.link && (data.link.driver_phone || data.link.phone)) ||
        "";

      setDriverPhone(formatPhoneHyphen(phone));
      setAuthorizedDock(true);
      setPinStatus("Dock Authorization Granted.");
    } catch {
      setPinError("Network error during dock authorization.");
    } finally {
      setPinLoading(false);
    }
  }

  async function submitVerification() {
    setSubmitError("");
    setResult(null);
    setSubmitLoading(true);

    try {
      const payload = {
        token: clean.token,
        entered_usdot: clean.dot,
        entered_plate: clean.plate,
        driver_answered: clean.answered === "YES",
        // NOTE: load_id is handled server-side if you’re tying checks to loads there.
      };

      const res = await fetch("/api/submit_verify_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.error || data?.message || `Submit failed (${res.status}).`;
        setSubmitError(msg);
        setSubmitLoading(false);
        return;
      }

      const r =
        data?.result ||
        data?.verdict ||
        (data?.check && data.check.result) ||
        "";

      const normalized =
        String(r).toLowerCase().includes("clear") ? "clear" :
        String(r).toLowerCase().includes("caution") ? "caution" :
        "";

      setResult({
        raw: data,
        verdict: normalized || "caution",
      });
    } catch {
      setSubmitError("Network error submitting verification.");
    } finally {
      setSubmitLoading(false);
    }
  }

  // --- Styles ---
  const page = { minHeight: "100vh", background: "#0f1722", color: "#e6edf5" };

  const wrap = { maxWidth: 980, margin: "0 auto", padding: "18px 16px 60px" };

  const card = {
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 16,
  };

  const titleRow = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  };

  const label = { fontSize: 13, opacity: 0.85, marginBottom: 6, fontWeight: 800 };

  const input = {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 12,
    border: "1px solid rgba(140,190,255,0.18)",
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
      ? "1px solid rgba(140,190,255,0.42)"
      : "1px solid rgba(140,190,255,0.20)",
    background: primary
      ? "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))"
      : "rgba(0,0,0,0.18)",
    color: "#e6edf5",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
    letterSpacing: 0.2,
    opacity: primary ? 1 : 0.95,
  });

  const pill = (active) => ({
    padding: "12px 12px",
    borderRadius: 12,
    border: active
      ? "1px solid rgba(90,200,140,0.45)"
      : "1px solid rgba(140,190,255,0.16)",
    background: active ? "rgba(90,200,140,0.14)" : "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
    width: "100%",
  });

  const bigH = { fontSize: 26, fontWeight: 950, margin: 0, letterSpacing: 0.2 };

  return (
    <div style={page}>
      <div style={wrap}>
        <div style={titleRow}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS"
              style={{ width: 38, height: 38, objectFit: "contain" }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div>
              <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>QueCab AdbS</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>Dock Verification</div>
            </div>
          </div>

          <button style={btn(false)} onClick={() => nav("/")} title="Back Home">
            Back Home
          </button>
        </div>

        {/* Header / procedure (always visible) */}
        <div style={{ marginTop: 14, ...card }}>
          <div style={bigH}>DOES THE USDOT# ON THE TRUCK MATCH?</div>
          <div style={{ marginTop: 10, fontSize: 16, opacity: 0.9, fontWeight: 900 }}>
            DID THE DRIVER ANSWER THEIR PHONE?
          </div>
          <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
            Enter DOT + Plate, complete the phone step, then submit. No on-record values are displayed on this screen.
          </div>
        </div>

        {/* STEP 1: Dock Authorization ONLY (gated screen) */}
        {!authorizedDock ? (
          <div style={{ marginTop: 14, ...card }}>
            <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 8 }}>
              Dock Authorization Required
            </div>
            <div style={{ fontSize: 13, opacity: 0.82, marginBottom: 12 }}>
              Enter Dock PIN to unlock the verification procedure.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 12, alignItems: "end" }}>
              <div>
                <div style={label}>Dock PIN</div>
                <input
                  style={input}
                  value={dockPin}
                  onChange={(e) => setDockPin(onlyDigits(e.target.value).slice(0, 6))}
                  placeholder="Enter PIN"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>

              <button
                style={btn(true)}
                onClick={authorizeDock}
                disabled={pinLoading || !clean.dockPin}
                title="Authorize dock"
              >
                {pinLoading ? "Authorizing..." : "Authorize"}
              </button>
            </div>

            {pinError ? (
              <div style={{ marginTop: 12, border: "1px solid rgba(255,90,90,0.35)", background: "rgba(255,90,90,0.08)", padding: 12, borderRadius: 12 }}>
                <b>Error:</b> {pinError}
              </div>
            ) : null}

            {pinStatus ? (
              <div style={{ marginTop: 12, border: "1px solid rgba(90,200,140,0.35)", background: "rgba(90,200,140,0.08)", padding: 12, borderRadius: 12 }}>
                {pinStatus}
              </div>
            ) : null}
          </div>
        ) : (
          <>
            {/* STEP 2: DOT + PLATE FIRST */}
            <div style={{ marginTop: 14, ...card }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={label}>ENTER DOT</div>
                  <input
                    style={input}
                    value={enteredDot}
                    onChange={(e) => setEnteredDot(toUpper(e.target.value))}
                    placeholder="Enter DOT"
                    inputMode="text"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <div style={label}>ENTER PLATE</div>
                  <input
                    style={input}
                    value={enteredPlate}
                    onChange={(e) => setEnteredPlate(toUpper(e.target.value))}
                    placeholder="Enter Plate"
                    inputMode="text"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: PHONE + CALL (LAST STEP BEFORE YES/NO) */}
            <div style={{ marginTop: 14, ...card }}>
              <div style={{ fontSize: 16, fontWeight: 950, marginBottom: 8 }}>
                Driver Phone (manual backup)
              </div>
              <div style={{ fontSize: 13, opacity: 0.82, marginBottom: 12 }}>
                If click-to-call doesn’t work, dial manually using the number shown.
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <a
                  href={driverPhone ? `tel:${onlyDigits(driverPhone)}` : undefined}
                  onClick={() => setCallCompleted(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(140,190,255,0.28)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#e6edf5",
                    fontSize: 18,
                    fontWeight: 950,
                    textDecoration: "none",
                    cursor: driverPhone ? "pointer" : "default",
                  }}
                  title="Click to call (backup)"
                >
                  {driverPhone || "Phone not available"}
                </a>

                <button
                  type="button"
                  onClick={() => setCallCompleted(true)}
                  style={{
                    ...btn(false),
                    background: callCompleted ? "rgba(90,200,140,0.18)" : "rgba(0,0,0,0.18)",
                    border: callCompleted
                      ? "1px solid rgba(90,200,140,0.45)"
                      : "1px solid rgba(140,190,255,0.20)",
                  }}
                >
                  {callCompleted ? "Call Completed ✅" : "Mark Call Completed"}
                </button>

                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  Call Completed is required before submit (works for click-to-call OR manual dialing).
                </div>
              </div>
            </div>

            {/* STEP 4: ANSWERED YES/NO */}
            <div style={{ marginTop: 14, ...card }}>
              <div style={label}>DID THE DRIVER ANSWER THEIR PHONE?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button
                  style={pill(driverAnswered === "YES")}
                  onClick={() => setDriverAnswered("YES")}
                  type="button"
                >
                  YES
                </button>
                <button
                  style={pill(driverAnswered === "NO")}
                  onClick={() => setDriverAnswered("NO")}
                  type="button"
                >
                  NO
                </button>
              </div>

              <div style={{ marginTop: 14, opacity: 0.8, fontSize: 13 }}>
                Submit becomes available once DOT, Plate, Call Completed, and Answered YES/NO are set.
              </div>

              <div style={{ marginTop: 14 }}>
                <button
                  style={{
                    ...btn(true),
                    opacity: canSubmit ? 1 : 0.55,
                    cursor: canSubmit ? "pointer" : "not-allowed",
                  }}
                  disabled={!canSubmit || submitLoading}
                  onClick={submitVerification}
                  title="Submit Verification"
                >
                  {submitLoading ? "Submitting..." : "SUBMIT VERIFICATION"}
                </button>
              </div>

              {submitError ? (
                <div style={{ marginTop: 12, border: "1px solid rgba(255,90,90,0.35)", background: "rgba(255,90,90,0.08)", padding: 12, borderRadius: 12 }}>
                  <b>Error:</b> {submitError}
                </div>
              ) : null}
            </div>

            {/* RESULT */}
            {result ? (
              <div
                style={{
                  marginTop: 14,
                  ...card,
                  borderColor:
                    result.verdict === "clear"
                      ? "rgba(90,200,140,0.35)"
                      : "rgba(255,90,90,0.35)",
                  background:
                    result.verdict === "clear"
                      ? "rgba(90,200,140,0.10)"
                      : "rgba(255,90,90,0.10)",
                  textAlign: "center",
                  padding: 22,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 950, letterSpacing: 1, opacity: 0.85 }}>
                  {result.verdict === "clear" ? "CLEAR" : "CAUTION"}
                </div>
                <div style={{ fontSize: 34, fontWeight: 950, letterSpacing: 0.6, marginTop: 8 }}>
                  {result.verdict === "clear" ? "CLEAR TO LOAD" : "DO NOT LOAD"}
                </div>
                <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
                  (No DOT/Plate on-record values are displayed on this screen.)
                </div>
              </div>
            ) : null}
          </>
        )}

        <div style={{ marginTop: 16, opacity: 0.55, fontSize: 12 }}>
          (Ref) Token:{" "}
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
            {clean.token || "(missing)"}
          </span>
        </div>
      </div>
    </div>
  );
}
