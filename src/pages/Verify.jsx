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

  const [dockPin, setDockPin] = useState("");
  const [pinStatus, setPinStatus] = useState(""); // success/error text
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [phoneUnlocked, setPhoneUnlocked] = useState(false);

  const [driverPhone, setDriverPhone] = useState(""); // revealed or manual
  const [phoneLinkClicked, setPhoneLinkClicked] = useState(false);

  const [enteredDot, setEnteredDot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");

  const [driverAnswered, setDriverAnswered] = useState(""); // "YES" | "NO" | ""
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null); // { result: "clear"|"caution", ... }

  useEffect(() => {
    document.title = "Dock Verification — QueCab AdbS";
  }, []);

  const clean = useMemo(() => {
    return {
      token: String(token || "").trim(),
      dot: toUpper(enteredDot).trim(),
      plate: toUpper(enteredPlate).trim(),
      driverAnswered: driverAnswered,
      phone: formatPhoneHyphen(driverPhone),
      dockPin: String(dockPin || "").trim(),
    };
  }, [token, enteredDot, enteredPlate, driverAnswered, driverPhone, dockPin]);

  const canSubmit = useMemo(() => {
    if (!clean.token) return false;
    if (!clean.dot) return false;
    if (!clean.plate) return false;
    if (clean.driverAnswered !== "YES" && clean.driverAnswered !== "NO") return false;

    // If phone is unlocked, require they at least clicked it once (preferred),
    // BUT allow submit even if tel link is blocked (some desktops).
    // So: submit allowed either phoneLinkClicked OR driverAnswered is selected.
    // (DriverAnswered is required anyway.)
    return true;
  }, [clean]);

  async function revealPhone() {
    setPinError("");
    setPinStatus("");
    setPinLoading(true);
    setPhoneUnlocked(false);

    try {
      // Preferred endpoint name (if it exists)
      // POST /api/reveal_driver_phone { token, dock_pin }
      const res = await fetch("/api/reveal_driver_phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: clean.token, dock_pin: clean.dockPin }),
      });

      // If the endpoint does not exist yet, DON'T crash; fall back to manual.
      if (res.status === 404) {
        setPhoneUnlocked(true);
        setPinStatus(
          "Dock authorization endpoint isn’t live yet (404). Phone reveal fallback enabled for testing."
        );
        setPinLoading(false);
        return;
      }

      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.error || data?.message || `Dock authorization failed (${res.status}).`;
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
      setPhoneUnlocked(true);
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
        driver_answered: clean.driverAnswered === "YES",
      };

      // Optional: include load_id if present in future; not required to submit.
      // payload.load_id = ...

      const res = await fetch("/api/submit_verify_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.message ||
          `Submit failed (${res.status}).`;
        setSubmitError(msg);
        setSubmitLoading(false);
        return;
      }

      // Normalize response shapes
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

  const page = {
    minHeight: "100vh",
    background: "#0f1722",
    color: "#e6edf5",
  };

  const wrap = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "18px 16px 60px",
  };

  const card = {
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 16,
  };

  const h1 = { fontSize: 26, fontWeight: 950, margin: 0, letterSpacing: 0.2 };

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

  return (
    <div style={page}>
      <div style={wrap}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
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

        <div style={{ marginTop: 14, ...card }}>
          <div style={h1}>DOES THE USDOT# ON THE TRUCK MATCH?</div>
          <div style={{ marginTop: 10, fontSize: 16, opacity: 0.9, fontWeight: 900 }}>
            DID THE DRIVER ANSWER THEIR PHONE?
          </div>
          <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
            Both must be completed before submitting verification.
          </div>
        </div>

        {/* Dock Authorization (PIN) */}
        <div style={{ marginTop: 14, ...card }}>
          <div style={{ fontSize: 16, fontWeight: 950, marginBottom: 8 }}>
            Dock Authorization Required
          </div>
          <div style={{ fontSize: 13, opacity: 0.82, marginBottom: 12 }}>
            Enter the dock PIN to reveal the driver phone number for manual dialing backup.
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
              onClick={revealPhone}
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

          {/* Phone reveal / fallback */}
          <div style={{ marginTop: 12 }}>
            <div style={label}>Driver Phone</div>
            {phoneUnlocked ? (
              <div style={{ display: "grid", gap: 10 }}>
                <a
                  href={driverPhone ? `tel:${onlyDigits(driverPhone)}` : undefined}
                  onClick={() => setPhoneLinkClicked(true)}
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
                  {driverPhone ? driverPhone : "Phone not available (enter manually below)"}
                </a>

                {!driverPhone ? (
                  <input
                    style={input}
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(formatPhoneHyphen(e.target.value))}
                    placeholder="Enter phone manually (backup)"
                    inputMode="tel"
                    autoComplete="off"
                  />
                ) : null}

                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  Backup: if clicking doesn’t dial on this device, dial manually using the number shown.
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 13, opacity: 0.75 }}>
                Phone hidden until Dock Authorization.
              </div>
            )}
          </div>
        </div>

        {/* Main entry fields */}
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

          <div style={{ marginTop: 14 }}>
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
          </div>

          <div style={{ marginTop: 14, opacity: 0.8, fontSize: 13 }}>
            Submit becomes available once DOT, Plate, and Answered YES/NO are set.
          </div>

          <div style={{ marginTop: 14 }}>
            <button
              style={{ ...btn(true), opacity: canSubmit ? 1 : 0.55, cursor: canSubmit ? "pointer" : "not-allowed" }}
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

        {/* Result */}
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
              (No on-record values are displayed on this screen.)
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 16, opacity: 0.55, fontSize: 12 }}>
          Token: <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>{clean.token || "(missing)"}</span>
        </div>
      </div>
    </div>
  );
}
