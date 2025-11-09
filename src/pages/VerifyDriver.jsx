import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import InAppBrowserBanner from "../components/InAppBrowserBanner";


// ---- helpers (unchanged core) ----
const decodeB64url = (s="") => {
  try {
    const pad = (t) => t + "===".slice((t.length + 3) % 4);
    const norm = s.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(pad(norm)))));
  } catch { return null; }
};
const normPlate = (s="") => s.toUpperCase().replace(/[\s-]/g,"");
const normDot = (s="") => s.replace(/\D/g,"");

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function YnButtons({ label, value, onChange }) {
  const yes = value === "Yes";
  const no  = value === "No";
  return (
    <div>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
        {label}
      </label>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          className="btn"
          style={{ background: yes ? "#2aa865" : "var(--button-bg)", color: yes ? "#fff" : "var(--button-text)", minWidth: 64 }}
          onClick={() => onChange("Yes")}
        >
          Y
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: no ? "#c62828" : "var(--button-bg)", color: no ? "#fff" : "var(--button-text)", minWidth: 64 }}
          onClick={() => onChange("No")}
        >
          N
        </button>
      </div>
    </div>
  );
}

// ---- NEW: lightweight loader for Tesseract (OCR) ----
let tesseractLoading = false;
function loadTesseract() {
  return new Promise((resolve, reject) => {
    if (window.Tesseract) return resolve(window.Tesseract);
    if (tesseractLoading) {
      const check = setInterval(() => {
        if (window.Tesseract) { clearInterval(check); resolve(window.Tesseract); }
      }, 100);
      setTimeout(() => { clearInterval(check); if (!window.Tesseract) reject(new Error("Tesseract load timeout")); }, 15000);
      return;
    }
    tesseractLoading = true;
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js";
    s.async = true;
    s.onload = () => resolve(window.Tesseract);
    s.onerror = () => reject(new Error("Failed to load Tesseract"));
    document.head.appendChild(s);
  });
}

// simple plate parser: choose the longest A–Z/0–9 run (5–8 chars typical)
function pickBestPlate(text = "") {
  const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, " ");
  const candidates = cleaned.match(/[A-Z0-9]{5,8}/g) || [];
  if (!candidates.length) return "";
  // prefer ones containing both letters and digits, then longest
  const scored = candidates.map(c => ({
    v: c,
    score: (/[A-Z]/.test(c) && /\d/.test(c) ? 10 : 0) + c.length
  }));
  scored.sort((a,b)=>b.score-a.score);
  return scored[0].v || "";
}

