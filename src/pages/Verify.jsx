// /src/pages/Verify.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(body || {}),
  });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

async function getJSON(url) {
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

export default function Verify() {
  const nav = useNavigate();
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [ctx, setCtx] = useState(null); // { load_id, starts_at, expires_at, status, ... }
  const [err, setErr] = useState("");

  // Dock authorization gate
  const [pin, setPin] = useState("");
  const [pinOk, setPinOk] = useState(false);
  const [pinBusy, setPinBusy] = useState(false);

  // Verification inputs (NO live match signals)
  const [enteredDot, setEnteredDot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");
  const [driverAnswered, setDriverAnswered] = useState(""); // "YES" | "NO" | ""

  // Phone (revealed only after Dock PIN)
  const [driverPhone, setDriverPhone] = useState("");
  const [phoneBusy, setPhoneBusy] = useState(false);

  // Result
  const [subBusy, setSubBusy] = useState(false);
  const [result, setResult] = useState(null); // { result, message, ... }

  const cleanToken = useMemo(() => String(token || "").trim(), [token]);

  useEffect(() => {
    let alive = true;

    async function loadContext() {
      setLoading(true);
      setErr("");
      setCtx(null);

      if (!cleanToken) {
        setErr("Missing verification token.");
        setLoading(false);
        return;
      }

      const q = encodeURIComponent(cleanToken);
      const r = await getJSON(`/api/get_verify_context?t=${q}`);

      if (!alive) return;

      if (!r.ok || !r.data || !r.data.ok) {
        const msg =
          (r.data && (r.data.error || r.data.message)) ||
          `Unable to load verification context (${r.status}).`;
        setErr(msg);
        setLoading(false);
        return;
      }

      setCtx(r.data.context || null);
      setLoading(false);
    }

    loadContext();
    return () => {
      alive = false;
    };
  }, [cleanToken]);

  const expired = useMemo(() => {
    const ex = ctx?.expires_at;
    if (!ex) return false; // "No Expire" allowed
    const t = Date.parse(ex);
    if (!Number.isFinite(t)) return false;
    return Date.now() > t;
  }, [ctx]);

  async function authorizeDock() {
    setErr("");
    setPinBusy(true);

    const r = await postJSON("/api/reveal_driver_phone", {
      t: cleanToken,
      pin: String(pin || "").trim(),
    });

    setPinBusy(false);

    if (!r.ok || !r.data || !r.data.ok) {
      const msg =
        (r.data && (r.data.error || r.data.message)) ||
        "Dock authorization failed.";
      setErr(msg);
      setPinOk(false);
      setDriverPhone("");
      return;
    }

    setPinOk(true);
    setDriverPhone(formatPhoneHyphen(r.data.driver_phone || ""));
  }

  async function refreshPhone() {
    if (!pinOk) return;
    setErr("");
    setPhoneBusy(true);

    const r = await postJSON("/api/reveal_driver_phone", {
      t: cleanToken,
      pin: String(pin || "").trim(),
    });

    setPhoneBusy(false);

    if (!r.ok || !r.data || !r.data.ok) {
      const msg =
        (r.data && (r.data.error || r.data.message)) ||
        "Could not refresh phone.";
      setErr(msg);
      return;
    }

    setDriverPhone(formatPhoneHyphen(r.data.driver_phone || ""));
  }

  const canSubmit = useMemo(() => {
    if (!ctx) return false;
    if (expired) return false;
    if (!pinOk) return false;

    const dot = onlyDigits(enteredDot);
    const plate = toUpper(enteredPlate).trim();

    if (!dot) return false;
    if (!plate) return false;
    if (driverAnswered !== "YES" && driverAnswered !== "NO") return false;

    return true;
  }, [ctx, expired, pinOk, enteredDot, enteredPlate, driverAnswered]);

  async function submitVerification() {
    setErr("");
    setResult(null);
    setSubBusy(true);

    const payload = {
      token: cleanToken,
      load_id: ctx?.load_id ?? null,
      entered_usdot: onlyDigits(enteredDot),
      entered_plate: toUpper(enteredPlate).trim(),
      driver_answered: driverAnswered === "YES",
      checked_at: new Date().toISOString(),
    };

    const r = await postJSON("/api/submit_verify_check", payload);

    setSubBusy(false);

    if (!r.ok || !r.data) {
      const msg =
        (r.data && (r.data.error || r.data.message)) ||
        `Submit failed (${r.status}).`;
      setErr(msg);
      return;
    }

    // Accept a few shapes
    const verdict =
      r.data.result ||
      (r.data.data && r.data.data.result) ||
      (r.data.verdict ? r.data.verdict : "");

    const message =
      r.data.message ||
      (r.data.data && r.data.data.message) ||
      "";

    setResult({
      result: String(verdict || "").toUpperCase(),
      message: message || "",
      raw: r.data,
    });
  }

  const page = {
    minHeight: "100vh",
    background: "#0f1722",
    color: "#e6edf5",
  };
  const wrap = { maxWidth: 980, margin: "0 auto", padding: "18px 16px 56px" };
  const card = {
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.26)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 16,
  };
  const h1 = { fontSize: 22, fontWeight: 950, margin: 0 };
  const label = { fontSize: 13, opacity: 0.85, marginBottom: 6 };
  const input = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.05)",
    color: "inherit",
    fontSize: 16,
    outline: "none",
  };
  const btn = (primary) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(140,190,255,0.42)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary
      ? "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))"
      : "rgba(255,255,255,0.06)",
    color: "#e6edf5",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
  });

  return (
    <div style={page}>
      <div style={wrap}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={{ width: 40, height: 40, objectFit: "contain" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div>
            <div style={h1}>Dock Verification</div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>
              Verify before you load • Truck-Driver confirmation
            </div>
          </div>
        </div>

        {loading ? (
          <div style={card}>Loading verification…</div>
        ) : err ? (
          <div style={{ ...card, borderColor: "rgba(255,90,90,0.35)" }}>
            <div style={{ fontWeight: 950, marginBottom: 6 }}>Unable to load</div>
            <div style={{ opacity: 0.9, marginBottom: 10 }}>{String(err)}</div>
            <button style={btn(false)} onClick={() => nav("/")}>
              Back Home
            </button>
          </div>
        ) : !ctx ? (
          <div style={card}>No verification context found.</div>
        ) : expired ? (
          <div style={{ ...card, borderColor: "rgba(255,170,90,0.40)" }}>
            <div style={{ fontWeight: 950, marginBottom: 6 }}>Link Expired</div>
            <div style={{ opacity: 0.9 }}>
              This verification link is no longer valid.
            </div>
          </div>
        ) : (
          <>
            {/* Dock PIN Gate */}
            {!pinOk ? (
              <div style={card}>
                <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 8 }}>
                  Dock Authorization Required
                </div>
                <div style={{ fontSize: 14, opacity: 0.82, lineHeight: 1.45, marginBottom: 12 }}>
                  Enter the dock PIN to reveal the driver phone number for manual dialing backup.
                </div>

                <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
                  <div>
                    <div style={label}>Dock PIN</div>
                    <input
                      style={input}
                      value={pin}
                      onChange={(e) => setPin(onlyDigits(e.target.value).slice(0, 6))}
                      placeholder="Enter PIN"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />
                  </div>
                  <button
                    style={btn(true)}
                    onClick={authorizeDock}
                    disabled={pinBusy || String(pin || "").trim().length < 4}
                    title="Authorize Dock"
                  >
                    {pinBusy ? "Authorizing…" : "Authorize Dock"}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Main Form */}
            <div style={{ ...card, marginTop: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 10 }}>
                DOES THE USDOT# ON THE TRUCK MATCH?
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={label}>ENTER DOT</div>
                  <input
                    style={input}
                    value={enteredDot}
                    onChange={(e) => setEnteredDot(toUpper(e.target.value))}
                    placeholder="ENTER DOT"
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
                    placeholder="ENTER PLATE"
                    inputMode="text"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div style={{ marginTop: 14, fontSize: 18, fontWeight: 950 }}>
                DID THE DRIVER ANSWER THEIR PHONE?
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 10, maxWidth: 520 }}>
                <div>
                  <div style={label}>Driver Phone (click to call)</div>
                  {pinOk ? (
                    <a
                      href={`tel:${onlyDigits(driverPhone)}`}
                      style={{
                        display: "inline-block",
                        padding: "12px 12px",
                        borderRadius: 12,
                        border: "1px solid rgba(120,180,255,0.35)",
                        background: "rgba(120,180,255,0.10)",
                        color: "#e6edf5",
                        fontSize: 18,
                        fontWeight: 950,
                        textDecoration: "none",
                      }}
                    >
                      {driverPhone || "—"}
                    </a>
                  ) : (
                    <div style={{ opacity: 0.75 }}>Dock PIN required.</div>
                  )}

                  {pinOk ? (
                    <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        style={btn(false)}
                        onClick={refreshPhone}
                        disabled={phoneBusy}
                        title="Refresh phone from server"
                      >
                        {phoneBusy ? "Refreshing…" : "Refresh Phone"}
                      </button>
                    </div>
                  ) : null}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    style={{
                      ...btn(driverAnswered === "YES"),
                      width: "auto",
                      minWidth: 140,
                      opacity: pinOk ? 1 : 0.5,
                    }}
                    disabled={!pinOk}
                    onClick={() => setDriverAnswered("YES")}
                  >
                    YES
                  </button>
                  <button
                    style={{
                      ...btn(driverAnswered === "NO"),
                      width: "auto",
                      minWidth: 140,
                      opacity: pinOk ? 1 : 0.5,
                    }}
                    disabled={!pinOk}
                    onClick={() => setDriverAnswered("NO")}
                  >
                    NO
                  </button>
                </div>

                <div style={{ fontSize: 14, opacity: 0.8 }}>
                  Both must be YES to clear the Truck-Driver for loading.
                </div>

                <button
                  style={{ ...btn(true), opacity: canSubmit ? 1 : 0.55 }}
                  onClick={submitVerification}
                  disabled={!canSubmit || subBusy}
                  title="Submit Verification"
                >
                  {subBusy ? "Submitting…" : "SUBMIT VERIFICATION"}
                </button>
              </div>

              {result ? (
                <div
                  style={{
                    marginTop: 14,
                    padding: 14,
                    borderRadius: 14,
                    border:
                      result.result === "CLEAR_TO_LOAD" || result.result === "CLEAR"
                        ? "1px solid rgba(80,190,120,0.45)"
                        : "1px solid rgba(255,90,90,0.45)",
                    background:
                      result.result === "CLEAR_TO_LOAD" || result.result === "CLEAR"
                        ? "rgba(80,190,120,0.10)"
                        : "rgba(255,90,90,0.10)",
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 950, letterSpacing: 0.3 }}>
                    {result.result === "CLEAR_TO_LOAD" || result.result === "CLEAR"
                      ? "CLEAR TO LOAD"
                      : "DO NOT LOAD"}
                  </div>
                  {result.message ? (
                    <div style={{ marginTop: 6, opacity: 0.9 }}>{result.message}</div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div style={{ marginTop: 12, opacity: 0.65, fontSize: 12 }}>
              Load ID: <b>{ctx.load_id || "(none)"}</b>{" "}
              {ctx.expires_at ? (
                <>
                  • Expires: <b>{ctx.expires_at}</b>
                </>
              ) : (
                <>• Expires: <b>Never</b></>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
