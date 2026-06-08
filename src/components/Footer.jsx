import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        padding: "18px",
        textAlign: "center",
        fontSize: "13px",
        color: "rgba(220,230,240,0.68)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(8,12,18,0.55)",
        letterSpacing: "0.2px",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)"
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto 14px",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "1px solid rgba(255,215,0,0.25)",
          background: "rgba(255,215,0,0.06)",
          color: "#ffd76a",
          lineHeight: "1.6"
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: "14px",
            marginBottom: "4px",
            letterSpacing: "0.5px"
          }}
        >
          BETA VERSION
        </div>

        <div>
          This platform is actively being improved. Features and workflows may
          change during the beta period.
        </div>
      </div>

      <div>
        © 2026 Omnimobile Inc. All Rights Reserved. • QueCab AdbS™ — Patent
        Pending.
      </div>
    </footer>
  );
}
