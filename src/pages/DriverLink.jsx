import React from "react";
import { useParams } from "react-router-dom";

const STORAGE_KEY_PREFIX = "adbsv1_token_";

export default function DriverLink() {
  const { token } = useParams();

  let record = null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${token}`);
    if (raw) {
      record = JSON.parse(raw);
    }
  } catch {
    record = null;
  }

  const adbSId = record?.adbSId || token;
  const loadRef = record?.loadRef || "Load reference not available (demo).";
  const carrierName = record?.carrierName || "";
  const expires = record?.linkExpires || "";

  const hasRecord = Boolean(record);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "540px",
          width: "100%",
          background: "#020617",
          borderRadius: "20px",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 22px 60px rgba(0,0,0,0.75)",
          padding: "30px 26px 26px",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            marginBottom: "6px",
            textAlign: "center",
          }}
        >
          AdbS Driver Link
        </h1>
        <p
          style={{
            fontSize: "15px",
            textAlign: "center",
            opacity: 0.85,
            marginBottom: "18px",
          }}
        >
          Show this screen to check-in personnel. They will handle the
          AdbS Truck-Driver verification in front of the dock.
        </p>

        <div
          style={{
            marginBottom: "18px",
            padding: "12px 14px",
            borderRadius: "12px",
            background: "#020617",
            border: "1px solid rgba(148,163,184,0.7)",
            fontSize: "14px",
          }}
        >
          <div style={{ marginBottom: "4px" }}>
            <strong>AdbS ID:</strong> {adbSId}
          </div>
          <div style={{ marginBottom: "4px" }}>
            <strong>Load / Reference:</strong> {loadRef}
          </div>
          {carrierName && (
            <div style={{ marginBottom: "4px" }}>
              <strong>Carrier:</strong> {carrierName}
            </div>
          )}
          {expires && (
            <div style={{ opacity: 0.8 }}>
              <strong>Link expires:</strong> {expires}
            </div>
          )}
        </div>

        {/* QR PLACEHOLDER – in production this becomes a real QR code */}
        <div
          style={{
            margin: "0 auto 16px",
            width: "220px",
            height: "220px",
            borderRadius: "18px",
            border: "1px dashed rgba(148,163,184,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          In production, this will be a scannable QR code that opens the dock
          verification link.
        </div>

        <p
          style={{
            fontSize: "14px",
            textAlign: "center",
            marginBottom: "6px",
          }}
        >
          When you arrive at the dock:
        </p>
        <ol
          style={{
            fontSize: "13px",
            opacity: 0.9,
            marginBottom: "10px",
            paddingLeft: "18px",
          }}
        >
          <li>Show this AdbS Driver Link screen to check-in.</li>
          <li>
            They will scan the code or open their AdbS Truck-Driver
            verification link.
          </li>
          <li>
            Follow their instructions and keep your phone nearby for the
            registered phone check.
          </li>
        </ol>

        {!hasRecord && (
          <div
            style={{
              marginTop: "10px",
              fontSize: "12px",
              textAlign: "center",
              opacity: 0.8,
            }}
          >
            Demo notice: This AdbS Driver Link could not find a matching record
            in this browser. In a live system, this screen would be issued by
            the AdbS Control Center for a specific load.
          </div>
        )}
      </div>
    </div>
  );
}