export default function VerifyDriver() {
  const { token } = useParams(); // kept for routing, not displayed
  const q = useQuery();

  // Expected values (beta, obfuscated in link)
  const expectedDot   = useMemo(() => (decodeB64url(q.get("vd"))?.d || ""), [q]);
  const expectedPlate = useMemo(() => (decodeB64url(q.get("vp"))?.p || ""), [q]);
  const tel = q.get("tel") || "";
  const alertEmails = (q.get("em") || "").split(",").map(s=>s.trim()).filter(Boolean);

  const [passedPin, setPassedPin] = useState(false);
  const [pin, setPin] = useState("");

  const [dotInput, setDotInput] = useState("");
  const [plateInput, setPlateInput] = useState("");
  const [ansCall, setAnsCall] = useState("");

  const [failCount, setFailCount] = useState(0);

  const audioRef = useRef(null);

  // NEW: OCR states
  const fileInputRef = useRef(null);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const [preview, setPreview] = useState("");

  const submitPin = (e) => {
    e.preventDefault();
    if ((pin || "").trim().length >= 4) setPassedPin(true);
  };

  const dotOk = expectedDot ? normDot(dotInput) === normDot(expectedDot) : false;
  const plateOk = expectedPlate ? normPlate(plateInput) === normPlate(expectedPlate) : false;
  const allYes = dotOk && plateOk && ansCall === "Yes";
  const ready = dotInput && plateInput && ansCall;

  useEffect(() => {
    if (ready && !allYes && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [ready, allYes]);

  const handleSubmit = () => {
    if (!ready) { alert("Please complete all three checks."); return; }
    if (allYes) return; // banner renders below

    // tally failed attempts and auto-open email on 3rd+
    setFailCount((prev) => {
      const next = prev + 1;
      if (next >= 3 && alertEmails.length) {
        const body = [
          "CAUTION ALERT — DO NOT LOAD",
          "",
          `USDOT entered: ${normDot(dotInput)} (expected)`,
          `Plate entered: ${normPlate(plateInput)} (expected)`,
          `Phone call answered: ${ansCall}`,
          `Token: ${token}`,
          "",
          "Triggered automatically on third failed verification attempt."
        ].join("\n");
        const mailto = `mailto:${alertEmails.join(",")}?subject=AdbS%20Caution%20Alert&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
      }
      return next;
    });
  };

  // ---- NEW: Scan Plate flow ----
  const startScan = () => {
    setOcrError("");
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onPickedImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || "");
      setPreview(dataUrl);
      setOcrBusy(true);
      setOcrError("");
      try {
        const T = await loadTesseract();
        const { data } = await T.recognize(dataUrl, "eng");
        const best = pickBestPlate(data.text || "");
        if (best) {
          setPlateInput(best);
        } else {
          setOcrError("Couldn’t read plate. Type it in.");
        }
      } catch (err) {
        setOcrError("Camera/OCR unavailable here. Type it in.");
      } finally {
        setOcrBusy(false);
        // reset input so same photo can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <audio ref={audioRef} src="/alert.mp3" preload="auto" />

      {!passedPin ? (
        <div className="card">
          <h1>Enter PIN</h1>
          <form className="form" onSubmit={submitPin}>
            <input
              className="input"
              placeholder="PIN"
              value={pin}
              onChange={(e)=>setPin(e.target.value)}
              inputMode="numeric"
            />
            <button className="btn">Continue</button>
          </form>
        </div>
      ) : (
        <div className="card">
          <h1>Truck-Driver Verification</h1>

          {/* Dock-only clickable phone (after PIN) */}
          {tel && (
            <p style={{ marginBottom: 12 }}>
              <strong>Call Driver:</strong>{" "}
              <a href={`tel:${tel}`} style={{ textDecoration: "none", fontWeight: 900 }}>
                {tel}
              </a>
            </p>
          )}

          <div className="form">
            {/* USDOT entry with auto check */}
            <div>
              <label>USDOT# (enter what’s on the truck)
                {dotOk && <span style={{ color: "#2aa865", marginLeft: 10 }}>✅</span>}
                {!dotOk && dotInput ? <span style={{ color: "#c62828", marginLeft: 10 }}>❌</span> : null}
              </label>
              <input
                className="input"
                value={dotInput}
                onChange={(e)=>setDotInput(e.target.value)}
                inputMode="numeric"
              />
            </div>

            {/* Plate entry with auto check + SCAN button */}
            <div>
              <label>License Plate (enter what’s on the truck)
                {plateOk && <span style={{ color: "#2aa865", marginLeft: 10 }}>✅</span>}
                {!plateOk && plateInput ? <span style={{ color: "#c62828", marginLeft: 10 }}>❌</span> : null}
              </label>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input
                  className="input"
                  value={plateInput}
                  onChange={(e)=>setPlateInput(e.target.value.toUpperCase())}
                  inputMode="text"
                  autoCapitalize="characters"
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn" onClick={startScan} disabled={ocrBusy} title="Scan plate with camera">
                  {ocrBusy ? "Scanning…" : "Scan Plate"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onPickedImage}
                  style={{ display: "none" }}
                />
              </div>

              {preview && (
                <div style={{ marginTop: 8 }}>
                  <img src={preview} alt="preview" style={{ maxWidth: "100%", borderRadius: 12, opacity: ocrBusy ? 0.6 : 1 }} />
                </div>
              )}
              {ocrError && <p className="muted" style={{ color: "var(--danger)", marginTop: 8 }}>{ocrError}</p>}
            </div>

            {/* Phone call Y/N */}
            <YnButtons
              label="Did the driver answer their phone when called?"
              value={ansCall}
              onChange={setAnsCall}
            />
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button className="btn" onClick={handleSubmit}>SUBMIT</button>
          </div>

          {ready && (
            <div
              className={`banner ${allYes ? "success" : "danger flash-danger"}`}
              style={{ marginTop: 16 }}
            >
              {allYes ? "✅ CLEAR TO LOAD" : "🚫 CAUTION ALERT — DO NOT LOAD"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
