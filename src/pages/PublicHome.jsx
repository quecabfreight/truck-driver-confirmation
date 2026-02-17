import React from "react";
import { useNavigate } from "react-router-dom";

export default function PublicHome() {
  const nav = useNavigate();

  return (
    <div style={{ background: "#0f1722", color: "#e6edf5", minHeight: "100vh" }}>

      {/* HERO SECTION */}
      <section style={{
        padding: "120px 40px 100px 40px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "800",
          marginBottom: "20px",
          letterSpacing: "-0.5px"
        }}>
          Stop double brokering before the truck gets loaded.
        </h1>

        <p style={{
          fontSize: "20px",
          opacity: 0.8,
          marginBottom: "40px"
        }}>
          Real-time Truck-Driver verification at the dock.
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={() => nav("/join")}
            style={{
              padding: "16px 28px",
              fontSize: "18px",
              fontWeight: "700",
              background: "#1f3b63",
              border: "1px solid #2e5a96",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Request Access
          </button>

          <button
            onClick={() => nav("/login")}
            style={{
              padding: "16px 28px",
              fontSize: "18px",
              fontWeight: "700",
              background: "transparent",
              border: "1px solid #2e5a96",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Log In
          </button>
        </div>
      </section>

      {/* PROOF SECTION */}
      <section style={{
        padding: "80px 40px",
        background: "#0c1420"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          <h2 style={{
            textAlign: "center",
            marginBottom: "60px",
            fontWeight: "600",
            opacity: 0.8
          }}>
            Dock Verification Outcome
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px"
          }}>

            {/* CLEAR CARD */}
            <div style={{
              border: "1px solid #1f7a3f",
              padding: "40px",
              borderRadius: "8px",
              background: "#0f1b16"
            }}>
              <h3 style={{ color: "#3ddc84", fontSize: "28px", marginBottom: "30px" }}>
                CLEAR TO LOAD
              </h3>

              <p>USDOT#: MATCHED</p>
              <p>PLATE: MATCHED</p>
              <p>DRIVER PHONE: CONFIRMED</p>

              <hr style={{ margin: "30px 0", opacity: 0.2 }} />

              <p style={{ fontWeight: "600" }}>
                All checks passed. Clear to load.
              </p>
            </div>

            {/* CAUTION CARD */}
            <div style={{
              border: "1px solid #8b1c1c",
              padding: "40px",
              borderRadius: "8px",
              background: "#1a1010"
            }}>
              <h3 style={{ color: "#ff4d4d", fontSize: "28px", marginBottom: "30px" }}>
                CAUTION ALERT — DO NOT LOAD
              </h3>

              <p>USDOT#: MISMATCH</p>
              <p>PLATE: MISMATCH</p>
              <p>DRIVER PHONE: NOT CONFIRMED</p>

              <hr style={{ margin: "30px 0", opacity: 0.2 }} />

              <p style={{ fontWeight: "600" }}>
                Verification failed. Do not release freight.
              </p>
            </div>

          </div>

          <p style={{
            textAlign: "center",
            marginTop: "60px",
            opacity: 0.7
          }}>
            Verification happens before freight moves.
          </p>

        </div>
      </section>

    </div>
  );
}
