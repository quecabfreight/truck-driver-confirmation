import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

function cardStyle() {
  return {
    background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 18px 42px rgba(0,0,0,0.22)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };
}

function labelStyle() {
  return {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(220,228,240,0.72)",
    marginBottom: 8,
    fontWeight: 800,
  };
}

function buttonStyle() {
  return {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05))",
    color: "#f7f9fc",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  };
}

function subtleText() {
  return {
    color: "rgba(220,228,240,0.72)",
    fontSize: 14,
    lineHeight: 1.45,
  };
}

export default function IssuedAccessBlock({ smartLink = "", token = "" }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copyState, setCopyState] = useState("Copy");
  const [qrError, setQrError] = useState("");

  useEffect(() => {
    let alive = true;

    async function buildQr() {
      setQrError("");
      setQrDataUrl("");

      const value = String(smartLink || "").trim();
      if (!value) return;

      try {
        const dataUrl = await QRCode.toDataURL(value, {
          errorCorrectionLevel: "M",
          margin: 1,
          width: 260,
        });

        if (alive) {
          setQrDataUrl(dataUrl);
        }
      } catch (err) {
        if (alive) {
          setQrError("Could not generate QR code.");
        }
      }
    }

    buildQr();
    return () => {
      alive = false;
    };
  }, [smartLink]);

  async function handleCopy() {
    const value = String(smartLink || "").trim();
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopyState("Copied");
      window.setTimeout(() => setCopyState("Copy"), 1800);
    } catch {
      setCopyState("Copy failed");
      window.setTimeout(() => setCopyState("Copy"), 1800);
    }
  }

  if (!String(smartLink || "").trim()) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: 18,
        ...cardStyle(),
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 18,
        }}
      >
        <div>
          <div style={labelStyle()}>AdbS SmartLink</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              gap: 10,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                minHeight: 50,
                display: "flex",
                alignItems: "center",
                padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(7,11,16,0.46)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f7f9fc",
                fontSize: 14,
                fontWeight: 700,
                overflow: "hidden",
                wordBreak: "break-all",
              }}
            >
              {smartLink}
            </div>

            <button type="button" onClick={handleCopy} style={buttonStyle()}>
              {copyState}
            </button>
          </div>

          {token ? (
            <div style={{ ...subtleText(), marginTop: 10 }}>
              Token: <span style={{ color: "#f7f9fc", fontWeight: 800 }}>{token}</span>
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.10)" }} />
          <div
            style={{
              color: "rgba(220,228,240,0.66)",
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 900,
            }}
          >
            OR
          </div>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.10)" }} />
        </div>

        <div>
          <div style={labelStyle()}>AdbS QR Code</div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
              padding: 18,
              borderRadius: 16,
              background: "rgba(7,11,16,0.46)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {qrDataUrl ? (
              <>
                <img
                  src={qrDataUrl}
                  alt="AdbS QR Code"
                  style={{
                    width: 260,
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: 12,
                    background: "#ffffff",
                    padding: 12,
                  }}
                />
                <div
                  style={{
                    marginTop: 12,
                    color: "rgba(220,228,240,0.72)",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Same destination as the AdbS SmartLink.
                </div>
              </>
            ) : qrError ? (
              <div
                style={{
                  color: "#ffb7b7",
                  fontSize: 15,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {qrError}
              </div>
            ) : (
              <div
                style={{
                  color: "rgba(220,228,240,0.72)",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Generating QR…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
