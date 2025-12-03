import React from "react";

export default function HowItWorks() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 0",
        background:
          "radial-gradient(circle at top, #1f2937 0%, #020617 45%, #020617 100%)",
        color: "white",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "960px",
          padding: "32px 24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* LOGO AS BACKDROP */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
            opacity: 0.20,
          }}
        >
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={{
              width: "420px",
              height: "auto",
              filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.9))",
            }}
          />
        </div>

        {/* TEXT OVERLAY IN FRONT OF LOGO */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "720px",
            textAlign: "center",
            padding: "32px 28px",
            borderRadius: "18px",
            border: "1px solid rgba(148,163,184,0.7)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.88))",
            boxShadow: "0 26px 60px rgba(0,0,0,0.85)",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            How QueCab AdbS Works
          </h1>
          <p
            style={{
              fontSize: "20px",
              marginBottom: "18px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            1 Link. 3 Checks. Instant Verification.
          </p>

          <div
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              textAlign: "left",
              margin: "0 auto 18px",
              maxWidth: "560px",
            }}
          >
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "22px",
                margin: 0,
              }}
            >
              <li>What&apos;s the USDOT# on the truck?</li>
              <li>What&apos;s the license plate number?</li>
              <li>Did the driver answer their registered phone?</li>
            </ul>
          </div>

          <div
            style={{
              fontSize: "18px",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#bbf7d0", fontWeight: 600 }}>✓ YES</span> ={" "}
            Cleared to Load
          </div>
          <div
            style={{
              fontSize: "18px",
            }}
          >
            <span style={{ color: "#fecaca", fontWeight: 600 }}>✖ NO</span> ={" "}
            Caution Alert (Hold This Load)
          </div>

          <p
            style={{
              fontSize: "15px",
              marginTop: "20px",
              opacity: 0.8,
            }}
          >
            No apps. No downloads. The AdbS Truck-Driver Verification Link
            brings the broker / shipper, driver, and dock onto the same screen
            in seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
