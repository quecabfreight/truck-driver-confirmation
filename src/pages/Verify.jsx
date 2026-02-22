// /src/pages/Verify.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { LS_EMAIL, isBrokerOrShipper } from "../utils/auth.js";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}
function upper(s) {
  return String(s || "").toUpperCase();
}

export default function Verify() {
  const nav = useNavigate();
  const { token } = useParams();

  const email = (localStorage.getItem(LS_EMAIL) || "").trim();
  const authorized = !!email && isBrokerOrShipper(email);

  // Verify screen is for authorized dock/check-in personnel only
  useEffect(() => {
    if (!authorized) nav("/login", { replace: true });
  }, [authorized, nav]);

  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [link, setLink] = useState(null);

  const [enteredUsdot, setEnteredUsdot] = useState("");
  const [enteredPlate, setEnteredPlate] = useState("");
  const [driverAnswered, setDriverAnswered] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // CLEAR | CAUTION
  const [details, setDetails] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setLoadErr("");
      try {
        const res = await fetch(`/api/load_verify_link?token=${encodeURIComponent(token || "")}`, {
          method: "GET",
        });

        const text = await res.text();
        let data = null;
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }

        if (!res.ok) {
          if (!alive) return;
          setLoadErr("Load failed (404)");
          setLink(null);
          setLoading(false);
          return;
        }

        if (!alive) return;
        setLink(data.link);
      } catch {
        if (!alive) return;
        setLoadErr("Network error loading link.");
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
    if (!link) return null;
    const usdotMatch = onlyDigits(enteredUsdot) && onlyDigits(enteredUsdot) === onlyDigits(link.usdot_on_record);
    const plateMatch = upper(enteredPlate).trim() && upper(enteredPlate).trim() === upper(link.plate_on_record).trim();
    return { usdotMatch, plateMatch };
  }, [link, enteredUsdot, enteredPlate]);

  async function submit() {
    if (!link) return;
    setSubmitting(true);

    try {
      const payload = {
        token: link.token,
        entered_usdot: upper(enteredUsdot),
        entered_plate: upper(enteredPlate),
        driver_answered: driverAnswered,
      };

      const res = await fetch("/api/submit_verify_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        setLoadErr((data && (data.error || data.message)) || `Submit failed (${res.status}).`);
        setSubmitting(false);
        return;
      }

      setResult(data.result);
      setDetails(data.details || null);
    } catch {
      setLoadErr("Network error submitting verification.");
    } finally {
      setSubmitting(false);
    }
  }

  const page = { minHeight: "100vh" };
  const wrap = { maxWidth: 1100, margin: "0 auto", padding: "18px 16px 48px" };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const label = { fontSize: 14, opacity: 0.92, marginBottom: 6 };
  const input = {
    width: "100%",
    padding: "12px 12px",
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
    border: primary ? "1px solid rgba(120,180,255,0.45)" : "1px solid rgba(255,255,255,0.16)",
    background: primary ? "rgba(40, 110, 190, 0.35)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 18,
    fontWeight: 900,
    cursor: "pointer",
  });

  if (!authorized) return null;

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        {loading ? (
          <div style={card}>Loading…</div>
        ) : loadErr ? (
          <div style={card}>
            <div style={{ fontSize: 22, fontWeight: 950, marginBottom: 10 }}>Unable to load</div>
            <div style={{ opacity: 0.9 }}>{loadErr}</div>
            <div style={{ marginTop: 14 }}>
              <button style={btn(false)} onClick={() => nav("/")}>Back Home</button>
            </div>
          </div>
        ) : (
          <div style={card}>
            <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: 0.2 }}>
              DOES THE USDOT# ON THE TRUCK MATCH?
            </div>
            <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: 0.2, marginTop: 10 }}>
              DID THE DRIVER ANSWER THEIR PHONE?
            </div>

            <div style={{ marginTop: 14, opacity: 0.9 }}>
              Both must be <b>YES</b> to clear the <b>Truck-Driver</b> for loading.
            </div>

            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              <div>
                <div style={label}>Load ID</div>
                <div style={{ fontSize: 22, fontWeight: 950 }}>{link.load_id || "—"}</div>
              </div>

              <div>
                <div style={label}>Enter USDOT#</div>
                <input
                  style={input}
                  value={enteredUsdot}
                  onChange={(e) => setEnteredUsdot(upper(e.target.value))}
                  placeholder="123456"
                  autoComplete="off"
                />
                <div style={{ marginTop: 8, fontSize: 16, opacity: 0.9 }}>
                  USDOT Match: <b>{computed?.usdotMatch ? "YES" : enteredUsdot ? "NO" : "—"}</b>
                </div>
              </div>

              <div>
                <div style={label}>Enter Plate</div>
                <input
                  style={input}
                  value={enteredPlate}
                  onChange={(e) => setEnteredPlate(upper(e.target.value))}
                  placeholder="ABC1234"
                  autoComplete="off"
                />
                <div style={{ marginTop: 8, fontSize: 16, opacity: 0.9 }}>
                  Plate Match: <b>{computed?.plateMatch ? "YES" : enteredPlate ? "NO" : "—"}</b>
                </div>
              </div>

              <div>
                <div style={label}>Driver Answered Phone?</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    style={btn(driverAnswered === "YES")}
                    onClick={() => setDriverAnswered("YES")}
                    type="button"
                  >
                    YES
                  </button>
                  <button
                    style={btn(driverAnswered === "NO")}
                    onClick={() => setDriverAnswered("NO")}
                    type="button"
                  >
                    NO
                  </button>
                </div>
              </div>

              <button
                style={btn(true)}
                disabled={submitting || !enteredUsdot || !enteredPlate || !driverAnswered}
                onClick={submit}
              >
                {submitting ? "Submitting…" : "Submit Verification"}
              </button>

              {result ? (
                <div
                  style={{
                    marginTop: 8,
                    borderRadius: 14,
                    padding: 16,
                    border:
                      result === "CLEAR"
                        ? "1px solid rgba(80,190,120,0.35)"
                        : "1px solid rgba(255,90,90,0.35)",
                    background:
                      result === "CLEAR"
                        ? "rgba(80,190,120,0.10)"
                        : "rgba(255,90,90,0.10)",
                  }}
                >
                  <div style={{ fontSize: 30, fontWeight: 950 }}>
                    {result === "CLEAR" ? "CLEAR TO LOAD" : "CAUTION ALERT — DO NOT LOAD"}
                  </div>
                  {details ? (
                    <div style={{ marginTop: 10, opacity: 0.92, fontSize: 14, lineHeight: 1.45 }}>
                      USDOT Match: <b>{details.usdot_match ? "YES" : "NO"}</b>
                      <br />
                      Plate Match: <b>{details.plate_match ? "YES" : "NO"}</b>
                      <br />
                      Driver Answered: <b>{details.driver_answered ? "YES" : "NO"}</b>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
