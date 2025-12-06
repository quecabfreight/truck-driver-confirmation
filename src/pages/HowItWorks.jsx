import React from "react";

export default function HowItWorks() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "520px",
          padding: "34px 30px 32px",
          background: "#020617",
          borderRadius: "18px",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 18px 48px rgba(0,0,0,0.7)",
          textAlign: "center",
        }}
      >
        <img
          src="/qc-logo.png"
          alt="QueCab AdbS Logo"
          style={{
            width: "72px",
            height: "72px",
            objectFit: "contain",
            marginBottom: "14px",
          }}
        />

        <h1
          style={{
            fontSize: "24px",
            marginBottom: "4px",
          }}
        >
          How QueCab AdbS Works
        </h1>
        <p
          style={{
            fontSize: "16px",
            marginBottom: "18px",
            opacity: 0.85,
          }}
        >
          1 link. 3 checks. Instant verification at the dock.
        </p>

        <ul
          style={{
            fontSize: "15px",
            lineHeight: 1.7,
            marginBottom: "18px",
            paddingLeft: "20px",
            textAlign: "left",
          }}
        >
          <li>What is the USDOT number on the truck?</li>
          <li>What is the license plate number on the truck?</li>
          <li>Did the driver answer their registered phone?</li>
        </ul>

        <p
          style={{
            fontSize: "14px",
            marginBottom: "8px",
          }}
        >
          If all three checks confirm:
          <br />
          <strong>YES = CLEAR TO LOAD</strong>
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#f97373",
          }}
        >
          If anything feels off:
          <br />
          <strong>NO = Caution alert. Hold this load.</strong>
        </p>

        <p
          style={{
            marginTop: "14px",
            fontSize: "13px",
            opacity: 0.8,
          }}
        >
          The AdbS Truck-Driver Verification Link brings the broker/shipper,
          driver, and dock onto the same screen in seconds.
        </p>
      </div>
    </div>
  );
}
