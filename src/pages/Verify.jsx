import { useState } from "react";

export default function Verify() {
  // Simulated values that would normally come from the QR link or server
  const usdotExpected = "1234567"; // <-- big bold on screen
  const [usdotOnTruck, setUsdotOnTruck] = useState("");
  const [truckMatches, setTruckMatches] = useState(false);
  const [answeredPhone, setAnsweredPhone] = useState(false);
  const [result, setResult] = useState(null); // "clear" | "caution" | null

  function submitCheck(e) {
    e.preventDefault();
    const matches = usdotOnTruck.trim() === usdotExpected;
    // auto-toggle the first checkbox to reflect actual equality check
    setTruckMatches(matches);

    if (matches && answeredPhone) {
      setResult("clear");
    } else {
      setResult("caution");
      // brief attention flash
      const el = document.getElementById("caution-banner");
      if (el) {
        el.classList.remove("flash");
        // force reflow to restart animation
        void el.offsetWidth;
        el.classList.add("flash");
      }
      // optional subtle beep (neutral tone)
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 520; // neutral short tone
        o.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.01);
        o.start();
        o.stop(ctx.currentTime + 0.15);
      } catch {}
    }
  }

  const card = {
    maxWidth: 800,
    margin: "40px auto",
    padding: 24,
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,.08)",
    fontFamily: "system-ui, sans-serif",
  };

  const label = { display: "block", marginBottom: 12 };
  const input = { width: "100%", marginTop: 6, padding: 12, borderRadius: 10, border: "1px solid #ddd", fontSize: 18 };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f8", padding: "24px" }}>
      {result === "caution" && (
        <div
          id="caution-banner"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            margin: "-24px -24px 24px -24px",
            padding: "18px 24px",
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: 0.5,
            color: "#fff",
            background: "#C62828",
          }}
          className="caution-banner"
        >
          CAUTION ALERT — DO NOT LOAD
        </div>
      )}

      <div style={card}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Verification</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>QueCab AdbS</div>
        </div>

        <div style={{ marginBottom: 16, background: "#f4f5f7", padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>EXPECTED USDOT#</div>
          <div style={{ fontSize: 32, fontWeight: 900 }}>{usdotExpected}</div>
        </div>

        <form onSubmit={submitCheck}>
          <label style={label}>
            <span style={{ fontWeight: 600 }}>Enter USDOT# seen on truck</span>
            <input
              style={input}
              value={usdotOnTruck}
              onChange={(e) => setUsdotOnTruck(e.target.value)}
              inputMode="numeric"
              placeholder="Type the USDOT number on the truck"
              required
            />
          </label>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={truckMatches} onChange={(e) => setTruckMatches(e.target.checked)} />
              <span style={{ fontWeight: 700 }}>DOES THE USDOT# ON THE TRUCK MATCH?</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={answeredPhone} onChange={(e) => setAnsweredPhone(e.target.checked)} />
              <span style={{ fontWeight: 700 }}>DID THE DRIVER ANSWER THEIR PHONE?</span>
            </label>
          </div>

          <button
            type="submit"
            style={{
              marginTop: 18,
              width: "100%",
              padding: 14,
              border: 0,
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: "#111",
              color: "#fff",
            }}
          >
            Submit
          </button>
        </form>

        {result === "clear" && (
          <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: "#E8F5E9", color: "#1B5E20", fontWeight: 700 }}>
            ✅ CLEAR TO LOAD
          </div>
        )}

        {result === "caution" && (
          <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: "#FFEBEE", color: "#B71C1C", fontWeight: 700 }}>
            ⚠️ CAUTION ALERT — DO NOT LOAD
          </div>
        )}
      </div>

      {/* tiny CSS for subtle flash (kept inline to avoid extra files) */}
      <style>{`
        .flash {
          animation: qcFlash 0.8s ease-in-out 0s 2 alternate;
        }
        @keyframes qcFlash {
          0%   { filter: brightness(1); }
          50%  { filter: brightness(1.35); }
          100% { filter: brightness(1); }
        }
      `}</style>
    </div>
  );
}
